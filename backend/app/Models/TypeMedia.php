<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeMedia extends Model
{
    protected $table = 'types_medias';
    protected $fillable = ['libelle', 'description'];

    public function medias()
    {
        return $this->hasMany(Media::class);
    }
}