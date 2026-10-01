<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\Offre;
use App\Models\Media;
use Illuminate\Http\Request;

class PostulationController extends Controller
{
    // GET /api/postuler/{lien}  → ce que voit le candidat (jamais les questions)
    public function show($lien)
    {
        $offre = Offre::where('lien_postulation', $lien)->firstOrFail();

        if (! $this->offreOuverte($offre)) {
            return response()->json(['message' => "Cette offre n'est plus disponible."], 403);
        }

        $offre->load('domaine', 'documents');

        return [
            'id'          => $offre->id,
            'titre'       => $offre->titre,
            'description' => $offre->description,
            'date_limite' => $offre->date_limite,
            'domaine'     => $offre->domaine,
            'documents'   => $offre->documents, // avec pivot.obligatoire
        ];
    }

    // POST /api/postuler/{lien}  → candidature + 1 fichier par document
    public function store(Request $request, $lien)
    {
        $offre = Offre::where('lien_postulation', $lien)->firstOrFail();

        if (! $this->offreOuverte($offre)) {
            return response()->json(['message' => "Cette offre n'est plus disponible."], 403);
        }

        $data = $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'required|string|max:255',
            'email'          => 'required|email',
            'telephone'      => 'nullable|string',
            'adresse'        => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'documents'      => 'array',
            'documents.*'    => 'file|max:5120',
        ]);

        $offre->load('documents');
        $fichiers = $request->file('documents', []); // [document_id => fichier]

        // Vérifier que tous les documents OBLIGATOIRES sont fournis
        foreach ($offre->documents as $doc) {
            if ($doc->pivot->obligatoire && empty($fichiers[$doc->id])) {
                return response()->json(['message' => "Le document « {$doc->libelle} » est obligatoire."], 422);
            }
        }

        $candidat = Candidat::updateOrCreate(['email' => $data['email']], [
            'nom'            => $data['nom'],
            'prenom'         => $data['prenom'],
            'telephone'      => $data['telephone'] ?? null,
            'adresse'        => $data['adresse'] ?? null,
            'date_naissance' => $data['date_naissance'] ?? null,
        ]);
        

        if ($offre->candidats()->where('candidat_id', $candidat->id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
        }

        $offre->candidats()->attach($candidat->id, ['statut' => 'Reçue']);

        $docIds = $offre->documents->pluck('id')->all();
        foreach ($fichiers as $documentId => $file) {
            if (! in_array((int) $documentId, $docIds)) continue; // sécurité
            $path = $file->store('candidatures', 'public');
            Media::create([
                'nom'            => $file->getClientOriginalName(),
                'chemin_fichier' => $path,
                'extension'      => $file->getClientOriginalExtension(),
                'taille'         => intval($file->getSize() / 1024),
                'date_ajout'     => now(),
                'candidat_id'    => $candidat->id,
                'offre_id'       => $offre->id,
                'document_id'    => (int) $documentId,
            ]);
        }

        return response()->json([
            'message'  => 'Candidature envoyée avec succès.',
            'candidat' => $candidat->load('medias'),
        ], 201);
    }

        // POST /api/candidat/postuler/{lien}  (candidat CONNECTÉ)
    public function postuler(Request $request, $lien)
    {
        $candidat = $request->user(); // le candidat authentifié (token candidat)

        $offre = Offre::where('lien_postulation', $lien)->firstOrFail();
        if (! $this->offreOuverte($offre)) {
            return response()->json(['message' => "Cette offre n'est plus disponible."], 403);
        }

        $data = $request->validate([
            'adresse'        => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'documents'      => 'array',
            'documents.*'    => 'file|max:5120',
        ]);

        // compléter le profil du candidat s'il renseigne ces champs
        if (!empty($data['adresse']))        $candidat->adresse = $data['adresse'];
        if (!empty($data['date_naissance'])) $candidat->date_naissance = $data['date_naissance'];
        $candidat->save();

        $offre->load('documents');
        $fichiers = $request->file('documents', []);

        // documents obligatoires
        foreach ($offre->documents as $doc) {
            if ($doc->pivot->obligatoire && empty($fichiers[$doc->id])) {
                return response()->json(['message' => "Le document « {$doc->libelle} » est obligatoire."], 422);
            }
        }

        // déjà postulé ?
        if ($offre->candidats()->where('candidat_id', $candidat->id)->exists()) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre.'], 409);
        }

        $offre->candidats()->attach($candidat->id, ['statut' => 'Reçue']);

        $docIds = $offre->documents->pluck('id')->all();
        foreach ($fichiers as $documentId => $file) {
            if (! in_array((int) $documentId, $docIds)) continue;
            $path = $file->store('candidatures', 'public');
            Media::create([
                'nom'            => $file->getClientOriginalName(),
                'chemin_fichier' => $path,
                'extension'      => $file->getClientOriginalExtension(),
                'taille'         => intval($file->getSize() / 1024),
                'date_ajout'     => now(),
                'candidat_id'    => $candidat->id,
                'offre_id'       => $offre->id,
                'document_id'    => (int) $documentId,
            ]);
        }

        return response()->json(['message' => 'Candidature envoyée avec succès.'], 201);
    }

    // Fonction utilitaire : l'offre est-elle encore ouverte ?
    private function offreOuverte(Offre $offre): bool
    {
        if ($offre->statut !== 'Ouverte') {
            return false;
        }
        if ($offre->date_limite && now()->gt($offre->date_limite)) {
            return false;
        }
        return true;
    }
}