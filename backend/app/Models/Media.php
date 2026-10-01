<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'medias';
    protected $fillable = [
        'nom', 'chemin_fichier', 'extension', 'taille', 'date_ajout',
        'candidat_id', 'offre_id', 'document_id', 'type_media_id',
    ];

    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }

    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }

    public function typeMedia()
    {
        return $this->belongsTo(TypeMedia::class);
    }

        public function document()
    {
        return $this->belongsTo(Document::class);
    }
}