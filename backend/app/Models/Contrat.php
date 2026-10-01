<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    protected $fillable = [
        'date_debut', 'date_fin', 'salaire', 'statut',
        'employe_id', 'type_contrat_id', 'poste_id',
    ];

    public function employe()     { return $this->belongsTo(Employe::class); }
    public function typeContrat()  { return $this->belongsTo(TypeContrat::class); }
    public function poste()        { return $this->belongsTo(Poste::class); }
}