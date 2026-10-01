<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    public function index()
    {
        return User::select('id', 'nom', 'prenom', 'email', 'login', 'telephone', 'role', 'created_at')
            ->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'login'     => 'required|string|unique:users,login',
            'telephone' => 'nullable|string',
            'role'      => 'required|in:RH,DG,Administrateur',
            'password'  => 'required|string|min:6',
        ]);

        $user = User::create($data); // le mot de passe est haché automatiquement (cast 'hashed')

        return response()->json($user->only('id', 'nom', 'prenom', 'email', 'login', 'role'), 201);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}