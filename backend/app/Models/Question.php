<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';
    protected $fillable = ['intitule', 'bareme'];

    public function offres()
    {
        return $this->belongsToMany(Offre::class, 'offres_questions')->withTimestamps();
    }

    public function entretiens()
    {
        return $this->belongsToMany(Entretien::class, 'entretiens_questions')
                    ->withPivot('note')
                    ->withTimestamps();
    }
}