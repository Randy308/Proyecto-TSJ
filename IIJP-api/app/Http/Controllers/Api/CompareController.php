<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Salas;
use App\Models\TipoResolucions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompareController extends Controller
{
    //

    public function obtenerElemento(Request $request)
    {
        $nombre = $request['variable'];
        $value = $request['value'];
        $fecha_final =  $request['fecha_final'];
        $fecha_inicial = $request['fecha_inicial'];
        $titulo = $request['nombre'];

        $query = "
            SELECT
                EXTRACT(YEAR FROM series::date) as periodo,
                series::date AS fecha,
                COALESCE(COUNT(r.id), 0) AS cantidad
            FROM
                generate_series(:fechaInicial::date, :fechaFinal::date, '1 YEAR'::INTERVAL) AS series
            LEFT JOIN resolutions r
                ON date_trunc('year', r.fecha_emision) = date_trunc('year', series)
                AND r.$nombre = :value
            GROUP BY
                series::date
            ORDER BY
                series::date;
        ";

        $resolutions = DB::select($query, [
            'fechaInicial' => $fecha_inicial,
            'fechaFinal' => $fecha_final,
            'value' => $value
        ]);

        $data = array_column($resolutions, 'cantidad');
        $cabeceras = array_column($resolutions, 'periodo');
        return response()->json([

            'cabeceras' => $cabeceras,
            'termino'=>[
                'name' => $nombre,
                'value' => $titulo
            ],
            'resoluciones' => [
                'name' => $titulo,
                'type' => 'line',
                'data' => $data
            ]
        ]);
    }


    public function getParams()
    {
        $tipo_resolucion = TipoResolucions::all();
        $salas = Salas::all();

        $max_date = DB::table('resolutions as r')
            ->selectRaw("MAX(r.fecha_emision) as fecha_completa")
            ->value('fecha_completa'); // Obtiene el valor directamente

        $min_date = DB::table('resolutions as r')
            ->selectRaw("MIN(r.fecha_emision) as fecha_completa")
            ->value('fecha_completa'); // Obtiene el valor directamente

        if (!$salas || !$tipo_resolucion) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        $data = [
            'tipo_resolucion' => $tipo_resolucion->toArray(),
            'salas' => $salas->toArray(),
            'superior' => $max_date,
            'inferior' => $min_date
        ];

        return response()->json($data);
    }
}
