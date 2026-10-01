<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employe;
use Illuminate\Http\Request;

class EspaceController extends Controller
{
    // GET /api/espace/moi  → la fiche de l'employé connecté
    public function moi(Request $request)
    {
        $employe = Employe::where('utilisateur_id', $request->user()->id)
            ->with('utilisateur', 'departement', 'contratActif.poste', 'contratActif.typeContrat', 'documentsRh.typeDocument')
            ->first();

        if (! $employe) {
            return response()->json(['message' => 'Aucune fiche employé associée à ce compte.'], 404);
        }
        return $employe;
    }

    // GET /api/espace/demandes-absence  → les demandes de l'employé connecté
    public function mesDemandes(Request $request)
    {
        $employe = Employe::where('utilisateur_id', $request->user()->id)->first();
        if (! $employe) return response()->json([]);

        return $employe->demandesAbsence()->with('typeAbsence')->get();
    }

    // POST /api/espace/demandes-absence  → soumettre une demande
    public function soumettreDemande(Request $request)
    {
        $employe = Employe::where('utilisateur_id', $request->user()->id)->firstOrFail();

        $data = $request->validate([
            'type_absence_id' => 'required|exists:type_absences,id',
            'date_debut'      => 'required|date',
            'date_fin'        => 'required|date|after_or_equal:date_debut',
            'motif'           => 'required|string',
        ]);

        $demande = $employe->demandesAbsence()->create(array_merge($data, [
            'statut'          => 'En attente',
            'date_soumission' => now(),
        ]));

        return response()->json($demande->load('typeAbsence'), 201);
    }

        // GET /api/espace/type-absences
    public function typesAbsence()
    {
        return \App\Models\TypeAbsence::all();
    }
}