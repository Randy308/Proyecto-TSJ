<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grupo_salas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->timestamps();
        });

        Schema::table('salas', function (Blueprint $table) {
            $table->unsignedBigInteger('grupo_sala_id')->nullable()->after('id');
            $table->foreign('grupo_sala_id')->references('id')->on('grupo_salas')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('salas', function (Blueprint $table) {
            $table->dropForeign(['grupo_sala_id']);
            $table->dropColumn('grupo_sala_id');
        });

        Schema::dropIfExists('grupo_salas');
    }
};
