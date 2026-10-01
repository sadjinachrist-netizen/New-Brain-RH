<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Candidat extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'candidats';
    protected $fillable = ['nom', 'prenom', 'email', 'password', 'telephone', 'adresse', 'date_naissance'];
    protected $hidden = ['password'];
    protected $casts = ['password' => 'hashed'];

    // Les offres auxquelles le candidat a postulé (avec statut + justification)
    public function offres()
    {
        return $this->belongsToMany(Offre::class, 'candidats_offres')
                    ->withPivot('statut', 'justification', 'note_finale')
                    ->withTimestamps();
    }

    public function entretiens()
    {
        return $this->hasMany(Entretien::class);
    }

    public function medias()
    {
        return $this->hasMany(Media::class);
    }

    
}