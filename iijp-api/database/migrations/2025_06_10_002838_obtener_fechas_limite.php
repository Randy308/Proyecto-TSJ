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
        DB::statement("CREATE OR REPLACE FUNCTION obtener_fechas_limite(input_param int) 
                        RETURNS TABLE(
                            r_id int, 
                            r_fecha_emision text, 
                            fecha text
                        ) 
                        AS $$ 
                        WITH top_res AS (
                            SELECT id FROM (
                                SELECT r.id
                                FROM resolutions r
                                ORDER BY r.fecha_emision DESC
                                LIMIT input_param
                            ) sub_top
                        ), 
                        bottom_res AS (
                            SELECT id FROM (
                                SELECT r.id
                                FROM resolutions r
                                ORDER BY r.fecha_emision ASC
                                LIMIT input_param
                            ) sub_bottom
                        ),
                        combined_res AS (
                            SELECT * FROM top_res
                            UNION
                            SELECT * FROM bottom_res
                        )
                        SELECT 
                            r.id AS r_id, 
                            r.fecha_emision::text AS r_fecha_emision,
                            (regexp_matches(
                                    c.contenido,
                                    '[a-zA-ZÀ-ÿ]{5}[,:]\s*(\d{1,2}(?:\s+de\s+(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+\d{4}|/\d{1,2}/\d{4}))',
                                    'gi'
                                ))[1]
                            AS fecha
                        FROM resolutions r 
                        JOIN contents c ON c.resolution_id = r.id
                        WHERE r.id IN (SELECT id FROM combined_res)
                        $$ 
                        LANGUAGE SQL;");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        DB::statement("DROP FUNCTION IF EXISTS obtener_fechas_limite();");
    }
};
