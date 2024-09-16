<?php

namespace App\Http\Controllers;

use App\Models\Contents;
use App\Models\Magistrados;
use App\Models\Resolutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MagistradosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $magistrados = Magistrados::select('id', 'name as nombre')->get();


        return response()->json([
            'magistrados' => $magistrados
        ]);
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
            ->select(DB::raw("substring(c.contenido from 'Firmado(.+)|Firmando(.+)|Reg[ií]strese.+[.]\r\n(.+)') as extracted_text"), 'r.id')
            ->where("r.magistrado_id", $magistrado->id)->orderByDesc("r.fecha_emision")->limit(200)
            ->get();

        // Filtering the array
        $result = array_filter($query->toArray(), function ($item) {

            return strlen($item->extracted_text) > 0;
        });
        foreach ($result as $item) {

            $item->array = explode("\r\n", $item->extracted_text);

            $item->array = MagistradosController::reemplazarPatron($item->array, "/[mM].+[Rr][aA][dD][OoaA]\s?/");
            $item->array = array_filter($item->array, function ($value) {
                return !empty($value);
            });
            unset($item->extracted_text);
        }


        return response()->json($result);
    }
    public function reemplazarPatron($array , $pattern){
        $array = array_map(function ($value) use ($pattern)  {
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
                ->select('r.nro_resolucion', "r.id", "r.fecha_emision", 'tr.name as tipo_resolucion', 'd.name as departamento', "s.sala as sala")
                ->where('r.magistrado_id', $magistrado->id);
            $paginatedData = $query->orderBy('fecha_emision')->paginate(10);

            return response()->json($paginatedData);
        } else {

            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        }
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
                    DB::raw('DATE_PART(\'year\', fecha_emision) as fecha'),
                    DB::raw('count(*) as cantidad')
                )
                ->whereNotNull("fecha_emision")
                ->groupBy('fecha') // Incluye full en el groupBy si quieres mostrar ambas
                ->orderBy('fecha')
                ->get();

            $siguiente = "year";
        }




        $total_res = Resolutions::where('magistrado_id', $magistrado->id)->count();

        $res_departamentos = DB::table('resolutions as r')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                'd.name as name',
                DB::raw('count(*) as value')
            )
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->groupBy('d.name')
            ->orderBy('d.name')
            ->get();
        if (count($resolutions)) {
            $data = [
                'magistrado' => $magistrado->name,
                'total_res' => $total_res,
                "siguiente" => $siguiente,
                'departamentos' => $res_departamentos,
                'data' => $resolutions
            ];
        }

        return response()->json($data);
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
