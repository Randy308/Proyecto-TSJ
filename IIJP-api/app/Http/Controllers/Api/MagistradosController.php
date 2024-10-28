<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Magistrados;
use App\Models\Resolutions;
use App\Models\Salas;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MagistradosController extends Controller
{

    public function index()
    {

        $magistrados = Magistrados::select('id', 'nombre')->orderBy('nombre', 'asc')->get();


        return response()->json($magistrados, 200);
    }

    public function obtenerDatos($id)
    {

        $magistrado = Magistrados::where("id", $id)->first();
        return $magistrado;
    }


    public function obtenerCoAutores(Request $request)

    {
        $id = $request["id"];
        $magistrado = Magistrados::where('id', $id)->first();

        // Modificar la consulta para usar paginate en lugar de limit
        $query = DB::table('contents as c')
            ->join('resolutions as r', 'r.id', '=', 'c.resolution_id')
            ->select(DB::raw("substring(c.contenido from 'POR TANTO[\s\S]+(Reg[ií]strese[\s\S]+)') as participantes"), 'r.id as resolution_id')
            ->where("r.magistrado_id", $magistrado->id)
            ->orderByDesc("r.fecha_emision")
            ->paginate(40); // Cambiar a paginate(40)

        // Procesar los resultados como antes
        //return $query;
        foreach ($query as $item) {
            $texto = explode("\r\n", $item->participantes);
            array_shift($texto);
            $texto = mb_convert_encoding($texto, 'UTF-8', 'auto');
            $texto = preg_replace('/^.*?:\s*/s', '', $texto);
            $texto = preg_replace('/magistrad[ao]/i', '', $texto);
            $texto = preg_replace('/firmad[ao]/i', '', $texto);
            $texto = preg_replace('/relator[a]?/i', '', $texto);
            $texto = preg_replace('/president[ea]?/i', '', $texto);
            $texto = preg_replace('/^.+\s?[.][-]/i', '', $texto);
            $texto = preg_replace('/secretari[oa]/i', '', $texto);
            $texto = preg_replace('/secretari[oa]?\s?de\s?sala/i', '', $texto);
            $texto = preg_replace('/[0-9]?/i', '', $texto);
            $texto = preg_replace('/\b(?:Dr\.|Dra\.)\s*/i', '', $texto);
            $texto = preg_replace('/fd[oa]?[.]?\s?/i', '', $texto);
            $texto = preg_replace('/\t?/i', '', $texto);
            $texto = preg_replace('/\b[A-ZÁÉÍÓÚÑ]{2,}\s?[.]?\b/u', '', $texto);

            $texto = preg_replace('/y\s[.]\sy\s[.]/i', '', $texto);

            $texto = preg_replace('/[^a-zA-ZÁÉÍÓÚÑáéíóúñ. ]/u', '', $texto);
            $texto = preg_replace('/\b[a-záéíóúñ]+\b/u', '', $texto);
            $texto = preg_replace('/sala/i', '', $texto);
            $texto = preg_replace('/civil/i', '', $texto);
            $texto = preg_replace('/msc|mgr/i', '', $texto);
            $texto = preg_replace('/Cámara|Razón|Tomas|Libro|plena/i', '', $texto);
            $texto = preg_replace('/^sucre/i', '', $texto);
            $texto = preg_replace('/\s+/', ' ', $texto);
            $texto = preg_replace('/\s*\.\s*/', ' ', $texto);
            $texto = array_map('trim', $texto);
            $texto = array_filter($texto, function ($value) {
                return !empty($value);
            });
            $item->participantes = array_values($texto);
        }
        //return $query;

        $participantes_resoluciones = [];

        foreach ($query as $resolucion) {
            $resolution_id = $resolucion->resolution_id;
            $participantes = $resolucion->participantes;

            foreach ($participantes as $participante) {
                $participante = trim($participante);
                if (strcasecmp($participante, $magistrado->nombre) != 0) {

                    if (!isset($participantes_resoluciones[$participante])) {
                        $participantes_resoluciones[$participante] = [];
                    }
                    $participantes_resoluciones[$participante][] = $resolution_id;
                }
            }
        }

        // Retornar los resultados de paginación y los participantes
        return response()->json([
            'menciones' => $participantes_resoluciones,
            'current_page' => $query->currentPage(),
            'last_page' => $query->lastPage(),
            'per_page' => $query->perPage(),
            'total' => $query->total(),
        ]);
    }

    public function reemplazarPatron($array, $pattern)
    {
        $array = array_map(function ($value) use ($pattern) {
            return preg_replace($pattern, '', $value);
        }, $array);
        return $array;
    }


    public function obtenerResoluciones(Request $request)
    {
        $id = $request["id"];
        $magistrado = Magistrados::where("id", $id)->first();
        if ($magistrado) {

            $query = DB::table('resolutions as r')
                ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
                ->join('salas as s', 's.id', '=', 'r.sala_id')
                ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->select('r.nro_resolucion', "r.id", "r.fecha_emision", 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', "s.nombre as sala")
                ->where('r.magistrado_id', $magistrado->id);
            $paginatedData = $query->orderBy('fecha_emision')->paginate(20);

            return response()->json($paginatedData);
        } else {

            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        }
    }

    public function obtenerEstadistica($id, Request $request)
    {


        $magistrado = Magistrados::where('id', $id)->first();
        $actual = $request['actual'];
        $fecha_inicial = $request['dato'];
        $resolutions = [];
        if ($fecha_inicial && $actual != "year") {
            switch ($actual) {
                case 'month':
                    $timestamp = strtotime($fecha_inicial);
                    $year = date('Y', $timestamp);
                    $fecha_inicial = "$year-01-01";
                    $query = "
                        SELECT
                            TO_CHAR(series::date, 'TMMonth') AS fecha,
                            series::date AS fecha_inicio,
                            COALESCE(COUNT(r.id), 0) AS cantidad
                        FROM
                            generate_series(:fechaInicial::date, :fechaFinal::date, '1 month'::INTERVAL) AS series
                        LEFT JOIN resolutions r
                            ON date_trunc('month', r.fecha_emision) = series::date
                            AND r.magistrado_id = :magistradoId
                        GROUP BY
                            TO_CHAR(series::date, 'TMMonth'), series::date
                        ORDER BY
                            series::date;
                    ";
                    $fecha_final = date('Y-m-d', strtotime("+11 months", strtotime($fecha_inicial)));
                    break;
                case 'day':
                    $query = "
                        SELECT
                            series::date AS fecha,
                            series::date AS fecha_inicio,
                            COALESCE(COUNT(r.id), 0) AS cantidad
                        FROM
                            generate_series(:fechaInicial::date, :fechaFinal::date, '1 day'::INTERVAL) AS series
                        LEFT JOIN resolutions r
                            ON r.fecha_emision = series::date
                            AND r.magistrado_id = :magistradoId
                        GROUP BY
                            series::date
                        ORDER BY
                            series::date;
                    ";
                    $fecha_final = date("Y-m-t", strtotime($fecha_inicial));
                    break;
                default:
                    break;
            }

            if ($query && $fecha_inicial && $fecha_final) {
                $resolutions = DB::select($query, [
                    'fechaInicial' => $fecha_inicial,
                    'fechaFinal' => $fecha_final,
                    'magistradoId' => $magistrado->id,
                ]);
            }
        } else {
            $resolutions = Resolutions::where('magistrado_id', $magistrado->id)
                ->select(
                    DB::raw('EXTRACT(YEAR FROM fecha_emision) as fecha'),
                    DB::raw('COUNT(*) as cantidad')
                )
                ->whereNotNull("fecha_emision")
                ->groupBy(DB::raw('EXTRACT(YEAR FROM fecha_emision)'))
                ->orderBy('fecha')
                ->get();


            foreach ($resolutions as &$item) {
                $year = $item->fecha;
                $item->fecha_final = ($year . '-12-31');
                $item->fecha_inicio = ($year . '-01-01');
            }
        }
        $data = [
            'magistrado' => $magistrado->nombre,
            'data' => $resolutions,

        ];

        return response()->json($data);
    }

    public function obtenerEstadisticaTipoJuris($id)
    {

        try {

            $magistrado = Magistrados::where('id', $id)->firstOrFail();
            $datos = DB::table('resolutions as r')
                ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
                ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
                ->select(
                    'j.tipo_jurisprudencia as nombre',
                    DB::raw('MAX(r.fecha_emision) as fecha_max'),
                    DB::raw('MIN(r.fecha_emision) as fecha_min')
                )
                ->where('r.magistrado_id', '=', $magistrado->id)
                ->whereNotNull('j.tipo_jurisprudencia')
                ->groupBy('j.tipo_jurisprudencia')
                ->orderBy('j.tipo_jurisprudencia')
                ->get();

            $fecha_final = max($datos->pluck('fecha_max')->toArray());
            $fecha_inicial = min($datos->pluck('fecha_min')->toArray());

            $series = [];

            foreach ($datos as $dato) {

                $query = "
                    SELECT
                        EXTRACT(YEAR FROM series::date) AS year,
                        COALESCE(COUNT(j.resolution_id), 0) AS cantidad
                    FROM
                        generate_series(:fechaInicial::date, :fechaFinal::date, '1 year'::INTERVAL) AS series
                    LEFT JOIN resolutions r
                        ON EXTRACT(YEAR FROM r.fecha_emision) = EXTRACT(YEAR FROM series::date)
                        AND r.magistrado_id = :magistradoId
                    LEFT JOIN jurisprudencias j
                        ON j.resolution_id = r.id
                        AND j.tipo_jurisprudencia = :jurisName
                    GROUP BY
                        year
                    ORDER BY
                        year;
                ";



                $resolutions = DB::select($query, [
                    'fechaInicial' => $fecha_inicial,
                    'fechaFinal' => $fecha_final,
                    'magistradoId' => $magistrado->id,
                    'jurisName' => $dato->nombre,
                ]);

                // Preparar los datos para la serie
                $cantidades = array_column($resolutions, 'cantidad');
                $data = [
                    'name' => $dato->nombre,
                    'data' => $cantidades,
                ];

                $series[] = $data;
            }
            //return response()->json($data);
            return response()->json([
                'magistrado' => $magistrado->nombre,
                'cabeceras' => array_column($resolutions, 'year'),
                'data' => $series,

            ], 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener los datos' . $e
            ], 500);
        }
    }

    public function obtenerEstadisticaSalas($id)
    {

        try {

            $magistrado = Magistrados::where('id', $id)->firstOrFail();
            $salas = DB::table('resolutions as r')
                ->join('salas as s', 's.id', '=', 'r.sala_id')
                ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
                ->select(
                    's.nombre',
                    's.id',
                    DB::raw('MAX(r.fecha_emision) as fecha_max'),
                    DB::raw('MIN(r.fecha_emision) as fecha_min'),

                )
                ->where('r.magistrado_id', '=', $magistrado->id)
                ->groupBy('s.id')
                ->orderBy('s.id')
                ->get();
            $fecha_final = max($salas->pluck('fecha_max')->toArray());
            $fecha_inicial = min($salas->pluck('fecha_min')->toArray());

            $series = [];

            foreach ($salas as $sala) {

                $query = "
                    SELECT
                        EXTRACT(YEAR FROM series::date) AS year,
                        COALESCE(COUNT(r.id), 0) AS cantidad
                    FROM
                        generate_series(:fechaInicial::date, :fechaFinal::date, '1 year'::INTERVAL) AS series
                    LEFT JOIN resolutions r
                        ON EXTRACT(YEAR FROM r.fecha_emision) = EXTRACT(YEAR FROM series::date)
                        AND r.magistrado_id = :magistradoId
                        AND r.sala_id = :salaId
                    GROUP BY
                        year
                    ORDER BY
                        year;
                ";


                $resolutions = DB::select($query, [
                    'fechaInicial' => $fecha_inicial,
                    'fechaFinal' => $fecha_final,
                    'magistradoId' => $magistrado->id,
                    'salaId' => $sala->id,
                ]);

                // Preparar los datos para la serie
                $cantidades = array_column($resolutions, 'cantidad');
                $data = [
                    'name' => $sala->nombre,
                    'data' => $cantidades,
                ];

                $series[] = $data;
            }
            //return response()->json($data);
            return response()->json([
                'magistrado' => $magistrado->nombre,
                'cabeceras' => array_column($resolutions, 'year'),
                'data' => $series,

            ], 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener los datos' . $e
            ], 500);
        }
    }
    public function obtenerResolucionesDepartamento($id)
    {

        try {

            $magistrado = Magistrados::where('id', $id)->firstOrFail();
            $res_departamentos = DB::table('resolutions as r')
                ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
                ->select(
                    'd.nombre as name',
                    DB::raw('count(*) as value')
                )
                ->where('r.magistrado_id', '=', $magistrado->id)->where('d.nombre', '!=', 'Desconocido')
                ->groupBy('d.nombre')
                ->orderBy('d.nombre')
                ->get();
            return response()->json($res_departamentos, 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener los datos'
            ], 500);
        }
    }

    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        //
    }


    public function show(Magistrados $magistrados)
    {
        //
    }


    public function edit(Magistrados $magistrados)
    {
        //
    }


    public function update(Request $request, Magistrados $magistrados)
    {
        //
    }


    public function destroy(Magistrados $magistrados)
    {
        //
    }

    public function obtenerEstadisticas($id, Request $request)
    {

        $magistrado = Magistrados::where('id', $id)->first();
        $superior = $request['superior'];
        $dato = $request['dato'];
        $resolutions = [];
        if ($dato && $superior) {
            switch ($superior) {
                case 'year':
                    $query = "
                        SELECT
                            TO_CHAR(series::date, 'TMMonth') AS fecha,
                            series::date AS full,
                            COALESCE(COUNT(r.id), 0) AS cantidad
                        FROM
                            generate_series(:fechaInicial::date, :fechaFinal::date, '1 month'::INTERVAL) AS series
                        LEFT JOIN resolutions r
                            ON date_trunc('month', r.fecha_emision) = series::date
                            AND r.magistrado_id = :magistradoId
                        GROUP BY
                            TO_CHAR(series::date, 'TMMonth'), series::date
                        ORDER BY
                            series::date;
                    ";
                    $fecha_final = date('Y-m-d', strtotime("+11 months", strtotime($dato)));
                    $siguiente = "mes";
                    break;
                case 'mes':
                    $query = "
                        SELECT
                            series::date AS fecha,
                            COALESCE(COUNT(r.id), 0) AS cantidad
                        FROM
                            generate_series(:fechaInicial::date, :fechaFinal::date, '1 day'::INTERVAL) AS series
                        LEFT JOIN resolutions r
                            ON r.fecha_emision = series::date
                            AND r.magistrado_id = :magistradoId
                        GROUP BY
                            series::date
                        ORDER BY
                            series::date;
                    ";
                    $fecha_final = date("Y-m-t", strtotime($dato));
                    $siguiente = "day";
                    break;
                default:
                    break;
            }

            $resolutions = DB::select($query, [
                'fechaInicial' => $dato,
                'fechaFinal' => $fecha_final,
                'magistradoId' => $magistrado->id
            ]);
        } else {
            $resolutions = Resolutions::where('magistrado_id', $magistrado->id)
                ->select(
                    DB::raw('EXTRACT(YEAR FROM fecha_emision) as fecha'),
                    DB::raw('MIN(fecha_emision) as fecha_inicio'),
                    DB::raw('MAX(fecha_emision) as fecha_final'),
                    DB::raw('COUNT(*) as cantidad')
                )
                ->whereNotNull("fecha_emision")
                ->groupBy(DB::raw('EXTRACT(YEAR FROM fecha_emision)'))
                ->orderBy('fecha')
                ->get();
            foreach ($resolutions as &$item) {
                $year = $item->fecha;
                $item->fecha_final = ($year . '-12-31');
                $item->fecha_inicio = ($year . '-01-01');
            }

            $siguiente = "year";
        }
        //$total_res = Resolutions::where('magistrado_id', $magistrado->id)->count();
        $data = [
            'magistrado' => $magistrado->nombre,
            "siguiente" => $siguiente,
            'data' => $resolutions,

        ];

        return response()->json($data);
    }
}
