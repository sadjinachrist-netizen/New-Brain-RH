<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeAbsence;
use Illuminate\Http\Request;

class TypeAbsenceController extends Controller
{
    public function index() { return TypeAbsence::all(); }

    public function store(Request $request)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        return TypeAbsence::create($data);
    }

    public function show(TypeAbsence $typeAbsence) { return $typeAbsence; }

    public function update(Request $request, TypeAbsence $typeAbsence)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        $typeAbsence->update($data);
        return $typeAbsence;
    }

    public function destroy(TypeAbsence $typeAbsence)
    {
        $typeAbsence->delete();
        return response()->json(['message' => 'Type d\'absence supprimé']);
    }
}