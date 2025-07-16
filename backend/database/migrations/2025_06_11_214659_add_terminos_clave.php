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

        DB::statement('DROP TEXT SEARCH CONFIGURATION IF EXISTS spanish_custom CASCADE;');
        DB::statement('DROP TEXT SEARCH DICTIONARY IF EXISTS spanish_custom CASCADE;');


        DB::statement('create TEXT SEARCH DICTIONARY spanish_custom (
            TEMPLATE = simple,
            STOPWORDS = spanish
        );');

        DB::statement('CREATE TEXT SEARCH CONFIGURATION spanish_custom (COPY = pg_catalog.spanish);');

        DB::statement('ALTER TEXT SEARCH CONFIGURATION spanish_custom
            ALTER MAPPING FOR asciiword, asciihword, hword, hword_part, word, hword_asciipart
            WITH spanish_custom;');

        $sql = <<<'SQL'
        CREATE OR REPLACE FUNCTION actualizar_terminos_clave_unificados()
        RETURNS void AS $$
        BEGIN
            TRUNCATE TABLE terminos_clave_unificados;

            INSERT INTO terminos_clave_unificados (campo, nombre, cantidad)
            SELECT 'precedente', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_custom', coalesce(precedente, '')) FROM resolutions$q$) WHERE ndoc >= 100
            UNION ALL
            SELECT 'proceso', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_custom', coalesce(proceso, '')) FROM resolutions$q$) WHERE ndoc >= 100
            UNION ALL
            SELECT 'maxima', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_custom', coalesce(maxima, '')) FROM resolutions$q$) WHERE ndoc >= 100
            UNION ALL
            SELECT 'sintesis', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_custom', coalesce(sintesis, '')) FROM resolutions$q$) WHERE ndoc >= 100
            UNION ALL
            SELECT 'ratio', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_custom', coalesce(ratio, '')) FROM jurisprudencias$q$) WHERE ndoc >= 100
            UNION ALL
            SELECT 'restrictor', word, ndoc FROM ts_stat($q$SELECT to_tsvector('spanish_custom', coalesce(restrictor, '')) FROM jurisprudencias$q$) WHERE ndoc >= 100;
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
        DB::statement('DROP FUNCTION IF EXISTS actualizar_terminos_clave_unificados() CASCADE;');
        DB::statement('DROP TEXT SEARCH CONFIGURATION IF EXISTS spanish_custom CASCADE;');
        DB::statement('DROP TEXT SEARCH DICTIONARY IF EXISTS spanish_custom CASCADE;');
        Schema::dropIfExists('terminos_clave_unificados');
    }
};
