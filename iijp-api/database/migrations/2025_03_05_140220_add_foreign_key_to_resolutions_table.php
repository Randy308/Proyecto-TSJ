<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToResolutionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {


        Schema::table('resolutions', function (Blueprint $table) {

            if (!Schema::hasColumn('resolutions', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable();
            }

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('resolutions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    }
}
