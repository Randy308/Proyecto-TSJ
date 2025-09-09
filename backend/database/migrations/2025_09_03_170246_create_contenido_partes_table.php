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
        Schema::create('contenido_partes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->nullable();
            $table->string('texto')->nullable();
            $table->unsignedBigInteger('contenido_parte_id')->nullable();
            $table->unsignedBigInteger('resolution_id')->nullable();
            $table->foreign('contenido_parte_id')->references('id')->on('contenido_partes')->onDelete('cascade');
            $table->foreign('resolution_id')->references('id')->on('resolutions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contenido_partes');
    }
};
