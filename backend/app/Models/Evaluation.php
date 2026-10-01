<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = ['date_evaluation', 'type', 'note', 'contenu', 'employe_id'];

    public function employe() { return $this->belongsTo(Employe::class); }
}