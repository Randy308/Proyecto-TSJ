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
            CREATE MATERIALIZED VIEW resumen_jerarquico AS
            SELECT 
                COALESCE(d.id, j.descriptor_id) AS id,
                COALESCE(d.descriptor_id, NULL) AS descriptor_id,
                COALESCE(d.nombre, 'Sin nombre') AS nombre,
                COUNT(j.id) AS cantidad
            FROM 
                jurisprudencias j
            FULL OUTER JOIN 
                descriptors d ON j.descriptor_id = d.id
            GROUP BY 
                COALESCE(d.id, j.descriptor_id),
                COALESCE(d.descriptor_id, NULL),
                COALESCE(d.nombre, 'Sin nombre')
            ORDER BY 
                COALESCE(d.id, j.descriptor_id);
        ");

        DB::statement("CREATE UNIQUE INDEX resumen_jerarquico_uidx ON resumen_jerarquico (id);");

        DB::statement("
            CREATE OR REPLACE FUNCTION refrescar_resumen_jerarquico()
            RETURNS trigger AS $$
            BEGIN
                REFRESH MATERIALIZED VIEW CONCURRENTLY resumen_jerarquico;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ");

        DB::statement("
            CREATE TRIGGER trg_refresh_resumen_jerarquico
            AFTER INSERT OR UPDATE OR DELETE ON jurisprudencias
            FOR EACH STATEMENT
            EXECUTE FUNCTION refrescar_resumen_jerarquico();
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP TRIGGER IF EXISTS trg_refresh_resumen_jerarquico ON jurisprudencias;");
        DB::statement("DROP FUNCTION IF EXISTS refrescar_resumen_jerarquico;");
        DB::statement("DROP INDEX IF EXISTS resumen_jerarquico_uidx;");
        DB::statement("DROP MATERIALIZED VIEW IF EXISTS resumen_jerarquico;");
    }
};
