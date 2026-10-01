<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domaine extends Model
{
    protected $table = 'domaines';
    protected $fillable = ['libelle', 'description'];

    public function offres()
    {
        return $this->hasMany(Offre::class);
    }
}