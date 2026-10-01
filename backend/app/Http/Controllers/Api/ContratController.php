<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrat;
use App\Models\Employe;
use Illuminate\Http\Request;

class ContratController extends Controller
{
    // POST /api/employes/{employe}/contrats
    public function store(Request $request, Employe $employe)
    {
        $data = $request->validate([
            'type_contrat_id' => 'required|exists:type_contrats,id',
            'poste_id'        => 'required|exists:postes,id',
            'date_debut'      => 'required|date',
            'date_fin'        => 'nullable|date|after_or_equal:date_debut',
            'salaire'         => 'required|numeric|min:0',
        ]);

        // clore le contrat actif précédent
        $employe->contrats()->where('statut', 'Actif')->update(['statut' => 'Terminé']);

        $contrat = $employe->contrats()->create(array_merge($data, ['statut' => 'Actif']));

        return response()->json($contrat->load('typeContrat', 'poste'), 201);
    }

    // DELETE /api/contrats/{contrat}
    public function destroy(Contrat $contrat)
    {
        $contrat->delete();
        return response()->json(['message' => 'Contrat supprimé']);
    }
}