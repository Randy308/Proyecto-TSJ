<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Magistrados;
use App\Models\Resolutions;
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


    public function obtenerCoAutores($id)
    {
        $magistrado = Magistrados::where('id', $id)->first();

        $query = DB::table('contents as c')
            ->join('resolutions as r', 'r.id', '=', 'c.resolution_id')
            ->select(DB::raw("substring(c.contenido from 'Reg[ií]strese.+') as extracted_text"), 'r.id')
            ->where("r.magistrado_id", $magistrado->id)->orderByDesc("r.fecha_emision")->limit(150)
            ->get();

        // Filtering the array
        $result = array_filter($query->toArray(), function ($item) {

            return strlen($item->extracted_text) > 0;
        });
        foreach ($result as $item) {

            $item->array = explode("\r\n", $item->extracted_text);
            array_shift($item->array);

            $item->array = MagistradosController::reemplazarPatron($item->array, "/[Ff][Ii][Rr][Mm][Aa][Nn]?[Dd][Oo][:]?\s?/");
            $item->array = MagistradosController::reemplazarPatron($item->array, "/[Rr]elator[a]?[:]?\s?/");
            $item->array = MagistradosController::reemplazarPatron($item->array, "/[mM].+[Rr][aA][dD][OoaA]\s?[:]?\s?/");
            $item->array = MagistradosController::reemplazarPatron($item->array, "/[Pp].+[Dd][eE][Nn][Tt][EeaA][:]?\s?/");

            $item->array = MagistradosController::reemplazarPatron($item->array, "/(?i)\bante mi\s*:\s+/");
            $item->array = MagistradosController::reemplazarPatron($item->array, "/Mgdo\.?\s?Dr\.?|Mgda\.?\s?Dra\.?|Mgdo\.?\s?|Mgda\.?\s?/");
            $item->array = array_filter($item->array, function ($value) {
                return !empty($value);
            });
            $item->array = array_map('trim',  $item->array);
            $item->array = array_values($item->array);


            unset($item->extracted_text);
        }

        $result = array_filter($result, function ($item) {

            return count($item->array) > 0;
        });

        $result = array_values($result);

        return response()->json($result);
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
            $paginatedData = $query->orderBy('fecha_emision')->paginate(10);

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
        $superior = $request['superior'];
        $dato = $request['dato'];
        $resolutions = [];
        if ($dato && $superior) {
            switch ($superior) {
                case 'year':
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
                    $fecha_final = date('Y-m-d', strtotime("+11 months", strtotime($dato)));
                    $siguiente = "mes";
                    break;
                case 'mes':
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


            $cantidades = $res_departamentos->pluck('value')->toArray();

            $data = [

                'departamentos' => $res_departamentos,
                'maximo' => max($cantidades),
                'minimo' => min($cantidades)

            ];

            //return response()->json($data);
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
}
