<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Poste;
use Illuminate\Http\Request;

class PosteController extends Controller
{
    public function index() { return Poste::all(); }

    public function store(Request $request)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        return Poste::create($data);
    }

    public function show(Poste $poste) { return $poste; }

    public function update(Request $request, Poste $poste)
    {
        $data = $request->validate(['libelle' => 'required|string|max:255', 'description' => 'nullable|string']);
        $poste->update($data);
        return $poste;
    }

    public function destroy(Poste $poste)
    {
        $poste->delete();
        return response()->json(['message' => 'Poste supprimé']);
    }
}