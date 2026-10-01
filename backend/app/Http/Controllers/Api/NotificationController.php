<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;

class NotificationController extends Controller
{
    // GET /api/notifications  → les modèles de messages (avec leur type)
    public function index()
    {
        return Notification::with('typeNotification')->get();
    }
}