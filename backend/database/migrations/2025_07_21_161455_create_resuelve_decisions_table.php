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
        Schema::create('resuelve_decisiones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resolution_id')->unique();
            $table->unsignedBigInteger('resuelve_fondo_id')->nullable();
            $table->string('nombre')->nullable();
            $table->integer('tipo')->nullable();
            $table->string('observaciones')->nullable();
            $table->foreign('resolution_id')->references('id')->on('resolutions')->onDelete('cascade');
            $table->foreign('resuelve_fondo_id')->references('id')->on('resuelve_fondos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resuelve_decisions');
    }
};
