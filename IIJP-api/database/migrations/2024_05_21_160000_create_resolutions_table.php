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
            $table->string('nro_resolucion')->nullable();
            $table->string('nro_expediente')->nullable();
            $table->date('fecha_emision')->nullable();
            $table->date('fecha_publicacion')->nullable();
            $table->unsignedBigInteger('tipo_resolucion_id')->nullable();
            $table->unsignedBigInteger('departamento_id')->nullable();
            $table->unsignedBigInteger('sala_id')->nullable();
            $table->unsignedBigInteger('magistrado_id')->nullable();
            $table->unsignedBigInteger('forma_resolucion_id')->nullable();
            $table->text('proceso')->nullable();
            $table->text('precedente')->nullable();
            $table->text('demandante')->nullable();
            $table->text('demandado')->nullable();
            $table->unsignedBigInteger('tema_id')->nullable();
            $table->text('maxima')->nullable();
            $table->text('sintesis')->nullable();
            $table->foreign('sala_id')->references('id')->on('salas')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('tema_id')->references('id')->on('temas')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('forma_resolucion_id')->references('id')->on('forma_resolucions')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('tipo_resolucion_id')->references('id')->on('tipo_resolucions')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('magistrado_id')->references('id')->on('magistrados')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('cascade')->onUpdate('cascade');
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
