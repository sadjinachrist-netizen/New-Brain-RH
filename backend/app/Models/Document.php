<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $table = 'documents';
    protected $fillable = ['libelle', 'description'];

    public function offres()
    {
        return $this->belongsToMany(Offre::class, 'documents_offres')
                    ->withPivot('obligatoire')
                    ->withTimestamps();
    }
}