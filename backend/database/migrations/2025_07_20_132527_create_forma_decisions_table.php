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
        Schema::create('forma_decisiones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resuelve_fondo_id')->nullable();
            $table->unsignedBigInteger('forma_resolucion_id')->nullable();
            $table->string('grupo_decision');  
            $table->string('tipo_decision')->nullable(); 
            $table->foreign('resuelve_fondo_id')->references('id')->on('resuelve_fondos')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('forma_resolucion_id')->references('id')->on('forma_resolucions')->onDelete('set null')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forma_decisiones');
    }
};
