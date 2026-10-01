<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeEntretien;
use Illuminate\Http\Request;

class TypeEntretienController extends Controller
{
    public function index()
    {
        return TypeEntretien::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        return TypeEntretien::create($data);
    }

    public function show(TypeEntretien $typeEntretien)
    {
        return $typeEntretien;
    }

    public function update(Request $request, TypeEntretien $typeEntretien)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $typeEntretien->update($data);
        return $typeEntretien;
    }

    public function destroy(TypeEntretien $typeEntretien)
    {
        $typeEntretien->delete();
        return response()->json(['message' => 'Type d\'entretien supprimé']);
    }
}