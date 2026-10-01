<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    protected $table = 'offres';
    protected $fillable = [
        'titre', 'description', 'lien_postulation', 'date_publication',
        'date_limite', 'statut', 'utilisateur_id', 'domaine_id',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }

    public function entretiens()
    {
        return $this->hasMany(Entretien::class);
    }

    public function medias()
    {
        return $this->hasMany(Media::class);
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'offres_questions')->withTimestamps();
    }

    public function documents()
    {
        return $this->belongsToMany(Document::class, 'documents_offres')
                    ->withPivot('obligatoire')
                    ->withTimestamps();
    }

    // Les candidats qui ont postulé (la candidature : statut + justification)
    public function candidats()
    {
        return $this->belongsToMany(Candidat::class, 'candidats_offres')
                    ->withPivot('statut', 'justification', 'note_finale')
                    ->withTimestamps();
    }
}