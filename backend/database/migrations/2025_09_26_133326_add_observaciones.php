<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {

        Schema::table('notifications', function (Blueprint $table) {

            if (! Schema::hasColumn('notifications', 'enlace')) {
                $table->string('enlace')->nullable();
            }

            if (! Schema::hasColumn('notifications', 'tipo')) {
                $table->string('tipo')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
