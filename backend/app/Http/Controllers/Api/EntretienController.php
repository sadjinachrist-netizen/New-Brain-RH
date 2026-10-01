<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Entretien;
use App\Models\Offre;
use Illuminate\Http\Request;

class EntretienController extends Controller
{
    // GET /api/offres/{offre}/entretiens
    public function index(Offre $offre)
    {
        return Entretien::where('offre_id', $offre->id)
            ->with('candidat', 'typeEntretien', 'questions')
            ->get();
    }

    // POST /api/offres/{offre}/entretiens  → noter un candidat via la grille
    public function store(Request $request, Offre $offre)
    {
        $data = $request->validate([
            'candidat_id'        => 'required|exists:candidats,id',
            'utilisateur_id'     => 'required|exists:users,id',
            'type_entretien_id'  => 'required|exists:types_entretiens,id',
            'date_entretien'     => 'required|date',
            'lieu'               => 'nullable|string',
            'mode'               => 'required|in:Présentiel,En ligne,Téléphone',
            'observation'        => 'nullable|string',
            'notes'              => 'required|array|min:1',
            'notes.*.question_id' => 'required|exists:questions,id',
            'notes.*.note'       => 'required|numeric|min:0',
        ]);

        // le candidat a-t-il postulé à cette offre ?
        if (! $offre->candidats()->where('candidat_id', $data['candidat_id'])->exists()) {
            return response()->json(['message' => "Ce candidat n'a pas postulé à cette offre."], 404);
        }

        // note globale = somme des notes des questions
        $noteGlobale = collect($data['notes'])->sum('note');

        $entretien = Entretien::create([
            'date_entretien'    => $data['date_entretien'],
            'lieu'              => $data['lieu'] ?? null,
            'mode'              => $data['mode'],
            'note_globale'      => $noteGlobale,
            'observation'       => $data['observation'] ?? null,
            'offre_id'          => $offre->id,
            'candidat_id'       => $data['candidat_id'],
            'utilisateur_id'    => $data['utilisateur_id'],
            'type_entretien_id' => $data['type_entretien_id'],
        ]);

        // enregistrer chaque note dans le pivot entretiens_questions
        $sync = [];
        foreach ($data['notes'] as $n) {
            $sync[$n['question_id']] = ['note' => $n['note']];
        }
        $entretien->questions()->sync($sync);

        return response()->json(
            $entretien->load('candidat', 'typeEntretien', 'questions'),
            201
        );
    }

    // GET /api/offres/{offre}/classement  → candidats classés par note (décroissant)
    public function classement(Offre $offre)
    {
        return Entretien::where('offre_id', $offre->id)
            ->with('candidat')
            ->orderByDesc('note_globale')
            ->get();
    }
}