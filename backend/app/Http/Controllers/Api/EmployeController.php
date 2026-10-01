<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmployeController extends Controller
{
    // GET /api/employes
    public function index()
    {
        return Employe::with('utilisateur', 'departement')->latest()->get();
    }

    // POST /api/employes
    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'telephone'      => 'nullable|string',
            'matricule'      => 'required|string|unique:employes,matricule',
            'date_embauche'  => 'required|date',
            'departement_id' => 'required|exists:departements,id',
            'candidat_id'    => 'nullable|exists:candidats,id',
        ]);

        // 1) compte Utilisateur (rôle Employé), sans mot de passe utilisable
        $user = User::create([
            'nom'       => $data['nom'],
            'prenom'    => $data['prenom'],
            'email'     => $data['email'],
            'login'     => $data['email'],
            'telephone' => $data['telephone'] ?? null,
            'role'      => 'Employé',
            'password'  => Str::random(32), // provisoire (activation du compte = phase 6)
        ]);

        // 2) fiche Employé
        $employe = Employe::create([
            'matricule'      => $data['matricule'],
            'date_embauche'  => $data['date_embauche'],
            'statut'         => 'Actif',
            'utilisateur_id' => $user->id,
            'departement_id' => $data['departement_id'],
            'candidat_id'    => $data['candidat_id'] ?? null,
        ]);

        return response()->json($employe->load('utilisateur', 'departement'), 201);
    }

    // GET /api/employes/{employe}
    public function show(Employe $employe)
    {
        return $employe->load('utilisateur', 'departement', 'candidat', 'contrats.typeContrat', 'contrats.poste', 'evaluations', 'documentsRh.typeDocument');
    }

    // PUT/PATCH /api/employes/{employe}
    public function update(Request $request, Employe $employe)
    {
        $data = $request->validate([
            'matricule'      => 'sometimes|required|string|unique:employes,matricule,' . $employe->id,
            'date_embauche'  => 'sometimes|required|date',
            'departement_id' => 'sometimes|required|exists:departements,id',
            'statut'         => 'nullable|in:Actif,Parti',
            'date_depart'    => 'nullable|date',
            // infos du compte (optionnel)
            'nom'            => 'sometimes|required|string|max:255',
            'prenom'         => 'sometimes|required|string|max:255',
            'telephone'      => 'nullable|string',
        ]);

        $employe->update(collect($data)->only(['matricule', 'date_embauche', 'departement_id', 'statut', 'date_depart'])->toArray());

        if ($employe->utilisateur) {
            $employe->utilisateur->update(collect($data)->only(['nom', 'prenom', 'telephone'])->toArray());
        }

        return $employe->load('utilisateur', 'departement');
    }

    // DELETE /api/employes/{employe}
    public function destroy(Employe $employe)
    {
        $user = $employe->utilisateur;
        $employe->delete();
        if ($user) $user->delete();
        return response()->json(['message' => 'Employé supprimé']);
    }

    // PATCH /api/employes/{employe}/depart  → marquer comme parti
    public function depart(Request $request, Employe $employe)
    {
        $data = $request->validate(['date_depart' => 'nullable|date']);
        $employe->update([
            'statut'      => 'Parti',
            'date_depart' => $data['date_depart'] ?? now()->toDateString(),
        ]);
        // (génération lettre + attestation = phase 5)
        return $employe->load('utilisateur', 'departement');
    }


        // PATCH /api/employes/{employe}/acces  → le RH définit le mot de passe de l'employé
    public function definirAcces(Request $request, Employe $employe)
    {
        $data = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        if ($employe->utilisateur) {
            $employe->utilisateur->update(['password' => $data['password']]); // haché via le cast
        }
        $employe->update(['acces_actif' => true]);

        return response()->json(['message' => "Accès activé pour l'employé."]);
    }
}