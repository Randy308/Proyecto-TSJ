<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Jurisprudencias;
use App\Models\Magistrados;
use App\Models\Resolutions;
use App\Models\Sala;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MagistradosController extends Controller
{

    public function index()
    {
        $magistrados = DB::table('magistrados as m')
            ->selectRaw("m.id, m.nombre,
                     extract(year from MAX(r.fecha_emision))  as fecha_max,
                      extract(year from MIN(r.fecha_emision))  as fecha_min,
                     TRIM(BOTH ', ' FROM CONCAT(
                        CASE WHEN EXTRACT(YEAR FROM AGE(MAX(r.fecha_emision), MIN(r.fecha_emision))) > 0
                             THEN EXTRACT(YEAR FROM AGE(MAX(r.fecha_emision), MIN(r.fecha_emision))) || ' años, '
                             ELSE ''
                        END,
                        CASE WHEN EXTRACT(MONTH FROM AGE(MAX(r.fecha_emision), MIN(r.fecha_emision))) > 0
                             THEN EXTRACT(MONTH FROM AGE(MAX(r.fecha_emision), MIN(r.fecha_emision))) || ' meses, '
                             ELSE ''
                        END,
                        CASE WHEN EXTRACT(DAY FROM AGE(MAX(r.fecha_emision), MIN(r.fecha_emision))) > 0
                             THEN EXTRACT(DAY FROM AGE(MAX(r.fecha_emision), MIN(r.fecha_emision))) || ' días'
                             ELSE ''
                        END
                     )) as duracion")
            ->join('resolutions as r', 'r.magistrado_id', '=', 'm.id')
            ->groupBy('m.id')
            ->orderBy('m.id')
            ->get();

        return response()->json($magistrados, 200);
    }



    public function magistradosParamentros(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'salas' => 'required|array',
            'salas.*' => 'required|integer',
            'id' => 'required|integer',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $salas = $request->salas;


        $magistrado = Magistrados::findOrFail($request->id);


        $departamentos = DB::table('departamentos as d')
            ->selectRaw('DISTINCT(d.id), d.nombre')
            ->join('resolutions as r', 'r.departamento_id', '=', 'd.id')
            ->whereIn('r.sala_id', $salas)
            ->where('r.magistrado_id', $magistrado->id)
            ->get();

        $tipo_resolucions = DB::table('tipo_resolucions as tr')
            ->selectRaw('DISTINCT(tr.id), tr.nombre')
            ->join('resolutions as r', 'r.tipo_resolucion_id', '=', 'tr.id')
            ->whereIn('r.sala_id', $salas)
            ->where('r.magistrado_id', $magistrado->id)
            ->get();

        $jurisprudencias = DB::table('resolutions as r')
            ->selectRaw('DISTINCT(tj.id), tj.nombre')
            ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->join('tipo_jurisprudencias as tj', 'tj.id', '=', 'j.tipo_jurisprudencia_id')
            ->whereIn('r.sala_id', $salas)
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->get();


        $response = [];

        if ($departamentos->count() > 1) {
            $response['departamento'] = $departamentos;
        }

        if ($jurisprudencias->count() > 1) {
            $response['tipo_jurisprudencia'] = $jurisprudencias;
        }

        if ($tipo_resolucions->count() > 1) {
            $response['tipo_resolucion'] = $tipo_resolucions;
        }

        return response()->json($response, 200);
    }

    public function obtenerDatos($id)
    {


        $magistrado = Magistrados::findOrFail($id);

        $fechas = DB::table('resolutions as r')
            ->select(DB::raw("MIN(r.fecha_emision) as fecha_minima, MAX(r.fecha_emision) as fecha_maxima"))
            ->where("r.magistrado_id", $magistrado->id)
            ->first();

        $salas = DB::table('resolutions as r')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->select(DB::raw("COUNT(r.id) as cantidad, s.nombre , s.id"))
            ->where("r.magistrado_id", $magistrado->id)
            ->groupBy("s.nombre", "s.id")->orderBy('cantidad', 'desc')
            ->get();


        $formas = DB::table('resolutions as r')
            ->join('forma_resolucions as fr', 'r.forma_resolucion_id', '=', 'fr.id')
            ->select(DB::raw("COUNT(r.id) as cantidad, fr.nombre"))
            ->where("r.magistrado_id", $magistrado->id)
            ->groupBy("fr.nombre")
            ->having(DB::raw("COUNT(r.id)"), ">", 20)
            ->orderBy('cantidad', 'desc')
            ->get();

        Carbon::setLocale('es');
        $total = $salas->sum("cantidad");

        foreach ($salas as $sala) {
            $sala->porcentaje = round($sala->cantidad * 100 / $total, 2);
        }

        // Convert and format the dates
        $fechaMinima = Carbon::parse($fechas->fecha_minima)->translatedFormat('j \\d\\e F \\d\\e Y');
        $fechaMaxima = Carbon::parse($fechas->fecha_maxima)->translatedFormat('j \\d\\e F \\d\\e Y');

        return response()->json([
            'nombre' => $magistrado->nombre,
            'fecha_maxima' => $fechaMaxima,
            'fecha_minima' => $fechaMinima,
            'salas' => $salas,
            'formas' => $formas,
        ]);
    }



    public function reemplazarPatron($array, $pattern)
    {
        $array = array_map(function ($value) use ($pattern) {
            return preg_replace($pattern, '', $value);
        }, $array);
        return $array;
    }


    public function update($id, Request $request)
    {
        $request->validate([
            'nombre' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $magistrado = Magistrados::findOrFail($id);


        if ($request->hasFile('image')) {
            if ($magistrado->ruta_imagen && Storage::exists(str_replace('storage/', 'public/', $magistrado->ruta_imagen))) {
                Storage::delete(str_replace('storage/', 'public/', $magistrado->ruta_imagen));
            }

            $image = $request->file('image');
            $fileName = time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/magistrados', $fileName);
            $magistrado->ruta_imagen = str_replace('public/', 'storage/', $path);
        }

        if ($request->filled('nombre')) {
            $magistrado->nombre = $request->nombre;
        }

        $magistrado->save();

        return response()->json(['message' => 'Información actualizada con éxito', 'magistrado' => $magistrado], 200);
    }

    public function obtenerSerieTemporal($id, Request $request)
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


    public function descomponerSerie(Request $request)
    {

        $magistrado = Magistrados::where('id', $request->id)->firstOrFail();
        $salas = DB::table('resolutions as r')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                DB::raw('MAX(r.fecha_emision) as fecha_max'),
                DB::raw('MIN(r.fecha_emision) as fecha_min')
            )
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->get();

        $fecha_final = Carbon::parse(max($salas->pluck('fecha_max')->toArray()))->endOfMonth();
        $fecha_inicial = Carbon::parse(min($salas->pluck('fecha_min')->toArray()))->startOfMonth();
        $query = "
            SELECT
                series::date AS periodo,
                COALESCE(COUNT(r.id), 0) AS cantidad
            FROM
                generate_series(:fechaInicial::date, :fechaFinal::date, '1 MONTH'::INTERVAL) AS series
            LEFT JOIN resolutions r
                ON EXTRACT(YEAR FROM r.fecha_emision) = EXTRACT(YEAR FROM series::date)
                AND EXTRACT(MONTH FROM r.fecha_emision) = EXTRACT(MONTH FROM series::date)
                AND r.magistrado_id = :magistradoId
            GROUP BY
                periodo
            ORDER BY
                periodo;
        ";

        $resolutions = DB::select($query, [
            'fechaInicial' => $fecha_inicial,
            'fechaFinal' => $fecha_final,
            'magistradoId' => $magistrado->id,
        ]);

        // Preparar los datos en JSON
        $data = [
            'id' => $magistrado->id,
            'resolutions' => $resolutions
        ];
        //return $resolutions;
        // Enviar datos a Flask
        $response = Http::post('http://127.0.0.1:5000/predicciones/', [
            'data' => json_encode($data)
        ]);

        // Opcional: Manejar la respuesta
        if ($response->successful()) {
            return $response->json();
        } else {
            return response()->json(['error' => 'Error al enviar datos a Flask' . $response], 500);
        }
    }



    public function getByDepartamento($id, Request $request)
    {
        // Obtener las fechas del request
        $fecha_min = $request->input('min_date');
        $fecha_max = $request->input('max_date');
        if ($fecha_min && !Carbon::hasFormat($fecha_min, 'Y-m-d')) {
            return response()->json([
                'error' => 'Formato de fecha mínima no válido.'
            ], 400);
        }

        if ($fecha_max && !Carbon::hasFormat($fecha_max, 'Y-m-d')) {
            return response()->json([
                'error' => 'Formato de fecha máxima no válido.'
            ], 400);
        }

        try {
            $magistrado = Magistrados::findOrFail($id);
            $res_departamentos = DB::table('departamentos as d')
                ->leftJoin('resolutions as r', function ($join) use ($magistrado) {
                    $join->on('d.id', '=', 'r.departamento_id')
                        ->where('r.magistrado_id', '=', $magistrado->id);
                })
                ->select(
                    'd.nombre as name',
                    DB::raw('count(r.id) as value')
                )
                ->where('d.nombre', '!=', 'Desconocido')
                ->groupBy('d.nombre')
                ->orderBy('d.nombre');


            if ($fecha_min) {
                $fecha_min = Carbon::createFromFormat('Y-m-d', $fecha_min)->startOfDay();
                $res_departamentos = $res_departamentos->where('r.fecha_emision', '>=', $fecha_min);
            }

            if ($fecha_max) {
                $fecha_max = Carbon::createFromFormat('Y-m-d', $fecha_max)->endOfDay();
                $res_departamentos = $res_departamentos->where('r.fecha_emision', '<=', $fecha_max);
            }

            $res_departamentos = $res_departamentos->get();

            return response()->json($res_departamentos, 200);
        } catch (ModelNotFoundException $e) {
            // Si el magistrado no fue encontrado
            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener los datos ' . $e
            ], 500);
        }
    }




    public function obtenerModelo($name, $values)
    {
        $allowedTables = [
            'tipo_resolucion' => 'tipo_resolucions',
            'departamento' => 'departamentos',
            'sala' => 'salas',
            'magistrado' => 'magistrados',
            'forma_resolucion' => 'forma_resolucions',
            'tipo_jurisprudencia' => 'tipo_jurisprudencias'
        ];

        if (!array_key_exists($name, $allowedTables)) {
            throw new ModelNotFoundException("No se encontró el modelo '$name'.");
        }

        $table = $allowedTables[$name];

        return DB::table("$table as x")
            ->select("x.nombre as $name")
            ->whereIn('x.id', $values)
            ->get();
    }


    public function generarConsulta($formaId, $salas, $tablas)
    {
        // Initial select and group by
        $select = "COALESCE(COUNT(r.id), 0) AS cantidad, salas.nombre AS sala";
        $group_by = "salas.nombre";

        // Base query
        $query = Magistrados::selectRaw($select)
            ->join('resolutions as r', 'r.magistrado_id', '=', 'magistrados.id')
            ->join('salas', 'r.sala_id', '=', 'salas.id')
            ->whereIn('r.sala_id', $salas)
            ->where('magistrados.id', $formaId);

        // Loop to add dynamic joins and selects based on tables array
        foreach ($tablas as $tabla) {
            $table_name = $tabla->nombre;
            $values = $tabla->ids;
            $full_name = $table_name . "s";
            if ($table_name && $values) {
                if ($table_name == "tipo_jurisprudencia") {

                    //$jurisprudencia_nombres  = Jurisprudencias::whereIn('jurisprudencias.id', $values)->get("tipo_jurisprudencia")->pluck("tipo_jurisprudencia");
                    $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id')
                        ->join('tipo_jurisprudencias as tj', 'j.tipo_jurisprudencia_id', '=', 'tj.id')
                        ->whereIn('j.tipo_jurisprudencia_id', $values);
                    $select .= ", tj.nombre AS " . $table_name;
                    $group_by .= ", " . $table_name;
                } else {
                    $query->join($full_name, $full_name . '.id', '=', 'r.' . $table_name . '_id')
                        ->whereIn($full_name . '.id', $values);
                    $select .= ", " . $full_name . ".nombre AS " . $table_name;
                    $group_by .= ", " . $full_name . ".nombre";
                }
            }
        }

        // Finalize select and group by, then get the results
        return $query->selectRaw($select)->groupByRaw($group_by)->get();
    }



    public function obtenerEstadisticasXY(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'salas' => 'required|array',
            'salas.*' => 'required|integer',
            'magistradoId' => 'required|integer',
            'idsY' => 'required|array',
            'idsY.*' => 'required|integer',
            'nombreY' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $nombre = $request['nombreY'];
        $ids = $request['idsY'];

        $salas = Sala::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $table = MagistradosController::obtenerModelo($nombre, $ids);

        $salasArray = $salas->pluck('sala')->toArray();
        $tableArray = $table->pluck($nombre)->toArray();
        $combinations = [];

        foreach ($salasArray as $sala) {
            foreach ($tableArray as $row) {
                $combinations[] = [
                    'sala' => $sala,
                    $nombre => $row,
                    "cantidad" => 0,
                ];
            }
        }

        $datos = MagistradosController::generarConsulta($request->magistradoId, $request->salas, [
            (object)[
                "nombre" => $nombre,
                "ids" => $ids
            ]
        ]);

        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->sala][$dato->$nombre] = $dato->cantidad;
        }


        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']][$item[$nombre]] ?? 0;
        }


        return response()->json([
            'data' => MagistradosController::ordenarArrayXY($combinations, $nombre , "sala"),
        ], 200);
    }
    public function ordenarArrayXY($combinations, $nombreX, $nombreY)
    {
        $variableX = $nombreX;
        $variableY = $nombreY;

        $uniqueColumns = collect($combinations)->map(function ($item) use ($variableX) {
            return $item[$variableX];
        })->unique()->values()->all();

        $resultado = [];
        $uniqueItems = collect($combinations)->pluck($variableY)->unique();

        $combinations = collect($combinations);

        foreach ($uniqueItems as $mainValue) {

            $row = [$variableY => $mainValue];

            foreach ($uniqueColumns as $column) {

                $colValue = $column;

                $entry = $combinations->first(function ($element) use ($mainValue, $variableX, $variableY, $colValue) {
                    return $element[$variableY] === $mainValue
                        && $element[$variableX] === $colValue;
                });

                $row[$column] = $entry ? $entry['cantidad'] : 0;

                if ($entry) {
                    $combinations = $combinations->reject(function ($element) use ($entry) {
                        return $element === $entry;
                    });
                }
            }

            $resultado[] = $row;
        }


       
        $filtrado = array_filter($resultado, function ($item) use ($variableY) {
            foreach ($item as $key => $value) {
                if ($key !== $variableY && $value !== 0) {
                    return true;
                }
            }
            return false; 
        });
        
        
        $filtrado = array_values($filtrado);

        return $resultado;
    }
    public function obtenerEstadisticasX(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'salas' => 'required|array',
            'salas.*' => 'required|integer',
            'magistradoId' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        $magistrado = Magistrados::findOrFail($request->magistradoId);

        $salas = Sala::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $salasArray = $salas->pluck('sala')->toArray();
        $combinations = [];
        foreach ($salasArray as $sala) {
            $combinations[] = [
                'sala' => $sala,
                'cantidad' => 0,
            ];
        }

        $datos = Magistrados::selectRaw('COALESCE(COUNT(resolutions.id), 0) AS cantidad, salas.nombre as sala')
            ->join('resolutions', 'resolutions.magistrado_id', '=', 'magistrados.id')
            ->join('salas', 'resolutions.sala_id', '=', 'salas.id')
            ->whereIn('resolutions.sala_id', $request->salas)
            ->where('magistrados.id', $magistrado->id)
            ->groupBy('salas.nombre')
            ->get();

        //$total = array_sum($datos->pluck('cantidad')->toArray());

        $datoLookup = $datos->pluck('cantidad', 'sala')->toArray();

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']] ?? 0;
        }

        $response = [
            'data' => $combinations,
        ];

        return response()->json($response, 200);
    }
}
