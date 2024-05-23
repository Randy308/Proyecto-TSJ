<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemasComplementariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('temas_complementarios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resolution_id');
            $table->string('restrictor');
            $table->string('tipo_jurisprudencia');
            $table->string('ratio');
            $table->string('descriptor');
            $table->foreign('resolution_id')->references('id')->on('resolutions')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('temas_complementarios');
    }
}
