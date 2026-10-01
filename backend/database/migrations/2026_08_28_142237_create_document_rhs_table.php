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
        Schema::create('documents_rh', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('chemin_fichier');
            $table->dateTime('date_generation');
            $table->foreignId('employe_id')->constrained('employes')->cascadeOnDelete();
            $table->foreignId('type_document_rh_id')->constrained('type_document_rhs'); // ⚠️ table réelle
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_rhs');
    }
};
