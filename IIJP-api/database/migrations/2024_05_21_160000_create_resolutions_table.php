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
            $table->text('nro_resolucion');
            $table->text('nro_expediente');
            $table->date('fecha_emision')->nullable();
            $table->date('fecha_publicacion')->nullable();
            $table->text('tipo_resolucion')->nullable();
            $table->text('departamento')->nullable();
            $table->unsignedBigInteger('sala_id')->nullable();
            $table->text('magistrado')->nullable();
            $table->text('forma_resolucion')->nullable();
            $table->text('restrictor')->nullable();
            $table->text('descriptor')->nullable();
            $table->text('tipo_jurisprudencia')->nullable();
            $table->text('proceso')->nullable();
            $table->text('precedente')->nullable();
            $table->text('ratio')->nullable();
            $table->text('demandante')->nullable();
            $table->text('demandado')->nullable();
            $table->unsignedBigInteger('tema_id')->nullable();
            $table->text('maxima')->nullable();
            $table->text('sintesis')->nullable();
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
