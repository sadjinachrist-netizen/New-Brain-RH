<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    protected $fillable = [
        'matricule', 'date_embauche', 'statut', 'date_depart',
        'utilisateur_id', 'departement_id', 'candidat_id', 'acces_actif',
    ];

    public function utilisateur() { return $this->belongsTo(User::class, 'utilisateur_id'); }
    public function departement() { return $this->belongsTo(Departement::class); }
    public function candidat()    { return $this->belongsTo(Candidat::class); }
    
    // contrats / evaluations / documentsRh : ajoutés aux phases suivantes
    public function contrats()      { return $this->hasMany(Contrat::class)->latest('date_debut'); }
    public function contratActif()  { return $this->hasOne(Contrat::class)->where('statut', 'Actif'); }

    public function evaluations() { return $this->hasMany(Evaluation::class)->latest('date_evaluation'); }

    public function documentsRh() { return $this->hasMany(DocumentRh::class)->latest('date_generation'); }

    public function demandesAbsence() { return $this->hasMany(DemandeAbsence::class)->latest('date_soumission'); }
}