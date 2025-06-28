<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('terminos_clave_unificados', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('campo');
            $table->string('nombre');
            $table->integer('cantidad');
        });

        $sql = <<<'SQL'
        CREATE OR REPLACE FUNCTION actualizar_terminos_clave_unificados()
        RETURNS void AS $$
        BEGIN
            TRUNCATE TABLE terminos_clave_unificados;

            INSERT INTO terminos_clave_unificados (campo, nombre, cantidad)
            SELECT 'precedente', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_no_stem', coalesce(precedente, '')) FROM resolutions$q$) WHERE ndoc >= 200
            UNION ALL
            SELECT 'proceso', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_no_stem', coalesce(proceso, '')) FROM resolutions$q$) WHERE ndoc >= 200
            UNION ALL
            SELECT 'maxima', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_no_stem', coalesce(maxima, '')) FROM resolutions$q$) WHERE ndoc >= 200
            UNION ALL
            SELECT 'sintesis', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_no_stem', coalesce(sintesis, '')) FROM resolutions$q$) WHERE ndoc >= 200
            UNION ALL
            SELECT 'ratio', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_no_stem', coalesce(ratio, '')) FROM jurisprudencias$q$) WHERE ndoc >= 200
            UNION ALL
            SELECT 'restrictor', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_no_stem', coalesce(restrictor, '')) FROM jurisprudencias$q$) WHERE ndoc >= 200;
        END;
        $$ LANGUAGE plpgsql;
        SQL;

        DB::statement($sql);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP FUNCTION IF EXISTS actualizar_terminos_clave_unificados();");
        Schema::dropIfExists('terminos_clave_unificados');
    }
};
