<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DemandeAbsence extends Model
{
    protected $table = 'demandes_absence';
    protected $fillable = ['date_debut', 'date_fin', 'motif', 'statut', 'motif_refus', 'date_soumission', 'employe_id', 'type_absence_id'];

    public function employe()     { return $this->belongsTo(Employe::class); }
    public function typeAbsence()  { return $this->belongsTo(TypeAbsence::class); }
}