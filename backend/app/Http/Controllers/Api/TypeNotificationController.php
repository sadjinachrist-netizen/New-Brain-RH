<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeNotification;
use Illuminate\Http\Request;

class TypeNotificationController extends Controller
{
    public function index()
    {
        return TypeNotification::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        return TypeNotification::create($data);
    }

    public function show(TypeNotification $typeNotification)
    {
        return $typeNotification;
    }

    public function update(Request $request, TypeNotification $typeNotification)
    {
        $data = $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $typeNotification->update($data);
        return $typeNotification;
    }

    public function destroy(TypeNotification $typeNotification)
    {
        $typeNotification->delete();
        return response()->json(['message' => 'Type de notification supprimé']);
    }
}