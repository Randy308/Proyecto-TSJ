<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Jurisprudencias;
use App\Models\Magistrados;
use App\Models\Resolutions;
use App\Models\Salas;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class MagistradosController extends Controller
{

    public function index()
    {
        $magistrados = DB::table('magistrados as m')
        ->selectRaw("m.id, m.nombre,
                     MAX(r.fecha_emision) as fecha_max,
                     MIN(r.fecha_emision) as fecha_min,
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


        $magistrado = Magistrados::where("id", $request->id)->first();

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
            ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                'j.tipo_jurisprudencia as nombre',
                DB::raw('MIN(j.id) as id')
            )
            ->whereIn('r.sala_id', $salas)
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->whereNotNull('j.tipo_jurisprudencia')
            ->groupBy('j.tipo_jurisprudencia')
            ->orderBy('j.tipo_jurisprudencia')
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

        $magistrado = Magistrados::where("id", $id)->first();

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
            ->having(DB::raw("COUNT(r.id)"), ">", 20) // Use COUNT(r.id) directly in having
            ->orderBy('cantidad', 'desc')
            ->get();

        Carbon::setLocale('es');
        $total = $salas->sum("cantidad");

        foreach ($salas as $sala) {
            $sala->porcetaje = round($sala->cantidad * 100 / $total, 2);
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


    public function obtenerCoAutores(Request $request)

    {
        $id = $request["id"];
        $magistrado = Magistrados::where('id', $id)->first();

        // Modificar la consulta para usar paginate en lugar de limit
        $query = DB::table('contents as c')
            ->join('resolutions as r', 'r.id', '=', 'c.resolution_id')
            ->select(DB::raw("substring(c.contenido from 'POR TANTO[[:space:][:print:]]+(Reg[ií]strese[[:space:][:print:]]+)') as participantes"), 'r.id as resolution_id')
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
        $variable = $request["variable"];
        $orden = $request["orden"];

        $magistrado = Magistrados::where("id", $id)->first();

        if ($magistrado) {
            // Lista de columnas válidas para la ordenación
            $columnasPermitidas = ['nro_resolucion', 'fecha_emision', 'tipo_resolucion', 'departamento', 'sala'];

            // Validar variable y orden
            $variable = in_array($variable, $columnasPermitidas) ? $variable : 'fecha_emision';
            $orden = in_array(strtolower($orden), ['asc', 'desc']) ? $orden : 'asc';

            $query = DB::table('resolutions as r')
                ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
                ->join('salas as s', 's.id', '=', 'r.sala_id')
                ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->select('r.nro_resolucion', 'r.id', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala')
                ->where('r.magistrado_id', $magistrado->id);

            // Aplicar ordenación según los parámetros de entrada
            $paginatedData = $query->orderBy($variable, $orden)->paginate(20);
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


    public function generarSerieTemporal(Request $request)
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

    public function obtenerResolucionesDepartamento($id, Request $request)
    {
        // Obtener las fechas del request
        $fecha_min = $request->input('min_date');
        $fecha_max = $request->input('max_date');

        try {
            // Verificar si las fechas son válidas
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

            // Buscar el magistrado por ID
            $magistrado = Magistrados::where('id', $id)->firstOrFail();

            // Construir la consulta para obtener las resoluciones por departamento
            $res_departamentos = DB::table('resolutions as r')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                'd.nombre as name',
                DB::raw('count(*) as value')
            )
                ->where('r.magistrado_id', '=', $magistrado->id)
                ->where('d.nombre', '!=', 'Desconocido')
                ->groupBy('d.nombre')
                ->orderBy('d.nombre');

            // Filtrar por fecha mínima
            if ($fecha_min) {
                // Convertir la fecha mínima a formato Carbon
                $fecha_min = Carbon::createFromFormat('Y-m-d', $fecha_min)->startOfDay();
                $res_departamentos = $res_departamentos->where('r.fecha_emision', '>=', $fecha_min);
            }

            // Filtrar por fecha máxima
            if ($fecha_max) {
                // Convertir la fecha máxima a formato Carbon
                $fecha_max = Carbon::createFromFormat('Y-m-d', $fecha_max)->endOfDay();
                $res_departamentos = $res_departamentos->where('r.fecha_emision', '<=', $fecha_max);
            }

            // Obtener los resultados de la consulta
            $res_departamentos = $res_departamentos->get();

            // Retornar los resultados en formato JSON
            return response()->json($res_departamentos, 200);
        } catch (ModelNotFoundException $e) {
            // Si el magistrado no fue encontrado
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

    public function obtenerSerieTemporal($id, Request $request)
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

    public function obtenerModelo($name, $values)
    {
        $errorMessage = null;

        if ($name == "tipo_jurisprudencia") {
            $model = DB::table('jurisprudencias as x')
                ->select('x.tipo_jurisprudencia as ' . $name)->whereNotNull('x.tipo_jurisprudencia')
                ->distinct()
                ->get();
        } else {
            $full_name = $name . "s";
            $model = DB::table($full_name . ' as x')
                ->select('x.nombre as ' . $name)
                ->whereIn('x.id', $values)
                ->get();
        }

        if ($model->isEmpty()) {
            $defaultErrorMessage = "No se encontró el modelo '$name'.";
            throw new ModelNotFoundException($errorMessage ?: $defaultErrorMessage);
        }

        return $model;
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

                    $jurisprudencia_nombres  = Jurisprudencias::whereIn('jurisprudencias.id', $values)->get("tipo_jurisprudencia")->pluck("tipo_jurisprudencia");
                    $query->join('jurisprudencias', 'jurisprudencias.resolution_id', '=', 'r.id')
                        ->whereIn('jurisprudencias.tipo_jurisprudencia', $jurisprudencia_nombres);
                    $select .= ", jurisprudencias.tipo_jurisprudencia AS " . $table_name;
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

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
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

        $total = array_sum($datos->pluck('cantidad')->toArray());

        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->sala][$dato->$nombre] = $dato->cantidad;
        }


        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']][$item[$nombre]] ?? 0;
        }

        return response()->json([
            'data' => MagistradosController::ordenarArrayXY($combinations, $nombre),
        ], 200);
    }
    public function ordenarArrayXY($combinations, $name)
    {
        $variableX = $name;
        $variableY = 'sala';

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
        $forma = Magistrados::findOrFail($request->magistradoId);

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
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
            ->where('magistrados.id', $request->magistradoId)
            ->groupBy('salas.nombre')
            ->get();

        $total = array_sum($datos->pluck('cantidad')->toArray());
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
