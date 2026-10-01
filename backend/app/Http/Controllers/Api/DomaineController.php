<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use Illuminate\Http\Request;

class DomaineController extends Controller
{
    // GET /api/domaines
    public function index()
    {
        return Domaine::all();
    }

    // POST /api/domaines
    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        return Domaine::create($data);
    }

    // GET /api/domaines/{domaine}
    public function show(Domaine $domaine)
    {
        return $domaine;
    }

    // PUT/PATCH /api/domaines/{domaine}
    public function update(Request $request, Domaine $domaine)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $domaine->update($data);

        return $domaine;
    }

    // DELETE /api/domaines/{domaine}
    public function destroy(Domaine $domaine)
    {
        $domaine->delete();

        return response()->json(['message' => 'Domaine supprimé']);
    }
}