<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use App\Models\Entretien;
use App\Models\Employe;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function recrutement()
    {
        $parStatut = DB::table('candidats_offres')
            ->select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->pluck('total', 'statut');

        return [
            'offres_total'       => Offre::count(),
            'offres_ouvertes'    => Offre::where('statut', 'Ouverte')->count(),
            'candidatures_total' => DB::table('candidats_offres')->count(),
            'entretiens_total'   => Entretien::count(),
            'employes_total'     => Employe::count(),
            'employes_actifs'    => Employe::where('statut', 'Actif')->count(),
            'par_statut'         => [
                'Reçue'           => $parStatut['Reçue'] ?? 0,
                'Retenue'         => $parStatut['Retenue'] ?? 0,
                'Refusée'         => $parStatut['Refusée'] ?? 0,
            ],
        ];
    }
}