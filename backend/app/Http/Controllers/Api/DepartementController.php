<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function index() { return Departement::all(); }

    public function store(Request $request)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        return Departement::create($data);
    }

    public function show(Departement $departement) { return $departement; }

    public function update(Request $request, Departement $departement)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        $departement->update($data);
        return $departement;
    }

    public function destroy(Departement $departement)
    {
        $departement->delete();
        return response()->json(['message' => 'Département supprimé']);
    }
}