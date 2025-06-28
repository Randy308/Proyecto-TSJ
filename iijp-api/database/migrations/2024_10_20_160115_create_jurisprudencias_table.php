<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateJurisprudenciasTable extends Migration
{

    public function up()
    {
        Schema::create('jurisprudencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resolution_id');
            $table->unsignedBigInteger('tipo_jurisprudencia_id')->nullable();
            $table->text('restrictor')->nullable(); 
            $table->text('ratio')->nullable();
            $table->text('descriptor')->nullable();
            $table->unsignedBigInteger('descriptor_id')->nullable();
            $table->unsignedBigInteger('root_id')->nullable();
            $table->timestamps();
            $table->foreign('descriptor_id')->references('id')->on('descriptors')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('root_id')->references('id')->on('descriptors')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('resolution_id')->references('id')->on('resolutions')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('tipo_jurisprudencia_id')->references('id')->on('tipo_jurisprudencias')->onDelete('cascade')->onUpdate('cascade');
        });

        // DB::statement("ALTER TABLE jurisprudencias ADD COLUMN jurisprudencia_search TSVECTOR");

        // DB::statement("
        //     UPDATE jurisprudencias SET jurisprudencia_search = to_tsvector(
        //         'spanish',
        //         coalesce(descriptor, '') || ' ' || coalesce(restrictor::text, '') || ' ' || coalesce(ratio, '')
        //     )
        // ");

        // DB::statement("CREATE INDEX jurisprudencia_search_gin ON jurisprudencias USING GIN(jurisprudencia_search)");

        // DB::statement("
        //     CREATE TRIGGER ts_jurisprudencia_search
        //     BEFORE INSERT OR UPDATE ON jurisprudencias
        //     FOR EACH ROW EXECUTE PROCEDURE
        //     tsvector_update_trigger('jurisprudencia_search', 'pg_catalog.spanish', 'descriptor', 'restrictor', 'ratio')
        // ");
    }


    public function down()
    {
        // DB::statement("DROP TRIGGER IF EXISTS ts_jurisprudencia_search ON jurisprudencias");
        // DB::statement("DROP INDEX IF EXISTS jurisprudencia_search_gin");
        // DB::statement("ALTER TABLE jurisprudencias DROP COLUMN jurisprudencia_search");
        Schema::dropIfExists('jurisprudencias');
    }
}
