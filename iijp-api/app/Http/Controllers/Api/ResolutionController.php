<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\WebScrappingJob;
use App\Models\Contents;
use App\Models\Departamentos;
use App\Models\Descriptor;
use App\Models\FormaResolucions;
use App\Models\Jurisprudencias;
use App\Models\Magistrados;
use App\Models\Mapeos;
use App\Models\Resolutions;
use App\Models\Sala;
use App\Models\TipoJurisprudencia;
use App\Models\TipoResolucions;
use App\Utils\NLP;
use Carbon\Carbon;
use DateInterval;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;
use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\{TransportExceptionInterface, ClientExceptionInterface, ServerExceptionInterface};

class ResolutionController extends Controller
{



    public function obtenerEstadisticas(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'variable' => 'required|array',
            'variable.*' => 'required|integer',
            'nombre' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $nombre = strtolower($request->nombre);

        $campos = [
            "tipo_resolucion" => ["tabla" => "tipo_resolucions", "foreign_key" => "tipo_resolucion_id", "join" => false, "columna" => "id", "nombre" => "tipo_resolucion"],
            "departamento" => ["tabla" => "departamentos", "foreign_key" => "departamento_id", "join" => false, "columna" => "id", "nombre" => "departamento"],
            "sala" => ["tabla" => "salas", "foreign_key" => "sala_id", "join" => false, "columna" => "id", "nombre" => "sala"],
            "magistrado" => ["tabla" => "magistrados", "foreign_key" => "magistrado_id", "join" => false, "columna" => "id", "nombre" => "magistrado"],
            "forma_resolucion" => ["tabla" => "forma_resolucions", "foreign_key" => "forma_resolucion_id", "join" => false, "columna" => "id", "nombre" => "forma_resolucion"],
            "tipo_jurisprudencia" => ["tabla" => "jurisprudencias", "foreign_key" => "tipo_jurisprudencia_id", "join" => true, "columna" => "id", "nombre" => "tipo_jurisprudencia"],
            "materia" => ["tabla" => "descriptors", "foreign_key" => "root_id", "join" => true, "columna" => "id", "nombre" => "materia"],
        ];

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada'
            ], 422);
        }


        $filtroPrincipal = $campos[$nombre];



        $query = DB::table('resolutions as r');
        if ($filtroPrincipal["join"]) {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }
        $query->selectRaw(' x.nombre as nombre ,Count(r.id) as cantidad')->join($filtroPrincipal["tabla"] . ' as x', 'x.id', $filtroPrincipal["foreign_key"])->whereIn($filtroPrincipal["foreign_key"], $request->variable)->groupBy("x.nombre");


        if ($request->has('periodo')) {
            $query->whereYear("fecha_emision", $request->periodo);
        }
        if ($request->has('departamento')) {
            $departamentos = Departamentos::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
            $query->whereIn("departamento_id", $departamentos);
        }
        $data = $query->get();
        return response()->json([

            'data' => $data,
            'tabla' => $request->nombre,
            'columna' => $request->nombre,
            'nombre' => "nombre",
            'terminos' => $data->pluck('nombre'),
            'multiVariable' => false
        ]);
    }

    public function obtenerEstadisticasXY(Request $request)
    {

        $nombre = strtolower($request->nombre);
        $nombreY = strtolower($request->nombreY);
        $campos = [
            "tipo_resolucion" => ["tabla" => "tipo_resolucions", "foreign_key" => "tipo_resolucion_id", "join" => false, "columna" => "id", "nombre" => "tipo_resolucion"],
            "departamento" => ["tabla" => "departamentos", "foreign_key" => "departamento_id", "join" => false, "columna" => "id", "nombre" => "departamento"],
            "sala" => ["tabla" => "salas", "foreign_key" => "sala_id", "join" => false, "columna" => "id", "nombre" => "sala"],
            "magistrado" => ["tabla" => "magistrados", "foreign_key" => "magistrado_id", "join" => false, "columna" => "id", "nombre" => "magistrado"],
            "forma_resolucion" => ["tabla" => "forma_resolucions", "foreign_key" => "forma_resolucion_id", "join" => false, "columna" => "id", "nombre" => "forma_resolucion"],
            "tipo_jurisprudencia" => ["tabla" => "tipo_jurisprudencias", "foreign_key" => "tipo_jurisprudencia_id", "join" => true, "columna" => "id", "nombre" => "tipo_jurisprudencia"],
            "materia" => ["tabla" => "descriptors", "foreign_key" => "root_id", "join" => true, "columna" => "id", "nombre" => "materia"],
        ];

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada'
            ], 422);
        }
        if (!array_key_exists($nombreY, $campos)) {
            return response()->json([
                'No existe la variable solicitada'
            ], 422);
        }

        $filtroX = $campos[$nombre];
        $filtroY = $campos[$nombreY];
        unset($campos[$nombre]);
        unset($campos[$nombreY]);


        $arrayX = DB::table($filtroX["tabla"])
            ->select('nombre as x')->whereIn('id', $request->variable)->get()->pluck('x')->toArray();
        $arrayY = DB::table($filtroY["tabla"])
            ->select('nombre as y')->whereIn('id', $request->variableY)->get()->pluck('y')->toArray();

        $combinations = [];

        foreach ($arrayX as $sala) {
            foreach ($arrayY as $row) {
                $combinations[] = [
                    'x' => $sala,
                    'nombre' => $row,
                    "cantidad" => 0,
                ];
            }
        }

        $query = DB::table('resolutions as r');
        if ($filtroX["join"] || $filtroY["join"]) {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }
        $query->selectRaw(' x.nombre as x ,y.nombre as nombre , COALESCE(COUNT(r.id), 0) AS cantidad');
        $query->join($filtroX["tabla"] . ' as x', 'x.id', $filtroX["foreign_key"])->whereIn($filtroX["foreign_key"], $request->variable)->groupBy("x.nombre");

        $query->join($filtroY["tabla"] . ' as y', 'y.id', $filtroY["foreign_key"])->whereIn($filtroY["foreign_key"], $request->variableY)->groupBy("y.nombre");

        if ($request->has('periodo')) {
            $query->whereYear("fecha_emision", $request->periodo);
        }
        if ($request->has('departamento')) {
            $departamentos = Departamentos::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
            $query->whereIn("departamento_id", $departamentos);
        }
        $data = $query->get();

        $total = array_sum($data->pluck('cantidad')->toArray());


        $datoLookup = [];
        foreach ($data as $dato) {
            $datoLookup[$dato->x][$dato->nombre] = $dato->cantidad;
        }


        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['x']][$item['nombre']] ?? 0;
        }


        return response()->json([
            'total' => $total,
            'data' => $this->ordenarArrayXY($combinations, 'x', 'nombre'),
        ]);;
    }
    public function obtenerFiltros(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'variable' => 'required|array',
            'variable.*' => 'required|integer',
            'nombre' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        $campos = [
            "tipo_resolucion" => ["tabla" => "tipo_resolucions", "foreign_key" => "tipo_resolucion_id", "join" => false, "columna" => "id", "nombre" => "tipo_resolucion"],
            "departamento" => ["tabla" => "departamentos", "foreign_key" => "departamento_id", "join" => false, "columna" => "id", "nombre" => "departamento"],
            "sala" => ["tabla" => "salas", "foreign_key" => "sala_id", "join" => false, "columna" => "id", "nombre" => "sala"],
            "magistrado" => ["tabla" => "magistrados", "foreign_key" => "magistrado_id", "join" => false, "columna" => "id", "nombre" => "magistrado"],
            "forma_resolucion" => ["tabla" => "forma_resolucions", "foreign_key" => "forma_resolucion_id", "join" => false, "columna" => "id", "nombre" => "forma_resolucion"],
            "tipo_jurisprudencia" => ["tabla" => "jurisprudencias", "foreign_key" => "tipo_jurisprudencia_id", "join" => true, "columna" => "id", "nombre" => "tipo_jurisprudencia"],
            "materia" => ["tabla" => "jurisprudencias", "foreign_key" => "root_id", "join" => true, "columna" => "id", "nombre" => "materia"],
        ];

        $nombre = strtolower($request->nombre);

        if (!array_key_exists($nombre, $campos)) {
            return response()->json(['error' => 'Filtro inválido.'], 400);
        }

        // Extraemos el campo actual y lo quitamos del array general
        $filtroPrincipal = $campos[$nombre];
        unset($campos[$nombre]);

        if ($request->has('departamento')) {
            unset($campos['departamento']);
        }


        $resultado = [];

        // Recorremos el resto de filtros normalmente
        foreach ($campos as $key => $value) {
            $query = Resolutions::query()->from('resolutions as r');

            if ($value["join"] || $filtroPrincipal["join"]) {
                $query->join('jurisprudencias as x', 'x.resolution_id', '=', 'r.id');
            }

            if ($request->has('periodo')) {
                $query->whereYear("fecha_emision", $request->periodo);
            }

            if ($request->has('departamento')) {
                $departamentos = Departamentos::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
                $query->whereIn("departamento_id", $departamentos);
            }

            // Aplicamos el filtro principal como condición base a los otros
            if ($request->has('variable')) {
                $query->whereIn($filtroPrincipal["foreign_key"], $request->variable);
            }

            $resultado[$value["nombre"]] = $query->distinct()->pluck($value["foreign_key"])->toArray();
        }

        return response()->json($resultado);
    }

    public function obtenerOpciones(Request $request)
    {

        $filtros = $request->input('filtros', []);
        $campos = ["tipo_resolucion_id", "departamento_id", "sala_id", "magistrado_id", "forma_resolucion_id"];
        foreach ($campos as $campo) {

            $query = Resolutions::query();

            foreach ($filtros as $key => $value) {
                if ($key !== $campo && !empty($value)) {
                    $query->where($key, $value);
                }
            }
            $resultado[$campo] = $query->distinct()->pluck($campo)->toArray();
        }

        return response()->json([
            'data' => $resultado,
        ]);
    }

    public function obtenerVariables()
    {


        $departamentos = Departamentos::all('id', 'nombre');
        $salas = Sala::all('id', 'nombre');
        $tipo_jurisprudencias = TipoJurisprudencia::all('id', 'nombre');
        $tipo_resolucions = TipoResolucions::all('id', 'nombre');
        $forma_resolucions = FormaResolucions::all('id', 'nombre');
        $magistrados = Magistrados::all('id', 'nombre');
        $materia = Descriptor::whereNull('descriptor_id')->get(['id', 'nombre']);

        $periodo = DB::table('resolutions')
            ->selectRaw("CAST(coalesce(EXTRACT(YEAR FROM fecha_emision) , '0') AS integer) as id,EXTRACT(YEAR FROM fecha_emision) AS nombre")
            ->groupBy('nombre')
            ->orderBy('nombre', 'desc')
            ->get();
        $datos = [
            'departamento' => $departamentos->toArray(),
            'sala' => $salas->toArray(),
            'tipo_jurisprudencia' => $tipo_jurisprudencias->toArray(),
            'tipo_resolucion' => $tipo_resolucions->toArray(),
            'forma_resolucion' => $forma_resolucions->toArray(),
            'magistrado' => $magistrados->toArray(),
            'materia' => $materia->toArray(),
            'periodo' => $periodo->toArray(),
        ];
        $datos = array_filter($datos);

        return response()->json($datos);
    }
    public function filtrarResolucionesContenido(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|integer',
            'sala' => 'nullable|array',
            'sala.*' => 'required|integer',
            'magistrado' => 'nullable|array',
            'magistrado.*' => 'required|integer',
            'forma_resolucion' => 'nullable|array',
            'forma_resolucion.*' => 'required|integer',
            'tipo_jurisprudencia' => 'nullable|array',
            'tipo_jurisprudencia.*' => 'required|integer',
            'materia' => 'nullable|array',
            'materia.*' => 'required|integer',
            'tipo_resolucion' => 'nullable|array',
            'tipo_resolucion.*' => 'required|integer',
            'periodo' => 'nullable|array',
            'periodo.*' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);



        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }



        $variable = $request["variable"];
        $orden = $request["orden"];

        $columnasPermitidas = ['nro_resolucion', 'fecha_emision', 'tipo_resolucion', 'departamento', 'sala'];
        $variable = in_array($variable, $columnasPermitidas) ? $variable : 'fecha_emision';
        $orden = in_array(strtolower($orden), ['asc', 'desc']) ? $orden : 'asc';



        $query = DB::table('resolutions as r')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->select('r.id', 'r.nro_resolucion', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala');


        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipoJurisprudencia = $request->tipo_jurisprudencia;
            $materia = $request->materia;

            $subquery = DB::table('jurisprudencias')
                ->select('resolution_id');

            if ($request->has('tipo_jurisprudencia')) {
                $subquery->whereIn('tipo_jurisprudencia_id', $tipoJurisprudencia);
            }

            if ($request->has('materia')) {
                $subquery->whereIn('root_id', $materia);
            }

            $query->joinSub($subquery, 'j', function ($join) {
                $join->on('j.resolution_id', '=', 'r.id');
            });
        }


        if ($request->has('periodo')) {
            $query->whereYear('r.fecha_emision',  $request->periodo);
        }

        if ($request->has('magistrado')) {
            $query->whereIn("r.magistrado_id", $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->whereIn("r.forma_resolucion_id", $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->whereIn("r.tipo_resolucion_id", $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->whereIn("r.sala_id", $request->sala);
        }
        if ($request->has('departamento')) {
            $query->whereIn("r.departamento_id", $request->departamento);
        }

        $search = $request->input('term');
        $search = preg_replace('/\s+/', ' ', $search);
        $search = trim($search);
        $search = strtolower($search);
        $stopwords = NLP::getStopWords();


        if ($request->has('term') && in_array($search, $stopwords) === false) {



            $searchSanitized = addslashes($search);

            $query->join('contents as c', 'c.resolution_id', '=', 'r.id')
                ->addSelect(DB::raw("
                    resolution_id,
                    ts_headline('spanish', contenido, plainto_tsquery('spanish', '{$searchSanitized}')) as contexto
                "))->whereRaw('searchtext @@ plainto_tsquery(\'spanish\', ?)', [$search]);
        }


        $results = $query->orderBy($variable, $orden)->paginate(20);

        return response()->json($results);
    }


    public function buscarResolucionesTSJ(Request $request)
    {

        $user = Auth::user();

        if (!$user) { // Verifica si el usuario no está autenticado
            return response()->json(['mensaje' => "El usuario no está autenticado"], 403);
        }

        if (!$user->hasPermissionTo('web_scrapping')) {
            return response()->json(['mensaje' => "El usuario no cuenta con el permiso necesario"], 403);
        }


        if (DB::table('jobs')->where('payload', 'like', '%WebScrappingJob%')->exists()) {
            return response()->json(['message' => 'El Web Scraping ya se está ejecutando.'], 409);
        }

        $httpClient = HttpClient::create([
            'verify_peer' => false,
            'verify_host' => false,
            'timeout' => 10,
        ]);

        $lastId = Mapeos::max('external_id');
        $errorCount = 0;
        $maxErrors = 10;
        $iterations = 10;
        $counts = 0;
        $ultimaRes = $lastId;
        $maxRequests = 25; // Límite de intentos
        $requestCount = 0;

        while ($requestCount < $maxRequests) {
            if ($errorCount > $maxErrors) {
                Log::warning("Demasiados errores consecutivos. Deteniendo proceso.");
                break;
            }

            try {
                $i = $iterations + $lastId;
                usleep(random_int(500000, 2000000));

                $response = $httpClient->request('GET', "https://jurisprudencia.tsj.bo/jurisprudencia/$i");

                if ($response->getStatusCode() !== 200) {
                    throw new \Exception("Error HTTP " . $response->getStatusCode());
                }

                $data = $response->toArray();
                if (!empty($data['resolucion'])) {
                    $counts++;
                    $ultimaRes = $i;
                    $iterations += 20;
                    $errorCount = 0; // Reiniciar contador de errores
                } else {
                    $errorCount++;
                    $iterations += ($errorCount >= 3) ? 50 : 20;
                }
            } catch (TransportExceptionInterface | ClientExceptionInterface | ServerExceptionInterface | \Exception $e) {
                Log::error("Error al procesar ID $i: " . $e->getMessage());
                $errorCount++;

                if ($errorCount > $maxErrors) {
                    Log::error("Se alcanzó el número máximo de errores. Proceso detenido.");
                    break;
                }
            }

            $requestCount++;
        }

        if ($counts > 0) {
            return response()->json([
                'message' => 'Se han encontrado nuevas resoluciones.',
                'cantidad' => $ultimaRes - $lastId,
            ]);
        } else {
            return response()->json(['message' => 'No existen nuevas resoluciones.'], 409);
        }
    }



    public function obtenerResolucionesTSJ(Request $request)
    {
        validator($request->all(), [
            'iterations' => 'required|integer|max:1000',
        ])->validate();


        $user = Auth::user();

        if (!$user) { // Verifica si el usuario no está autenticado
            return response()->json(['mensaje' => "El usuario no está autenticado"], 403);
        }

        if (!$user->hasPermissionTo('web_scrapping')) {
            return response()->json(['mensaje' => "El usuario no cuenta con el permiso necesario"], 403);
        }


        $isRunning = DB::table('jobs')->where('payload', 'like', '%WebScrappingJob%')->exists();

        if ($isRunning) {
            return response()->json(['message' => 'El Web Scraping ya se está ejecutando.'], 409);
        }

        $iterations = $request->input('iterations', 100);
        $lastId = Mapeos::max('external_id') + 1;

        $userId = $user->id;
        Log::info("Búsqueda iniciada");
        WebScrappingJob::dispatch($iterations, $lastId, $userId);

        return response()->json(['message' => 'Web Scraping iniciado.']);
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





    public function show($id): JsonResponse
    {


        try {

            $resolution = DB::table('contents as c')
                ->join('resolutions as r', 'r.id', '=', 'c.resolution_id')
                ->leftJoin('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
                ->leftJoin('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
                ->leftJoin('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->leftJoin('magistrados as m', 'm.id', '=', 'r.magistrado_id')
                ->select(

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
                    'c.contenido',
                )
                ->where('r.id', '=', $id)
                ->first();
            $jurisprudencias = DB::table('jurisprudencias as j')
                ->leftJoin('restrictors as rt', 'rt.id', '=', 'j.restrictor_id')
                ->leftJoin('tipo_jurisprudencias as tj', 'tj.id', '=', 'j.tipo_jurisprudencia_id')->select(

                    'j.ratio',
                    'j.descriptor',
                    "tj.nombre as tipo_jurisprudencia",
                    'rt.nombre as restrictor'

                )->where('resolution_id', $id)->get();





            return response()->json([

                'resolucion' => $resolution,
                'jurisprudencias' => $jurisprudencias,
            ], 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Resolución no encontrada'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener la resolución' . $e
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
        $salas = Sala::all();

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
            $mi_sala = Sala::where("nombre", $sala)->first();
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
            'multiVariable' => false
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

            'data' => $this->ordenarArrayXY($combinations, $columnaX, $columnaY),
            'tabla' => $request->tablaX,
            'columna' => $request->columnaX,
            'nombre' => $request->columnaY,
            'terminos' => $request->terminosX,
            'multiVariable' => true
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

        $lista = ['tipo_resolucion', 'departamento', 'sala', 'magistrado', 'forma_resolucion', 'tipo_jurisprudencia'];

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


        $filteredData = array_filter($resultado, function ($item) use ($variableY) {
            foreach ($item as $key => $value) {
                if ($key !== $variableY && (int)$value !== 0) {
                    return true;
                }
            }
            return false;
        });


        return $filteredData;
    }
}
