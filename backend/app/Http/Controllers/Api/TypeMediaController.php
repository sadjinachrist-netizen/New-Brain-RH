<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeMedia;
use Illuminate\Http\Request;

class TypeMediaController extends Controller
{
    public function index()
    {
        return TypeMedia::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        return TypeMedia::create($data);
    }

    public function show(TypeMedia $typeMedia)
    {
        return $typeMedia;
    }

    public function update(Request $request, TypeMedia $typeMedia)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $typeMedia->update($data);
        return $typeMedia;
    }

    public function destroy(TypeMedia $typeMedia)
    {
        $typeMedia->delete();
        return response()->json(['message' => 'Type de média supprimé']);
    }
}