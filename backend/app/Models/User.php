<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nom', 'prenom', 'email', 'login', 'telephone', 'role', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function offres()
    {
        return $this->hasMany(Offre::class, 'utilisateur_id');
    }

    public function entretiens()
    {
        return $this->hasMany(Entretien::class, 'utilisateur_id');
    }

    public function employe()
    { 
        return $this->hasOne(Employe::class, 'utilisateur_id');
    }
}