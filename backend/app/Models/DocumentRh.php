<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DocumentRh extends Model
{
    protected $table = 'documents_rh';
    protected $fillable = ['nom', 'chemin_fichier', 'date_generation', 'employe_id', 'type_document_rh_id'];

    public function employe()      { return $this->belongsTo(Employe::class); }
    public function typeDocument()  { return $this->belongsTo(TypeDocumentRh::class, 'type_document_rh_id'); }
}