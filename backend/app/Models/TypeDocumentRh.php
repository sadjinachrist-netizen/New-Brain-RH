<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TypeDocumentRh extends Model
{
    protected $table = 'type_document_rhs';
    protected $fillable = ['libelle', 'description'];
}