<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandeAbsence;
use Illuminate\Http\Request;

class DemandeAbsenceController extends Controller
{
    // GET /api/demandes-absence  → toutes les demandes (RH)
    public function index()
    {
        return DemandeAbsence::with('typeAbsence', 'employe.utilisateur')->latest('date_soumission')->get();
    }

    // PATCH /api/demandes-absence/{demandeAbsence}  → valider / refuser
    public function traiter(Request $request, DemandeAbsence $demandeAbsence)
    {
        $data = $request->validate([
            'statut'      => 'required|in:Validée,Refusée',
            'motif_refus' => 'nullable|string',
        ]);

        if ($data['statut'] === 'Refusée' && empty($data['motif_refus'])) {
            return response()->json(['message' => 'Un motif de refus est requis.'], 422);
        }

        $demandeAbsence->update([
            'statut'      => $data['statut'],
            'motif_refus' => $data['statut'] === 'Refusée' ? $data['motif_refus'] : null,
        ]);

        return $demandeAbsence->load('typeAbsence', 'employe.utilisateur');
    }
}