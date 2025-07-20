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
        Schema::create('resuelve_fondos', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_decision');
            $table->unsignedBigInteger('sala_id')->nullable();
            $table->string('nombre');
            $table->string('slug');
            $table->foreign('sala_id')->references('id')->on('salas')->onDelete('set null')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resuelve_fondos');
    }
};
