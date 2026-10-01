<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Employe;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    // POST /api/employes/{employe}/evaluations
    public function store(Request $request, Employe $employe)
    {
        $data = $request->validate([
            'date_evaluation' => 'required|date',
            'type'            => 'required|in:Performance,Avertissement,Remarque',
            'note'            => 'nullable|numeric|min:0',
            'contenu'         => 'required|string',
        ]);

        return response()->json($employe->evaluations()->create($data), 201);
    }

    // DELETE /api/evaluations/{evaluation}
    public function destroy(Evaluation $evaluation)
    {
        $evaluation->delete();
        return response()->json(['message' => 'Évaluation supprimée']);
    }
}