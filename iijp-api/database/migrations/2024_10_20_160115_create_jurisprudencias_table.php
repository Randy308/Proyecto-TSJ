<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateJurisprudenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jurisprudencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('resolution_id');
            $table->unsignedBigInteger('tipo_jurisprudencia_id')->nullable();
            $table->unsignedBigInteger('restrictor_id');
            $table->text('ratio')->nullable();
            $table->text('descriptor')->nullable();
            $table->unsignedBigInteger('descriptor_id')->nullable();
            $table->unsignedBigInteger('root_id')->nullable();
            $table->foreign('descriptor_id')->references('id')->on('descriptors')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('root_id')->references('id')->on('descriptors')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('restrictor_id')->references('id')->on('restrictors')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('resolution_id')->references('id')->on('resolutions')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('tipo_jurisprudencia_id')->references('id')->on('tipo_jurisprudencias')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE jurisprudencias ADD COLUMN ratiosearch TSVECTOR");
        DB::statement("UPDATE jurisprudencias SET ratiosearch = to_tsvector('spanish', ratio)");
        DB::statement("CREATE INDEX ratiosearch_gin ON jurisprudencias USING GIN(ratiosearch)");
        DB::statement("CREATE TRIGGER ts_ratiosearch BEFORE INSERT OR UPDATE ON jurisprudencias FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('ratiosearch', 'pg_catalog.spanish', 'ratio')");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("DROP TRIGGER IF EXISTS ts_ratiosearch ON jurisprudencias");
        DB::statement("DROP INDEX IF EXISTS ratiosearch_gin");
        DB::statement("ALTER TABLE jurisprudencias DROP COLUMN ratiosearch");
        Schema::dropIfExists('jurisprudencias');
    }
}
