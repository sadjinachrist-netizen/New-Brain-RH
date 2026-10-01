<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $fillable = ['contenu', 'date_envoi', 'type_notification_id'];

    public function typeNotification()
    {
        return $this->belongsTo(TypeNotification::class);
    }
}