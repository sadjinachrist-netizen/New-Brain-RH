<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeEntretien extends Model
{
    protected $table = 'types_entretiens';
    protected $fillable = ['libelle', 'description'];

    public function entretiens()
    {
        return $this->hasMany(Entretien::class);
    }
}