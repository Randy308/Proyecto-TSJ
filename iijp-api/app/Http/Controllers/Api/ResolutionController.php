<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Resolutions;
use App\Models\Salas;
use App\Models\TipoResolucions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpClient\HttpClient;

class ResolutionController extends Controller
{


    public function filtrarResolucionesContenido(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'materia' => 'required',
            'tipo_jurisprudencia' => 'required',
            'tipo_resolucion' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'sala' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'departamento' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'magistrado' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'forma_resolucion' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $variable = $request["variable"];
        $orden = $request["orden"];
        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');

        $columnasPermitidas = ['nro_resolucion', 'fecha_emision', 'tipo_resolucion', 'departamento', 'sala'];
        $variable = in_array($variable, $columnasPermitidas) ? $variable : 'fecha_emision';
        $orden = in_array(strtolower($orden), ['asc', 'desc']) ? $orden : 'asc';

        $query = DB::table('resolutions as r')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->select('r.id', 'r.nro_resolucion', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala');

        if ($request->materia != "all" || $request->tipo_jurisprudencia != "all") {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
            if ($request->tipo_jurisprudencia != "all") {
                $query->where("j.tipo_jurisprudencia", $request->tipo_jurisprudencia);
            }
            if ($request->materia != "all") {
                $query->where("j.descriptor", 'like', $request->materia . '%');
            }
        }

        if ($fecha_inicial && $fecha_final && strtotime($fecha_inicial) && strtotime($fecha_final)) {
            $query->whereBetween('r.fecha_emision', [$fecha_inicial, $fecha_final]);
        }

        if ($request->magistrado != "all") {
            $query->where("r.magistrado_id", $request->magistrado);
        }
        if ($request->forma_resolucion != "all") {
            $query->where("r.forma_resolucion_id", $request->forma_resolucion);
        }
        if ($request->tipo_resolucion != "all") {
            $query->where("r.tipo_resolucion_id", $request->tipo_resolucion);
        }
        if ($request->sala != "all") {
            $query->where("r.sala_id", $request->sala);
        }
        if ($request->departamento != "all") {
            $query->where("r.departamento_id", $request->departamento);
        }

        if ($request->has('term')) {
            $searchTerm = $request->input('term');
            $escapedTerm1 = preg_quote($searchTerm, '/');
        
            // Initialize the regex pattern to capture sentences with the first term
            $pattern = "[^\\.]*" . $escapedTerm1 . "[^\\.]*";
        
            // Add additional terms to the regex pattern if they exist in the request
            if ($request->has('term-2')) {
                $searchTerm2 = $request->input('term-2');
                $escapedTerm2 = preg_quote($searchTerm2, '/');
                $pattern = "(?=.*" . $escapedTerm2 . ")" . $pattern;
                $query->where('c.contenido', '~*', $escapedTerm2);
            }
        
            if ($request->has('term-3')) {
                $searchTerm3 = $request->input('term-3');
                $escapedTerm3 = preg_quote($searchTerm3, '/');
                $pattern = "(?=.*" . $escapedTerm3 . ")" . $pattern;
                $query->where('c.contenido', '~*', $escapedTerm3);
            }
        
            // Join `contents` and select the matched sentence using the combined pattern
            $query->join('contents as c', 'c.resolution_id', '=', 'r.id')
                ->addSelect(DB::raw("(regexp_matches(c.contenido, '$pattern', 'g'))[1] AS resumen"))
                ->where('c.contenido', '~*', $escapedTerm1);
        }
        

        $results = $query->orderBy($variable, $orden)->paginate(20);

        return response()->json($results);
    }



    public function obtenerResolucionesTSJ(Request $request)
    {

        $httpClient = HttpClient::create([
            'verify_peer' => false,
            'verify_host' => false,
        ]);

        $response = $httpClient->request('GET', 'https://jurisprudencia.tsj.bo/jurisprudencia/' . $request->id);

        if ($response->getStatusCode() === 200) {
            $data = $response->toArray();
            return ($data);
        } else {
            throw new \Exception("Failed to retrieve the data. Status code: " . $response->getStatusCode());
        }
    }

    public function index()
    {
        //
        $all_res = DB::table('resolutions as r')
            ->selectRaw("COALESCE(EXTRACT(YEAR FROM r.fecha_emision), 0) as year, COALESCE(COUNT(r.id), 0) AS cantidad")
            ->groupBy("year")
            ->orderBy("year")
            ->get();

        $all_jurisprudencia = DB::table('resolutions as r')
            ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->selectRaw("COALESCE(EXTRACT(YEAR FROM r.fecha_emision), 0) as year, COALESCE(COUNT(DISTINCT(r.id)), 0) AS cantidad")
            ->groupBy("year")
            ->orderBy("year")
            ->get();


        return response()->json([
            'Resoluciones' => $all_res,
            'Jurisprudencia' => $all_jurisprudencia,
        ]);
    }

    public function store(Request $request)
    {
        //
    }
    public function obtenerEstadisticasRes(Request $request)
    {

        $all_res = DB::table('resolutions as r')
            ->selectRaw("COALESCE(EXTRACT(YEAR FROM r.fecha_emision), 0) as year, COUNT(r.id) AS cantidad");

        if (!empty($request["tipos"])) {
            $all_res->whereIn("r.tipo_resolucion_id", $request["tipos"]);
        }
        if (!empty($request["departamentos"])) {
            $all_res->whereIn("r.departamento_id", $request["departamentos"]);
        }
        if (!empty($request["salas"])) {
            $all_res->whereIn("r.sala_id", $request["salas"]);
        }
        if (!empty($request["formas"])) {
            $all_res->whereIn("r.forma_resolucion_id", $request["formas"]);
        }


        $query = $all_res->groupBy("year")
            ->orderBy("year")
            ->get();


        $cantidades = $query->pluck('cantidad')->toArray();

        $min = min($cantidades);
        $max = max($cantidades);
        $total = array_sum($cantidades);
        $promedio = $total / count($cantidades);


        $sumDesviacion = array_reduce($cantidades, function ($carry, $cantidad) use ($promedio) {
            return $carry + pow($cantidad - $promedio, 2);
        }, 0);
        $desviacionEstandar = sqrt($sumDesviacion / count($cantidades));


        $yearMin = $query->firstWhere('cantidad', $min)->year;
        $yearMax = $query->firstWhere('cantidad', $max)->year;


        $data = [
            'data' => $query,
            'estadisticas' => [
                'minimo' => [
                    'year' => $yearMin,
                    'cantidad' => $min
                ],
                'maximo' => [
                    'year' => $yearMax,
                    'cantidad' => $max
                ],
                'total' => $total,
                'promedio' => $promedio,
                'desviacion_estandar' => $desviacionEstandar
            ]
        ];

        return response()->json($data);
    }


    public function obtenerFiltradores()
    {

        $departamentos = Departamentos::select('nombre as name', 'id')->get();

        $forma = FormaResolucions::select('nombre as name', 'id')->get();

        $salas = Salas::select('nombre as name', 'id')->get();

        $tipo = TipoResolucions::select('nombre as name', 'id')->get();


        $data = [
            'departamentos' => $departamentos->toArray(),
            'formas' => $forma->toArray(),
            'tipos' => $tipo->toArray(),
            'salas' => $salas->toArray(),
        ];

        return response()->json($data);
    }


    public function show($id): JsonResponse
    {


        try {

            $resolucion = DB::table('contents as c')
                ->join('resolutions as r', 'r.id', '=', 'c.resolution_id')
                ->leftJoin('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
                ->leftJoin('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
                ->leftJoin('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->leftJoin('magistrados as m', 'm.id', '=', 'r.magistrado_id')
                ->select(
                    'c.contenido',
                    'r.nro_resolucion',
                    'r.nro_expediente',
                    'r.fecha_emision',
                    'tr.nombre as tipo_resolucion',
                    'd.nombre as departamento',
                    'm.nombre as magistrado',
                    'fr.nombre as forma_resolucion',
                    'r.proceso',
                    'r.demandante',
                    'r.demandado'
                )
                ->where('r.id', '=', $id)
                ->first();


            return response()->json($resolucion, 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Resolución no encontrada'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener la resolución'
            ], 500);
        }
    }



    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }
    public function obtenerParametros()
    {
        $departamentos = Departamentos::all();
        $salas = Salas::all();

        if (!$salas || !$departamentos) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        $data = [
            'departamentos' => $departamentos->toArray(),
            'salas' => $salas->toArray()
        ];

        return response()->json($data);
    }

    public function filtrarResoluciones(Request $request)
    {
        $texto = $request['texto'];
        $departamento = $request['departamento'];
        $sala = $request['selectedSala'];
        $mi_sala = null;
        $orden = $request["orden"];
        $mi_departamento = null;
        $fecha_exacta = $request["fecha_exacta"];
        $fecha_desde = $request["fecha_desde"];
        $fecha_hasta = $request["fecha_hasta"];

        if ($sala && $sala !== "todas") {
            $mi_sala = Salas::where("nombre", $sala)->first();
            if (!$mi_sala) {
                return response()->json(['error' => 'Sala no encontrada'], 404);
            }
        } elseif (!$sala) {
            return response()->json(['error' => 'Campo sala no encontrado'], 404);
        }

        if ($departamento && $departamento !== "todos") {
            $mi_departamento = Departamentos::where("nombre", $departamento)->first();
            if (!$mi_departamento) {
                return response()->json(['error' => 'Departamento no encontrado'], 404);
            }
        } elseif (!$departamento) {
            return response()->json(['error' => 'Campo departamento no encontrado'], 404);
        }

        $query = DB::table('resolutions as r')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->select('r.nro_resolucion', "r.id", "r.fecha_emision", 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', "s.nombre as sala")
            ->where('c.contenido', 'like', '%' . $texto . '%');

        if ($mi_sala) {
            $query->where('r.sala_id', $mi_sala->id);
        }

        if ($mi_departamento) {
            $query->where('r.departamento_id', $mi_departamento->id);
        }

        if ($fecha_exacta) {
            $query->where('r.fecha_emision', $fecha_exacta);
        }
        if ($fecha_desde && $fecha_hasta) {
            $query->whereBetween('r.fecha_emision', [$fecha_desde, $fecha_hasta]);
        }
        if ($orden == "Recientes") {
            $query->orderByDesc('r.fecha_emision');
        } else {
            $query->orderBy('r.fecha_emision');
        }
        $paginatedData = $query->orderBy('tipo_resolucion')->paginate(10);

        return response()->json($paginatedData);
    }


    public function obtenerAvg(Request $request)
    {
        $year = $request['selectedYear'];
        $departamento = $request['departamento'];
        $sala = $request['selectedSala'];

        $mi_sala = "NULL";
        $mi_departamento = "NULL";

        if ($sala && $sala !== "Todas") {
            $mi_sala = Salas::where("nombre", $sala)->first()->id;
            if (!$mi_sala) {
                return response()->json(['error' => 'Sala no encontrada'], 404);
            }
        } elseif (!$sala) {
            return response()->json(['error' => 'Campo sala no encontrado'], 404);
        }

        if ($departamento && $departamento !== "Todos") {
            $mi_departamento = Departamentos::where("nombre", $departamento)->first()->id;
            if (!$mi_departamento) {
                return response()->json(['error' => 'Departamento no encontrado'], 404);
            }
        } elseif (!$departamento) {
            return response()->json(['error' => 'Campo departamento no encontrado'], 404);
        }

        $data = [];
        $formaResoluciones = DB::table('forma_resolucions as fr')
            ->join('resolutions as r', 'r.forma_resolucion_id', '=', 'fr.id')
            ->select('fr.nombre', 'fr.id', DB::raw('count(r.id) as resolucion_count'))
            ->groupBy('fr.id')
            ->orderBy('resolucion_count', 'desc')
            ->limit(10)
            ->get();

        $xAxis = [];
        foreach ($formaResoluciones as $res) {

            if ($year && $year !== "Todos") {

                $resolutions = DB::select("
                                            SELECT *
                                            FROM public.obtenerporforma_resolucion(
                                                '" . $year . "-01-01',
                                                '" . $year . "-12-01'," . $res->id . ",
                                                " . $mi_departamento . ",
                                                " . $mi_sala . "
                                            )
                                        ");

                $periodo = "mes";
            } else {


                $resolutions = DB::select("
                                            SELECT *
                                            FROM public.ObtenerResAnual(
                                                " . $res->id . ",
                                                " . $mi_departamento . ",
                                                " . $mi_sala . "
                                            )
                                        ");
                $periodo = "year";
            }
            if (count($resolutions) > count($xAxis)) {
                $xAxis = $resolutions;
            }

            if ($resolutions) {
                $data[] = [
                    'id' => $res->nombre,
                    'data' => $resolutions
                ];
            }
        }
        $array = [];
        foreach ($xAxis as $element) {
            $valor = $element->$periodo;
            $array[] = $valor;
        }
        return response()->json([

            'tipo_periodo' => $periodo,
            'xAxis' => $array,
            'data' => $data,
        ]);
    }
}
