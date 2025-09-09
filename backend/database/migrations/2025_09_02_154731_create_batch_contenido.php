<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
                CREATE OR REPLACE FUNCTION get_contenidos_por_sala(
                    p_sala_id INT,
                    p_page INT,
                    p_page_size INT
                )
                RETURNS TABLE (
                    id BIGINT,
                    bloques JSON
                ) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT
                        c.id,
                        to_json(regexp_split_to_array(
                            c.contenido,
                            '(\r\n?\s{0,})(?=(?:[A-Z]{2,}|[IVXLCDM]+\\.\\s))'
                        )) AS bloques
                    FROM contents c
                    JOIN resolutions r ON r.id = c.resolution_id
                    WHERE r.sala_id = p_sala_id
                    ORDER BY c.id
                    LIMIT p_page_size
                    OFFSET (p_page - 1) * p_page_size;
                END;
                $$ LANGUAGE plpgsql;
            ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP FUNCTION IF EXISTS get_contenidos_por_sala(INT, INT, INT);');
    }
};
