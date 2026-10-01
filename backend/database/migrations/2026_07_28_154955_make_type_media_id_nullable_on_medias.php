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
        Schema::table('medias', function (Blueprint $table) {
            $table->dropForeign(['type_media_id']);
        });
        Schema::table('medias', function (Blueprint $table) {
            $table->unsignedBigInteger('type_media_id')->nullable()->change();
        });
        Schema::table('medias', function (Blueprint $table) {
            $table->foreign('type_media_id')->references('id')->on('types_medias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
