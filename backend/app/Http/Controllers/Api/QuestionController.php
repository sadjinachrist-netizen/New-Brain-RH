<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        return Question::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'intitule' => 'required|string',
            'bareme' => 'required|numeric|min:0',
        ]);
        return Question::create($data);
    }

    public function show(Question $question)
    {
        return $question;
    }

    public function update(Request $request, Question $question)
    {
        $data = $request->validate([
            'intitule' => 'required|string',
            'bareme' => 'required|numeric|min:0',
        ]);
        $question->update($data);
        return $question;
    }

    public function destroy(Question $question)
    {
        $question->delete();
        return response()->json(['message' => 'Question supprimée']);
    }
}