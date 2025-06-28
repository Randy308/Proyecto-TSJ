<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->text('contenido');
            $table->unsignedBigInteger('resolution_id');
            $table->foreign('resolution_id')->references('id')->on('resolutions')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
        //DB::statement("ALTER TABLE contents ADD COLUMN searchtext TSVECTOR");
        //DB::statement("UPDATE contents SET searchtext = to_tsvector('spanish', contenido)");
        //DB::statement("CREATE INDEX searchtext_gin ON contents USING GIN(searchtext)");
        //DB::statement("CREATE TRIGGER ts_searchtext BEFORE INSERT OR UPDATE ON contents FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('searchtext', 'pg_catalog.spanish',  'contenido')");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //DB::statement("DROP TRIGGER IF EXISTS ts_searchtext ON contents");
        //DB::statement("DROP INDEX IF EXISTS searchtext_gin");
        //DB::statement("ALTER TABLE contents DROP COLUMN searchtext");
        Schema::dropIfExists('contents');
    }
}
