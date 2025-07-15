<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEstilosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('estilos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->enum('fontFamily', ['times_new_roman', 'cambria', 'trebuchet_ms', 'Verdana', 'Arial']);
            $table->enum('textAlign', ['left', 'center', 'right', 'justify']);
            $table->enum('fontStyle', ['normal', 'italic', 'oblique']);
            $table->enum('fontWeight', ['bold', 'normal']);
            $table->enum('textDecoration', ['none', 'underline', 'line-through', 'overline']);
            $table->string('color');
            $table->integer('marginTop');
            $table->integer('paddingBottom');
            $table->integer('marginLeft');
            $table->string('fontSize');
            $table->string('tipo')->nullable();
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
        Schema::dropIfExists('estilos');
    }
}
