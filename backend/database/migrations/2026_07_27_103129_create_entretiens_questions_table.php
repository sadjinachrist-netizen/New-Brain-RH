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
        Schema::create('entretiens_questions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('entretien_id')->constrained('entretiens');
    $table->foreignId('question_id')->constrained('questions');
    $table->decimal('note', 5, 2)->nullable(); // note obtenue à la question
    $table->timestamps();
    $table->unique(['entretien_id', 'question_id']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entretiens_questions');
    }
};
