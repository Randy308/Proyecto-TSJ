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
        //

        DB::statement("CREATE OR REPLACE FUNCTION obtener_departamentos_vacios(input_param int) 
                        RETURNS TABLE(
                            r_id int, 
                            expediente text, 
                            departamento text
                        ) 
                        AS $$ 
                            SELECT 
                                r.id AS r_id,
                                r.nro_expediente AS expediente,
                                (regexp_matches(
                                    c.contenido,
                                    '[a-zA-ZÀ-ÿ]{8,10}\s?[:]\s*(La Paz|Chuquisaca|Oruro|Potos[ií]|Cochabamba|Tarija|Santa Cruz|Beni|Pando)',
                                    'gi'
                                ))[1] AS departamento
                            FROM resolutions r
                            JOIN contents c ON c.resolution_id = r.id 
                            WHERE r.departamento_id = 4
                            ORDER BY r.id
                            LIMIT input_param;
                        $$ 
                        LANGUAGE SQL;
                    ");             
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar la función si es necesario
        DB::statement("DROP FUNCTION IF EXISTS obtener_departamentos_vacios();");
    }
};
