<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employes', function (Blueprint $table) {
            $table->id();
            $table->string('matricule')->unique();
            $table->date('date_embauche');
            $table->string('statut')->default('Actif'); // Actif / Parti
            $table->date('date_depart')->nullable();
            $table->foreignId('utilisateur_id')->constrained('users');
            $table->foreignId('departement_id')->nullable()->constrained('departements');
            $table->foreignId('candidat_id')->nullable()->constrained('candidats'); // traçabilité (opt.)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employes');
    }
};
