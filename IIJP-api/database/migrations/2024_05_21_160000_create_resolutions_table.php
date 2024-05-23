<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResolutionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resolutions', function (Blueprint $table) {
            $table->id();
            $table->string('nro_resolucion');
            $table->string('nro_expediente');
            $table->date('fecha_emision');
            $table->date('fecha_publicacion');
            $table->string('tipo_resolucion');
            $table->string('departamento');
            $table->unsignedBigInteger('sala_id');
            $table->string('magistrado');
            $table->string('forma_resolucion');
            $table->string('restrictor');
            $table->string('descriptor');
            $table->string('tipo_jurisprudencia');
            $table->string('proceso');
            $table->string('precedente');
            $table->string('ratio');
            $table->string('demandante');
            $table->string('demandado');
            $table->unsignedBigInteger('tema_id');
            $table->string('maxima');
            $table->string('sintesis');
            $table->foreign('sala_id')->references('id')->on('salas')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('tema_id')->references('id')->on('temas')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('resolutions');
    }
}
