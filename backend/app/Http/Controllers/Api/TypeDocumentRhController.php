<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeDocumentRh;
use Illuminate\Http\Request;

class TypeDocumentRhController extends Controller
{
    public function index() { return TypeDocumentRh::all(); }

    public function store(Request $request)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        return TypeDocumentRh::create($data);
    }

    public function show(TypeDocumentRh $typeDocumentRh) { return $typeDocumentRh; }

    public function update(Request $request, TypeDocumentRh $typeDocumentRh)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        $typeDocumentRh->update($data);
        return $typeDocumentRh;
    }

    public function destroy(TypeDocumentRh $typeDocumentRh)
    {
        $typeDocumentRh->delete();
        return response()->json(['message' => 'Type de document RH supprimé']);
    }
}