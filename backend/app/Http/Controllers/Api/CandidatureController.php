<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\Offre;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;

class CandidatureController extends Controller
{
    // GET /api/offres/{offre}/candidatures  → toutes les candidatures d'une offre (côté RH)
        public function index(Offre $offre)
    {
        return $offre->candidats()
            ->with([
                'medias'     => fn ($q) => $q->where('offre_id', $offre->id),
                'entretiens' => fn ($q) => $q->where('offre_id', $offre->id),
            ])
            ->get();
    }

    // PATCH /api/offres/{offre}/candidatures/{candidat}  → changer le statut d'une candidature
        // PATCH /api/offres/{offre}/candidatures/{candidat}
    public function update(Request $request, Offre $offre, Candidat $candidat)
    {
        $data = $request->validate([
            'statut'        => 'sometimes|required|in:Reçue,Retenue,Refusée',
            'justification' => 'nullable|string',
            'note_finale'   => 'nullable|numeric|min:0',
        ]);

        if (! $offre->candidats()->where('candidat_id', $candidat->id)->exists()) {
            return response()->json(['message' => "Ce candidat n'a pas postulé à cette offre."], 404);
        }

        $offre->candidats()->updateExistingPivot($candidat->id, $data);

        return response()->json(['message' => 'Candidature mise à jour.']);
    }
    

        // POST /api/offres/{offre}/candidatures/{candidat}/email
    public function envoyerEmail(Request $request, Offre $offre, Candidat $candidat)
    {
        $data = $request->validate([
            'notification_id' => 'required|exists:notifications,id',
        ]);

        if (! $offre->candidats()->where('candidat_id', $candidat->id)->exists()) {
            return response()->json(['message' => "Ce candidat n'a pas postulé à cette offre."], 404);
        }

        $modele = Notification::with('typeNotification')->findOrFail($data['notification_id']);

        // Remplacer les marqueurs par les vraies infos
        $corps = str_replace(
            ['{nom}', '{offre}'],
            [$candidat->nom . ' ' . $candidat->prenom, $offre->titre],
            $modele->contenu
        );

        $sujet = ($modele->typeNotification->libelle ?? 'Message') . ' — New Brain Factory RH';

        Mail::raw($corps, function ($m) use ($candidat, $sujet) {
            $m->to($candidat->email)->subject($sujet);
        });

        return response()->json(['message' => 'Email envoyé à ' . $candidat->email]);
    }

        // GET /api/candidatures  → toutes les offres avec leurs candidats
    public function all()
    {
        return Offre::with('candidats')->withCount('candidats')->latest()->get();
    }
}