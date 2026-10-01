<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeContrat;
use Illuminate\Http\Request;

class TypeContratController extends Controller
{
    public function index() { return TypeContrat::all(); }

    public function store(Request $request)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        return TypeContrat::create($data);
    }

    public function show(TypeContrat $typeContrat) { return $typeContrat; }

    public function update(Request $request, TypeContrat $typeContrat)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        $typeContrat->update($data);
        return $typeContrat;
    }

    public function destroy(TypeContrat $typeContrat)
    {
        $typeContrat->delete();
        return response()->json(['message' => 'Type de contrat supprimé']);
    }
}