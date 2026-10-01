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
        Schema::create('offres', function (Blueprint $table) {
    $table->id();
    $table->string('titre');
    $table->text('description');
    $table->string('lien_postulation')->unique();
    $table->dateTime('date_publication')->nullable();
    $table->date('date_limite')->nullable();
    $table->string('statut')->default('Ouverte'); // Ouverte / Fermée
    $table->foreignId('utilisateur_id')->constrained('users');   // le RH qui publie
    $table->foreignId('domaine_id')->constrained('domaines');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};
