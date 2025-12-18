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
        //

        Schema::table('jurisprudencias', function (Blueprint $table) {

            if (! Schema::hasColumn('jurisprudencias', 'sub_tema')) {
                $table->unsignedBigInteger('sub_tema')->nullable();
            }

            $table->foreign('sub_tema')->references('id')->on('descriptors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('resolutions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    }
};
