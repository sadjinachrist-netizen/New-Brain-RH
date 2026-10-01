<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class CandidatAuthController extends Controller
{
    // POST /api/candidat/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'required|string|max:255',
            'email'          => 'required|email|unique:candidats,email',
            'password'       => 'required|string|min:6|confirmed',
            'telephone'      => 'nullable|string',
            'adresse'        => 'nullable|string',
            'date_naissance' => 'nullable|date',
        ]);

        $candidat = Candidat::create($data);
        $token = $candidat->createToken('candidat', ['candidat'])->plainTextToken;

        return response()->json(['candidat' => $candidat, 'token' => $token], 201);
    }

    // POST /api/candidat/login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $candidat = Candidat::where('email', $data['email'])->first();

        if (! $candidat || ! $candidat->password || ! Hash::check($data['password'], $candidat->password)) {
            throw ValidationException::withMessages(['email' => ['Email ou mot de passe incorrect.']]);
        }

        $token = $candidat->createToken('candidat', ['candidat'])->plainTextToken;

        return response()->json(['candidat' => $candidat, 'token' => $token]);
    }

    // GET /api/candidat/me
    public function me(Request $request)
    {
        return $request->user();
    }

    // POST /api/candidat/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }


        // GET /api/candidat/mes-candidatures
    public function mesCandidatures(Request $request)
    {
        return $request->user()->offres()->with('domaine')->get()->map(function ($o) {
            return [
                'id'      => $o->id,
                'titre'   => $o->titre,
                'domaine' => $o->domaine?->libelle,
                'statut'  => $o->pivot->statut,
                'date'    => $o->pivot->created_at,
            ];
        });
    }
}