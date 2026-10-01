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
        Schema::create('documents_offres', function (Blueprint $table) {
    $table->id();
    $table->foreignId('document_id')->constrained('documents');
    $table->foreignId('offre_id')->constrained('offres');
    $table->boolean('obligatoire')->default(true);
    $table->timestamps();
    $table->unique(['document_id', 'offre_id']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents_offres');
    }
};
