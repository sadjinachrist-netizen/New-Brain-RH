<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entretien extends Model
{
    protected $table = 'entretiens';
    protected $fillable = [
        'date_entretien', 'lieu', 'mode', 'note_globale', 'observation',
        'offre_id', 'candidat_id', 'utilisateur_id', 'type_entretien_id',
    ];

    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function typeEntretien()
    {
        return $this->belongsTo(TypeEntretien::class);
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'entretiens_questions')
                    ->withPivot('note')
                    ->withTimestamps();
    }
}