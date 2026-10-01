<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OffreController extends Controller
{
    // GET /api/offres
        public function index()
    {
        return Offre::with(['domaine', 'utilisateur'])
            ->withCount('candidats')   // ajoute "candidats_count" à chaque offre
            ->latest()
            ->get();
    }

        // GET /api/offres-publiques  (public — visible par les candidats)
    public function publiques()
    {
        return Offre::with('domaine')
            ->where('statut', 'Ouverte')
            ->where(function ($q) {
                $q->whereNull('date_limite')->orWhereDate('date_limite', '>=', now());
            })
            ->latest('date_publication')
            ->get(['id', 'titre', 'description', 'lien_postulation', 'date_publication', 'date_limite', 'domaine_id', 'statut']);
    }

    // POST /api/offres
    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'date_limite' => 'nullable|date',
            'statut' => 'nullable|in:Ouverte,Fermée',
            'domaine_id' => 'required|exists:domaines,id',
            'utilisateur_id' => 'required|exists:users,id',
            'documents' => 'array',                 // documents à fournir
            'documents.*.id' => 'required|exists:documents,id',
            'documents.*.obligatoire' => 'boolean',
            'questions' => 'array',                 // ids des questions d'entretien
            'questions.*' => 'exists:questions,id',
        ]);

        $offre = Offre::create([
            'titre' => $data['titre'],
            'description' => $data['description'],
            'lien_postulation' => Str::uuid(),      // lien unique généré automatiquement
            'date_publication' => now(),
            'date_limite' => $data['date_limite'] ?? null,
            'statut' => $data['statut'] ?? 'Ouverte',
            'domaine_id' => $data['domaine_id'],
            'utilisateur_id' => $data['utilisateur_id'],
        ]);

        // Associer les documents demandés (avec le flag obligatoire)
        if (!empty($data['documents'])) {
            $sync = [];
            foreach ($data['documents'] as $doc) {
                $sync[$doc['id']] = ['obligatoire' => $doc['obligatoire'] ?? true];
            }
            $offre->documents()->sync($sync);
        }

        // Associer les questions
        if (!empty($data['questions'])) {
            $offre->questions()->sync($data['questions']);
        }

        return $offre->load(['domaine', 'utilisateur', 'documents', 'questions']);
    }

    // GET /api/offres/{offre}
    public function show(Offre $offre)
    {
        return $offre->load(['domaine', 'utilisateur', 'documents', 'questions']);
    }

    // PUT/PATCH /api/offres/{offre}
    public function update(Request $request, Offre $offre)
    {
        $data = $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'date_limite' => 'nullable|date',
            'statut' => 'nullable|in:Ouverte,Fermée',
            'domaine_id' => 'sometimes|required|exists:domaines,id',
            'documents' => 'array',
            'documents.*.id' => 'required|exists:documents,id',
            'documents.*.obligatoire' => 'boolean',
            'questions' => 'array',
            'questions.*' => 'exists:questions,id',
        ]);

        $offre->update($data);

        if ($request->has('documents')) {
            $sync = [];
            foreach (($data['documents'] ?? []) as $doc) {
                $sync[$doc['id']] = ['obligatoire' => $doc['obligatoire'] ?? true];
            }
            $offre->documents()->sync($sync);
        }
        if ($request->has('questions')) {
            $offre->questions()->sync($data['questions'] ?? []);
        }

        return $offre->load(['domaine', 'utilisateur', 'documents', 'questions']);
    }

    // DELETE /api/offres/{offre}
    public function destroy(Offre $offre)
    {
        $offre->delete();
        return response()->json(['message' => 'Offre supprimée']);
    }
}