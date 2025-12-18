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
        DB::statement("CREATE OR REPLACE FUNCTION actualizar_subtemas(tema_id INT)
                                RETURNS INTEGER
                                LANGUAGE plpgsql
                                AS $$
                                DECLARE
                                    filas_actualizadas INTEGER;
                                BEGIN
                                    WITH sub_grupo AS (
                                        SELECT 
                                            d2.id     AS id,
                                            d2.nombre AS nombre,
                                            j.id      AS jid
                                        FROM jurisprudencias j
                                        JOIN descriptors d 
                                            ON d.id = j.root_id
                                        JOIN descriptors d2 
                                            ON d.id = d2.descriptor_id
                                        WHERE j.root_id = tema_id
                                        AND j.descriptor ~ d2.nombre
                                    )
                                    UPDATE jurisprudencias j
                                    SET sub_tema = sg.id
                                    FROM sub_grupo sg
                                    WHERE j.id = sg.jid;

                                    -- obtener cantidad de filas afectadas
                                    GET DIAGNOSTICS filas_actualizadas = ROW_COUNT;

                                    RETURN filas_actualizadas;
                                END;
                                $$;");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP FUNCTION IF EXISTS actualizar_subtemas(INT);');
    }
};
