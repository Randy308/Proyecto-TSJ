<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Models\Salas;
use App\Models\TipoResolucions;
use Carbon\Carbon;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;
use Symfony\Component\HttpClient\HttpClient;

class ResolutionController extends Controller
{


    public function filtrarResolucionesContenido(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'materia' => 'nullable|string',
            'tipo_jurisprudencia' => 'nullable|string',
            'tipo_resolucion' => [
                'nullable',
                'integer',
            ],
            'sala' => [
                'nullable',
                'integer',
            ],
            'departamento' => [
                'nullable',
                'integer',
            ],
            'magistrado' => [
                'nullable',
                'integer',
            ],
            'forma_resolucion' => [
                'nullable',
                'integer',
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

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
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

        if ($request->has('magistrado')) {
            $query->where("r.magistrado_id", $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->where("r.forma_resolucion_id", $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->where("r.tipo_resolucion_id", $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->where("r.sala_id", $request->sala);
        }
        if ($request->has('departamento')) {
            $query->where("r.departamento_id", $request->departamento);
        }

        if ($request->has('term') && !empty($request->input('term')) && strlen($request->input('term')) > 2) {

            $searchTerm = $request->input('term');
            $escapedTerm1 = preg_quote($searchTerm, '/');


            $pattern = "[^\\.]*" . $escapedTerm1 . "[^\\.]*";


            if ($request->has('term-2') && !empty($request->input('term-2')) && strlen($request->input('term-2')) > 2) {

                $searchTerm2 = $request->input('term-2');
                $escapedTerm2 = preg_quote($searchTerm2, '/');
                $pattern = "(?=.*" . $escapedTerm2 . ")" . $pattern;
                $query->where('c.contenido', '~*', $escapedTerm2);
            }

            if ($request->has('term-3') && !empty($request->input('term-3')) && strlen($request->input('term-3')) > 2) {

                $searchTerm3 = $request->input('term-3');
                $escapedTerm3 = preg_quote($searchTerm3, '/');
                $pattern = "(?=.*" . $escapedTerm3 . ")" . $pattern;
                $query->where('c.contenido', '~*', $escapedTerm3);
            }

            $query->join('contents as c', 'c.resolution_id', '=', 'r.id')
                ->addSelect(DB::raw("(regexp_matches(c.contenido, '$pattern', 'g'))[1] AS resumen"))
                ->where('c.contenido', '~*', $escapedTerm1);
        }


        $results = $query->orderBy($variable, $orden)->paginate(20);

        return response()->json($results);
    }


    //     $query->join('contents as c', 'c.resolution_id', '=', 'r.id')
    // ->addSelect(DB::raw("regexp_replace(c.contenido, '($pattern)', '<b>\\1</b>', 'gi') AS resumen"))
    // ->where('c.contenido', '~*', $escapedTerm1);



    public function obtenerDocumentoResoluciones(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'materia' => 'nullable|string',
            'tipo_jurisprudencia' => 'nullable|string',
            'tipo_resolucion' => [
                'nullable',
                'integer',
            ],
            'sala' => [
                'nullable',
                'integer',
            ],
            'departamento' => [
                'nullable',
                'integer',
            ],
            'magistrado' => [
                'nullable',
                'integer',
            ],
            'forma_resolucion' => [
                'nullable',
                'integer',
            ],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');

        $query = DB::table('resolutions as r')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('mapeos as m', 'm.resolution_id', '=', 'r.id')
            ->select('r.id', 'r.nro_resolucion', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala', 'fr.nombre as forma_resolucion', 'r.proceso', 'm.external_id as original');

        $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        $query->addSelect('j.tipo_jurisprudencia', 'j.descriptor', 'j.ratio', 'j.restrictor');


        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {

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

        if ($request->has('magistrado')) {
            $query->where("r.magistrado_id", $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->where("r.forma_resolucion_id", $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->where("r.tipo_resolucion_id", $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->where("r.sala_id", $request->sala);
        }
        if ($request->has('departamento')) {
            $query->where("r.departamento_id", $request->departamento);
        }
        if ($request->has('term') && !empty($request->input('term')) && strlen($request->input('term')) > 2) {

            $searchTerm = $request->input('term');
            $escapedTerm1 = preg_quote($searchTerm, '/');


            $pattern = "[^\\.]*" . $escapedTerm1 . "[^\\.]*";


            if ($request->has('term-2') && !empty($request->input('term-2')) && strlen($request->input('term-2')) > 2) {

                $searchTerm2 = $request->input('term-2');
                $escapedTerm2 = preg_quote($searchTerm2, '/');
                $pattern = "(?=.*" . $escapedTerm2 . ")" . $pattern;
                $query->where('j.ratio', '~*', $escapedTerm2);
            }

            if ($request->has('term-3') && !empty($request->input('term-3')) && strlen($request->input('term-3')) > 2) {

                $searchTerm3 = $request->input('term-3');
                $escapedTerm3 = preg_quote($searchTerm3, '/');
                $pattern = "(?=.*" . $escapedTerm3 . ")" . $pattern;
                $query->where('j.ratio', '~*', $escapedTerm3);
            }

            $query->where('j.ratio', '~*', $escapedTerm1);
            // $query->addSelect(DB::raw("(regexp_matches(j.ratio, '$pattern', 'g'))[1] AS resumen"))
            //     ->where('j.ratio', '~*', $escapedTerm1);

            //$query->addSelect(DB::raw("substring(c.contenido from 'POR TANTO[:]?[\\s]?([[:space:][:print:]]+?)Reg[ií]strese') as resultado"));
        }


        $results = $query->limit(50)->get();



        if (!$results) {
            return response()->json(['error' => 'Sala no encontrada'], 404);
        }

        if ($results->count() === 0) {
            return response()->json(['error' => 'Datos no encontrados '], 404);
        }




        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');


        //return $results;
        $pdf = LaravelMpdf::loadView('resolucion', ['results' => $results->toArray(), "fechaActual" => $fechaActual], [], [
            'format'          => 'letter',
            'margin_left'     => 25,  // 2.5 cm in mm
            'margin_right'    => 25,  // 2.5 cm in mm
            'margin_top'      => 25,  // 2.5 cm in mm
            'margin_bottom'   => 25,  // 2.5 cm in mm
            'orientation'     => 'P',
            'title'           => 'Documento',
            'author'          => 'IIJP',
            'custom_font_dir' => public_path('fonts/'),
            'custom_font_data' => [
                'cambria' => [
                    'R'  => 'Cambriax.ttf',
                    'B'  => 'Cambria-Bold.ttf',
                    'I'  => 'Cambria-Italic.ttf',
                    'BI' => 'Cambria-Bold-Italic.ttf'
                ],
                'trebuchet_ms' => [
                    'R'  => 'trebuc.ttf',
                    'B'  => 'trebucbd.ttf',
                    'I'  => 'trebucit.ttf'
                ],
                'times_new_roman' => [
                    'R'  => 'times-new-roman.ttf',
                    'B'  => 'times-new-roman-bold.ttf',
                    'I'  => 'times-new-roman-italic.ttf',
                    'BI' => 'times-new-roman-bold-italic.ttf'
                ],
            ]
        ]);

        //$pdf = LaravelMpdf::loadView('test');
        return $pdf->Output('document.pdf', 'I');
        //return $pdf->stream('document.pdf');
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

        $all_res = DB::table('resolutions as r')
            ->selectRaw("DATE_TRUNC('year', r.fecha_emision)::date as periodo, COALESCE(COUNT(r.id), 0) AS cantidad")
            ->groupBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)"))
            ->havingRaw("COUNT(r.id) > 10")
            ->orderBy('periodo')
            ->get();


        $all_jurisprudencia = DB::table('resolutions as r')
            ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->selectRaw("DATE_TRUNC('year', r.fecha_emision)::date as periodo, COALESCE(COUNT(DISTINCT r.id), 0) AS cantidad")
            ->groupBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)"))
            ->orderBy("periodo")
            ->havingRaw("COUNT(r.id) > 10")
            ->get();


        $max_res = max($all_res->pluck('cantidad')->toArray());
        $max_juris = max($all_jurisprudencia->pluck('cantidad')->toArray());
        $result_res = $all_res->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();
        $result_juris = $all_jurisprudencia->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();

        return response()->json([
            'max_res' => $max_res,
            'max_juris' => $max_juris,
            'resoluciones' => $result_res,
            'jurisprudencia' => $result_juris,
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
                    'r.demandado',
                    'r.maxima',
                    'r.sintesis',
                )
                ->where('r.id', '=', $id)
                ->first();
            $jurisprudencias = Jurisprudencias::where('resolution_id', $id)->get();
            $jurisprudencias->makeHidden(['id', 'resolution_id', 'updated_at', 'created_at']);


            return response()->json([

                'resolucion' => $resolucion,
                'jurisprudencias' => $jurisprudencias,
            ], 200);
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



    public function obtenerSerieTemporal(Request $request)


    {

        $validator = Validator::make($request->all(), [
            'materia' => 'nullable|string',
            'tipo_jurisprudencia' => 'nullable|string',
            'tipo_resolucion' => [
                'nullable',
                'integer',
            ],
            'sala' => [
                'nullable',
                'integer',
            ],
            'departamento' => [
                'nullable',
                'integer',
            ],
            'magistrado' => [
                'nullable',
                'integer',
            ],
            'forma_resolucion' => [
                'nullable',
                'integer',
            ],
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');
        $intervalo = $request->input('intervalo');

        $intervalo = "quarter";
        $validIntervals = ['day', 'month', 'year', 'week', 'quarter'];
        if (!in_array($intervalo, $validIntervals)) {
            throw new InvalidArgumentException("Invalid interval specified.");
        }

        $query = DB::table('resolutions AS r')
            ->selectRaw('COUNT(r.id) AS cantidad');

        switch ($intervalo) {
            case 'day':
                $query->selectRaw('DATE(r.fecha_emision) AS periodo');
                $query->groupBy(DB::raw('DATE(r.fecha_emision)'));
                $query->orderBy(DB::raw('DATE(r.fecha_emision)'));
                break;
            case 'week':
                $query->selectRaw('DATE_TRUNC(\'week\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'week\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'week\', r.fecha_emision)::date'));
                break;
            case 'month':
                $query->selectRaw('DATE_TRUNC(\'month\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'month\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'month\', r.fecha_emision)::date'));
                break;
            case 'quarter':

                $query->selectRaw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date'));
                break;
            case 'year':

                $query->selectRaw('DATE_TRUNC(\'year\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'year\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'year\', r.fecha_emision)::date'));
                break;
        }


        if ($request->has('limite')) {
            $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 2005');
        }
        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 1999');
        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) < 2025');
        if ($request->has('magistrado')) {
            $query->where('r.magistrado_id', $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->where('r.forma_resolucion_id', $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->where('r.tipo_resolucion_id', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->where('r.sala_id', $request->sala);
        }
        if ($request->has('departamento')) {
            $query->where('r.departamento_id', $request->departamento);
        }

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipo_jurisprudencia = $request->tipo_jurisprudencia ?? 'all';
            $materia = $request->materia ?? 'all';

            $query->join(DB::raw("(SELECT resolution_id FROM jurisprudencias
            WHERE ('{$tipo_jurisprudencia}' = 'all' OR tipo_jurisprudencia = '{$tipo_jurisprudencia}')
            AND ('{$materia}' = 'all' OR descriptor LIKE '{$materia}%')) AS j"), 'j.resolution_id', '=', 'r.id');
        }

        $resolutions = $query->get();

        return response()->json([

            'resolutions' => $resolutions,
        ]);
    }

    function getTerminosX(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'tabla' => 'required|string|in:jurisprudencias,resolutions',
            'columna' => 'required|string',
            'terminos' => 'required|array',
            'terminos.*' => 'required|string',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        $tableName = $request->input('tabla');
        $columnName = $request->input('columna');
        $terminos = $request->input('terminos');


        $lista = ['tipo_resolucion', 'departamento', 'sala', 'magistrado'];

        if (in_array($columnName, $lista)) {
            $table = $columnName . 's';
            $column = $columnName . '_id';

            $results = DB::table("resolutions as r")
                ->join("$table as t", 't.id', '=', "r.$column")
                ->selectRaw("
            t.nombre AS nombre,
            COUNT(*) AS cantidad
        ")->whereIn("t.nombre", $terminos)
                ->whereNotNull("t.nombre")
                ->groupBy(DB::raw("t.nombre"))
                ->orderByDesc('cantidad')
                ->get();
        } else {

            $caseConditions = array_map(function ($termino) use ($columnName) {
                return "WHEN r.$columnName ~* '^" . preg_quote($termino, '/') . "' THEN '$termino'";
            }, $terminos);


            $caseStatement = implode("\n", $caseConditions);


            $caseStatement .= "\nELSE 'Otro'";


            $results = DB::table("$tableName as r")
                ->selectRaw("
            CASE
                $caseStatement
            END AS termino,
            COUNT(*) AS cantidad
        ")
                ->whereNotNull("r.$columnName")
                ->groupBy('termino')
                ->orderByDesc('cantidad')
                ->get();
        }

        //return response()->json($results);

        return response()->json([

            'data' => $results,
            'tabla' => $tableName,
            'columna' => $columnName,
            'terminos' => $terminos,
            'nombre' => $columnName,
            'multiVariable'=> false
        ]);
    }

    function getTerminosXY(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'terminosX' => 'required|array',
            'terminosX.*' => 'required|string',
            'terminosY' => 'required|array',
            'terminosY.*' => 'required|string',
            'columnaX' => 'required|string',
            'tablaX' => 'required|string',
            'columnaY' => 'required|string',
            'tablaY' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $salasArray = $request['terminosX'];
        $tableArray = $request['terminosY'];
        $columnaX = $request['columnaX'];
        $columnaY = $request['columnaY'];
        $combinations = [];

        foreach ($salasArray as $sala) {
            foreach ($tableArray as $row) {
                $combinations[] = [
                    $columnaX => $sala,
                    $columnaY => $row,
                    "cantidad" => 0,
                ];
            }
        }

        //return response()->json($combinations);
        $datos = $this->generarConsulta([
            (object)[
                "nombre" => $request->columnaX,
                "tabla" => $request->tablaX,
                "ids" => $request->terminosX,
            ],
            (object)[
                "nombre" => $request->columnaY,
                "tabla" => $request->tablaY,
                "ids" => $request->terminosY,
            ]
        ]);



        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->$columnaX][$dato->$columnaY] = $dato->cantidad;
        }


        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item[$columnaX]][$item[$columnaY]] ?? 0;
        }


        return response()->json([

            'data' => $this->ordenarArrayXY($combinations, $columnaX ,$columnaY),
            'tabla' => $request->tablaX,
            'columna' => $request->columnaX,
            'nombre' => $request->columnaY,
            'terminos' => $request->terminosX,
            'multiVariable'=> true
        ]);

    }



    function obtenerTerminos(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'tabla' => 'required|string|in:jurisprudencias,resolutions',
            'columna' => 'required|string',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $tableName = $request->input('tabla');
        $columnName = $request->input('columna');

        $lista = ['tipo_resolucion', 'departamento', 'sala', 'magistrado', 'forma_resolucion'];

        if (in_array($columnName, $lista)) {
            $table = $columnName . 's';
            $results = DB::table("$table as t")->get(['t.nombre as termino', 't.id as cantidad']);
        } else {
            $results = DB::table($tableName . ' as t')
                ->selectRaw("
                INITCAP(REGEXP_REPLACE(SPLIT_PART(t.$columnName, ' ', 1), '[^\\w]', '', 'g')) AS termino,
                COUNT(*) AS cantidad
            ")
                ->whereNotNull("t.$columnName")
                ->groupBy(DB::raw("INITCAP(REGEXP_REPLACE(SPLIT_PART(t.$columnName, ' ', 1), '[^\\w]', '', 'g'))"))
                ->havingRaw('COUNT(*) > 5')
                ->orderByDesc('cantidad')
                ->get();
        }

        foreach ($results as $key => $result) {
            if (strlen($result->termino) < 3) {
                unset($results[$key]);
            }
        }
        $results = array_values($results->toArray());


        return response()->json($results);
    }


    function buscarTerminos(Request $request)
    {
        // Validación de parámetros
        $validator = Validator::make($request->all(), [
            'tabla' => 'required|string|in:jurisprudencias,resolutions',
            'columna' => 'required|string',
            'termino' => 'required|string',
            'pagina' => 'required|integer|min:1',  // Agregar validación de página
        ]);

        // Si la validación falla, retornar un error
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $tableName = $request->input('tabla');
        $columnName = $request->input('columna');
        $termino = $request->input('termino');
        $pagina = $request->input('pagina', 1);

        $results = DB::table($tableName . ' as t')
            ->select("t.$columnName as nombre")
            ->whereNotNull("t.$columnName")
            ->whereRaw("LOWER(t.$columnName) LIKE ?", [mb_strtolower($termino, 'UTF-8') . '%'])
            ->groupBy("t.$columnName")
            ->paginate(10, ['*'], 'pagina', $pagina);

        return response()->json($results);
    }


    public function generarConsulta($tablas)
    {
        // Base query
        $query = DB::table("resolutions as r")
            ->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');

        $selects = ["COALESCE(COUNT(r.id), 0) AS cantidad"];
        $group_by = [];
        $having = [];

        foreach ($tablas as $tabla) {
            $tableName = $tabla->tabla;
            $values = $tabla->ids;
            $columnName = $tabla->nombre;

            if ($tableName && $values) {
                $lista = ['tipo_resolucion', 'departamento', 'sala', 'magistrado'];

                if (in_array($columnName, $lista)) {
                    $table = $columnName . 's';
                    $column = $columnName . '_id';

                    // Join with the related table
                    $query->join("$table as t_$columnName", "t_$columnName.id", "=", "r.$column");

                    // Add to select and group by
                    $selects[] = "t_$columnName.nombre AS $columnName";
                    $group_by[] = "t_$columnName.nombre";

                    // Add where condition for filtering by values
                    $query->whereIn("t_$columnName.nombre", $values);
                } else {
                    // Dynamically handle CASE statements based on the table
                    $caseConditions = array_map(function ($termino) use ($columnName, $tableName) {
                        $columnTable = $tableName === 'resolutions' ? 'r' : 'j';  // Check if the table is 'resolutions' or 'jurisprudencias'
                        return "WHEN $columnTable.$columnName ~* '^" . preg_quote($termino, '/') . "' THEN '$termino'";
                    }, $values);

                    // Join the conditions directly in the CASE statement
                    $caseStatement = implode("\n", $caseConditions);

                    // Add to select
                    $selects[] = "CASE $caseStatement END AS $columnName";

                    // In the group by, use the CASE expression itself instead of the column
                    $group_by[] = "CASE $caseStatement END";

                    // If no match exists, exclude it from the results
                    $having[] = "CASE $caseStatement END IS NOT NULL";
                }
            }
        }

        // Finalize the query with selects, group by, and having
        $query->selectRaw(implode(", ", $selects))
            ->groupByRaw(implode(", ", $group_by));

        if (count($having) > 0) {
            $query->havingRaw(implode(" AND ", $having));
        }

        $query->orderByDesc('cantidad');

        // Return the results
        return $query->get();
    }


    public function ordenarArrayXY($combinations, $nombreX ,$nombreY)
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

        return $resultado;
    }
}
