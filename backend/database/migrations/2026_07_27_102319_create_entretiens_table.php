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
        Schema::create('entretiens', function (Blueprint $table) {
    $table->id();
    $table->dateTime('date_entretien');
    $table->string('lieu')->nullable();
    $table->string('mode'); // Présentiel / En ligne
    $table->decimal('note_globale', 6, 2)->nullable(); // somme des notes
    $table->text('observation')->nullable();
    $table->foreignId('offre_id')->constrained('offres');
    $table->foreignId('candidat_id')->constrained('candidats');
    $table->foreignId('utilisateur_id')->constrained('users');   // le RH qui note
    $table->foreignId('type_entretien_id')->constrained('types_entretiens');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entretiens');
    }
};
