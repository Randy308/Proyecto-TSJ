<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categoria_resoluciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255)->nullable();
            $table->string('slug', 255)->nullable();
            $table->timestamps();
        });

        Schema::table('resolutions', function (Blueprint $table) {
            if (! Schema::hasColumn('resolutions', 'categoria_resolucion_id')) {
                $table->unsignedBigInteger('categoria_resolucion_id')->nullable();
                $table->foreign('categoria_resolucion_id')
                    ->references('id')
                    ->on('categoria_resoluciones')
                    ->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('resolutions', function (Blueprint $table) {
            if (Schema::hasColumn('resolutions', 'categoria_resolucion_id')) {
                $table->dropForeign(['categoria_resolucion_id']);
                $table->dropColumn('categoria_resolucion_id');
            }
        });
        Schema::dropIfExists('categoria_resoluciones');
    }
};
