<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeNotification extends Model
{
    protected $table = 'types_notifications';
    protected $fillable = ['libelle', 'description'];

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}