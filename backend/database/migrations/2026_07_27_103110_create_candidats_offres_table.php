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
        Schema::create('candidats_offres', function (Blueprint $table) {
    $table->id();
    $table->foreignId('candidat_id')->constrained('candidats');
    $table->foreignId('offre_id')->constrained('offres');
    $table->string('statut')->default('Reçue'); // Reçue, Présélectionnée, Convoquée, Retenue, Refusée
    $table->text('justification')->nullable();
    $table->timestamps();
    $table->unique(['candidat_id', 'offre_id']); // un candidat postule 1 fois par offre
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidats_offres');
    }
};
