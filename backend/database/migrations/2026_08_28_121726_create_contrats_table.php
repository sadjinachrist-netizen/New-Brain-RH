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
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->decimal('salaire', 12, 2);
            $table->string('statut')->default('Actif'); // Actif / Terminé
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->foreignId('type_contrat_id')->constrained('type_contrats');
            $table->foreignId('poste_id')->constrained('postes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
