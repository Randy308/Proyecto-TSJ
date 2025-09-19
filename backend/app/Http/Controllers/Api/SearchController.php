<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FacetaResource;
use App\Http\Resources\ResolutionResource;
use App\Models\Departamento;
use App\Models\Jurisprudencia;
use App\Models\Resolution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;
use RomanStruk\ManticoreScoutEngine\Mysql\Builder;
use Symfony\Component\HttpFoundation\Response;

class SearchController extends Controller
{
    //

    function buscarSerieTemporal(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'busqueda' => 'required|string',
            'campo' => 'required|string',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }



        $busqueda = $request->input('busqueda');
        $campo = $request->input('campo');


        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 2);
        $select = ['resolution_id as id',];



        $search = Resolution::search('', function (Builder $builder) use ($campo, $busqueda, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('@$campo $busqueda')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->groupBy('resolution_id')->take(1)
                ->facet('departamento')
                ->facet('periodo', null, 30)->facet('mes')
                ->facet('fecha_emision', null, 1000);

            return $builder;
        })->raw();

        $facetas = $search['facets'] ?? [];

        foreach ($facetas as $nombre => $facetGroup) {
            $facetas[$nombre] = FacetaResource::collection(collect($facetGroup));
        }


        $departamentos = $facetas['departamento'] ?? [];
        $periodos = $facetas['periodo'] ?? [];

        $all = Departamento::all()->pluck('id')->toArray();
        $departamentos = collect($departamentos)->map(function ($item) use ($all) {
            $id = $item['key'];
            $nombre = Departamento::find($id)->nombre ?? 'Desconocido';
            return [
                'id' => $id,
                'nombre' => $nombre,
                'cantidad' => $item['count'],
            ];
        })->sortByDesc('cantidad')->values()->toArray();

        $periodos = collect($periodos)->map(function ($item) {
            return [
                'periodo' => $item['key'],
                'cantidad' => $item['count'],
            ];
        })->sortBy('periodo')->values()->toArray();

        //return response()->json($search, 200);
        return response()->json([
            'departamentos' => $departamentos,
            'periodos' => array_values($periodos),
        ]);
    }
    function buildManticoreMatch(array $filters): string
    {
        $matchParts = [];
        $first = true;

        foreach ($filters as $filter) {
            $field = $filter['field'];
            $value = trim($filter['value']);
            $operator = strtoupper($filter['operator']);

            // Escapar caracteres especiales si es necesario
            $escapedValue = str_replace(['\\', '(', ')', '|', '-', '&', '!', '@'], ' ', $value);

            $part = "@$field $escapedValue";

            if ($operator === 'NOT') {
                $part = "-$part";
            }

            if (!$first) {
                if ($operator === 'AND') {
                    $part = "& $part";
                } elseif ($operator === 'OR') {
                    $part = "| $part";
                } // NOT ya incluye el `-`, no necesita operador adicional
            }

            $matchParts[] = $part;
            $first = false;
        }

        return implode(' ', $matchParts);
    }


    public function buscarJurisprudenciaAvanzado(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'filtros' => 'required|array',
            'filtros.*.field' => 'required|string|in:contenido,descriptor,sintesis,precedente,maxima,proceso,ratio,descriptor,restrictor',
            'filtros.*.value' => 'required|string',
            'filtros.*.operator' => 'required|string|in:AND,OR,NOT',
            'serie' => 'string',
            'page' => 'integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        $matchString = $this->buildManticoreMatch($request->input('filtros', []));


        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id', 'jurisprudencia_id as id', 'nro_resolucion', 'sala', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion', 'maxima', 'descriptor', 'restrictor'];

        if ($request->has('tipo_decision')) {
            $select[] = "tipo_decision";
        }

        if ($request->has('proceso')) {
            $select[] = "proceso_facet as proceso";
        }

        $search = Jurisprudencia::search('', function (Builder $builder) use ($matchString, $perPage, $offset, $request, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('$matchString')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')->facet('materia')
                ->facet('tipo_resolucion')->facet('tipo_decision')
                ->facet('periodo')->facet('mes')->facet('proceso_facet')->facet('restrictor_facet')->facet('materia_facet')
                ->facet('magistrado')->facet('tipo_jurisprudencia')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

            if ($request->has('periodo')) {
                $list = implode(',', $request->periodo);
                $builder->whereRaw("periodo IN ($list)");
            }
            if ($request->has('materia')) {
                $list = implode(',', $request->materia);
                $builder->whereRaw("materia IN ($list)");
            }

            if ($request->has('descriptor')) {
                $builder->whereIn("materia_facet", $request->descriptor);
            }

            if ($request->has('proceso')) {
                $builder->whereIn("proceso_facet", $request->proceso);
            }
            if ($request->has('restrictor')) {
                $builder->whereIn("restrictor_facet", $request->restrictor);
            }


            if ($request->has('tipo_resolucion')) {
                $list = implode(',', $request->tipo_resolucion);
                $builder->whereRaw("tipo_resolucion IN ($list)");
            }
            if ($request->has('sala')) {
                $list = implode(',', $request->sala);
                $builder->whereRaw("sala IN ($list)");
            }
            if ($request->has('departamento')) {
                $list = implode(',', $request->departamento);
                $builder->whereRaw("departamento IN ($list)");
            }

            if ($request->has('magistrado')) {
                $list = implode(',', $request->magistrado);
                $builder->whereRaw("magistrado IN ($list)");
            }
            if ($request->has('forma_resolucion')) {
                $list = implode(',', $request->forma_resolucion);
                $builder->whereRaw("forma_resolucion IN ($list)");
            }
            if ($request->has("tipo_decision")) {
                $list = implode(',', $request->tipo_decision);
                $builder->whereRaw("tipo_decision IN ($list)");
            }
            return $builder;
        })->raw();



        $facetas = $search['facets'] ?? [];

        // Convertir todos los grupos a colecciones de FacetaResource
        $facetas = collect($facetas)->map(fn($group) => FacetaResource::collection(collect($group)))->toArray();

        // Extraer facetas especiales y crear facetas_textos
        $facetas_textos = [
            'descriptor' => $facetas['materia_facet'] ?? null,
            'restrictor' => $facetas['restrictor_facet'] ?? null,
            'proceso'    => $facetas['proceso_facet'] ?? null,
        ];

        // Remover claves que ya usamos y fusionar con facetas_textos
        $facetas = array_diff_key($facetas, array_flip(['materia_facet', 'restrictor_facet', 'proceso_facet'])) + $facetas_textos;

        //return response()->json($search, 200);
        return response()->json([
            'data' => $search['hits'] ?? [],
            'facets' => $facetas,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['meta']['total_found'] ?? 0,
            'last_page' => ceil(($search['meta']['total_found'] ?? 0) / $perPage),

        ]);
    }
    public function buscarResolucionesAvanzado(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'filtros' => 'required|array',
            'filtros.*.field' => 'required|string|in:contenido,descriptor,sintesis,precedente,maxima,proceso',
            'filtros.*.value' => 'required|string',
            'filtros.*.operator' => 'required|string|in:AND,OR,NOT',
            'serie' => 'string',
            'page' => 'integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        $matchString = $this->buildManticoreMatch($request->input('filtros', []));


        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id as id', 'sala', 'nro_resolucion', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion'];



        if ($request->has('tipo_decision')) {
            $select[] = "tipo_decision";
        }


        if ($request->has('proceso')) {
            $select[] = "proceso_facet as proceso";
        }

        $search = Resolution::search('', function (Builder $builder) use ($matchString, $perPage, $offset, $request, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('$matchString')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')
                ->facet('tipo_resolucion')
                ->facet('periodo')->facet('proceso_facet')->facet('tipo_decision')
                ->facet('magistrado')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

            if ($request->has('periodo')) {
                $list = implode(',', $request->periodo);
                $builder->whereRaw("periodo IN ($list)");
            }

            if ($request->has('proceso')) {
                $builder->whereIn("proceso_facet", $request->proceso);
            }

            if ($request->has('tipo_resolucion')) {
                $list = implode(',', $request->tipo_resolucion);
                $builder->whereRaw("tipo_resolucion IN ($list)");
            }
            if ($request->has('sala')) {
                $list = implode(',', $request->sala);
                $builder->whereRaw("sala IN ($list)");
            }
            if ($request->has('departamento')) {
                $list = implode(',', $request->departamento);
                $builder->whereRaw("departamento IN ($list)");
            }

            if ($request->has('magistrado')) {
                $list = implode(',', $request->magistrado);
                $builder->whereRaw("magistrado IN ($list)");
            }
            if ($request->has('forma_resolucion')) {
                $list = implode(',', $request->forma_resolucion);
                $builder->whereRaw("forma_resolucion IN ($list)");
            }
            return $builder;
        })->raw();


        $facetas = $search['facets'] ?? [];

        // Convertir todos los grupos a colecciones de FacetaResource
        $facetas = collect($facetas)->map(fn($group) => FacetaResource::collection(collect($group)))->toArray();

        // Extraer facetas especiales y crear facetas_textos
        $facetas_textos = [
            'proceso'    => $facetas['proceso_facet'] ?? null,
        ];

        // Remover claves que ya usamos y fusionar con facetas_textos
        $facetas = array_diff_key($facetas, array_flip(['proceso_facet'])) + $facetas_textos;


        //return response()->json($search, 200);
        return response()->json([
            'data' => $search['hits'] ?? [],
            'facets' => $facetas,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['meta']['total_found'] ?? 0,
            'last_page' => ceil(($search['meta']['total_found'] ?? 0) / $perPage),

        ]);
    }
    public function test(Request $request)
    {
        $request->validate([
            'search' => 'required|string|max:100',
            'second_search' => 'required|string|max:100',
        ]);
        $query = $request->input('search', '');
        $secondQuery = $request->input('second_search', '');

        // $products = Jurisprudencias::search($query)->raw(); MATCH('@(descriptor,ratio) "Proceso"')
        // excepto Match('@!(descriptor) "Proceso"')
        // and & or | not -

        $page = request()->get('page', 1);           // Página actual (default: 1)
        $perPage = 30;                                // Cantidad por página
        $offset = ($page - 1) * $perPage;

        $select = [
            'id',
            'resolution_id',
            'tipo_resolucion',
            'nro_resolucion',
            'periodo',
            'ratio',
            'descriptor',

        ];

        // ->whereRaw("MATCH('@ratio {$secondQuery} | @descriptor {$query}')")
        $resultados = Jurisprudencia::search('', function (Builder $builder) use ($secondQuery, $perPage, $offset) {
            $builder->whereRaw("MATCH('@(proceso,restrictor) {$secondQuery}')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->whereIn('tipo_resolucion', [1])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')
                ->facet('tipo_resolucion')
                ->facet('periodo')->facet('descriptor_facet')
                ->facet('magistrado')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

            return $builder;
        })->raw();

        return response()->json($resultados, 200);
    }

    public function obtenerResolucionesIds(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|distinct',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $ids = $request['ids'];


        $query = DB::table(DB::raw('resolutions r FULL OUTER JOIN jurisprudencias j ON r.id = j.resolution_id'))
            ->join('mapeos as m', 'm.resolution_id', '=', 'r.id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->select(
                'r.id',
                'r.sintesis',
                'r.maxima',
                'r.precedente',
                'j.ratio',
                'j.descriptor',
                'j.restrictor',
                'r.nro_resolucion',
                'tr.nombre as tipo_resolucion',
                'r.proceso',
                'fr.nombre as forma_resolucion',
                'r.fecha_emision',
                'm.external_id'
            )
            ->whereIn('r.id', $ids);

        $resolutions = $query->orderBy('tipo_resolucion')->get();

        foreach ($resolutions as $resolution) {

            $variables = explode('/', $resolution->nro_resolucion, 2);
            $resolution->titulo = $resolution->tipo_resolucion . " " . ltrim($variables[1], '0') ?? $resolution->nro_resolucion;
        }
        //return response()->json($resolutions, 200);
        $pdf = LaravelMpdf::loadView('resolution', ['results' => $resolutions], [], [
            'format' => 'letter',
            'margin_left' => 25,  // 2.5 cm in mm
            'margin_right' => 25,  // 2.5 cm in mm
            'margin_top' => 25,  // 2.5 cm in mm
            'margin_bottom' => 25,  // 2.5 cm in mm
            'orientation' => 'P',
            'title' => 'Documento',
            'author' => 'IIJP',
            'custom_font_dir' => public_path('fonts/'),
            'custom_font_data' => [
                'cambria' => [
                    'R' => 'Cambriax.ttf',
                    'B' => 'Cambria-Bold.ttf',
                    'I' => 'Cambria-Italic.ttf',
                    'BI' => 'Cambria-Bold-Italic.ttf',
                ],
                'trebuchet_ms' => [
                    'R' => 'trebuc.ttf',
                    'B' => 'trebucbd.ttf',
                    'I' => 'trebucit.ttf',
                ],
                'times_new_roman' => [
                    'R' => 'times-new-roman.ttf',
                    'B' => 'times-new-roman-bold.ttf',
                    'I' => 'times-new-roman-italic.ttf',
                    'BI' => 'times-new-roman-bold-italic.ttf',
                ],
            ],
        ]);

        return $pdf->Output();
    }

    public function filtrarAutosSupremos(Request $request)
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
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = $request->input('busqueda', '');
        $highlight = $request->input('campo', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id as id', 'sala', 'nro_resolucion', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion'];

        if ($request->has('tipo_decision')) {
            $select[] = "tipo_decision";
        }


        if ($request->has('proceso')) {
            $select[] = "proceso_facet as proceso";
        }


        $search = Resolution::search('', function (Builder $builder) use ($query, $perPage, $offset, $request, $select, $highlight) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('@$highlight $query')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')
                ->facet('tipo_resolucion')->facet('proceso_facet')->facet('tipo_decision')
                ->facet('periodo')->facet('mes')
                ->facet('magistrado')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

            if ($request->has('periodo')) {
                $list = implode(',', $request->periodo);
                $builder->whereRaw("periodo IN ($list)");
            }
            if ($request->has('proceso')) {
                $builder->whereIn("proceso_facet", $request->proceso);
            }


            if ($request->has('tipo_resolucion')) {
                $list = implode(',', $request->tipo_resolucion);
                $builder->whereRaw("tipo_resolucion IN ($list)");
            }
            if ($request->has('sala')) {
                $list = implode(',', $request->sala);
                $builder->whereRaw("sala IN ($list)");
            }
            if ($request->has('departamento')) {
                $list = implode(',', $request->departamento);
                $builder->whereRaw("departamento IN ($list)");
            }

            if ($request->has('magistrado')) {
                $list = implode(',', $request->magistrado);
                $builder->whereRaw("magistrado IN ($list)");
            }
            if ($request->has('forma_resolucion')) {
                $list = implode(',', $request->forma_resolucion);
                $builder->whereRaw("forma_resolucion IN ($list)");
            }

            if ($request->has('tipo_decision')) {
                $list = implode(',', $request->tipo_decision);
                $builder->whereRaw("tipo_decision IN ($list)");
            }


            return $builder;
        })->raw();
        $facetas = $search['facets'] ?? [];

        // Convertir todos los grupos a colecciones de FacetaResource
        $facetas = collect($facetas)->map(fn($group) => FacetaResource::collection(collect($group)))->toArray();

        // Extraer facetas especiales y crear facetas_textos
        $facetas_textos = [
            'proceso'    => $facetas['proceso_facet'] ?? null,
        ];

        // Remover claves que ya usamos y fusionar con facetas_textos
        $facetas = array_diff_key($facetas, array_flip(['proceso_facet'])) + $facetas_textos;

        //return response()->json($search, 200);
        return response()->json([
            'data' => $search['hits'] ?? [],
            'facets' => $facetas,
            'facetas' => $facetas_textos,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['meta']['total_found'] ?? 0,
            'last_page' => ceil(($search['meta']['total_found'] ?? 0) / $perPage),

        ]);
    }

    public function busquedaTerminos(Request $request)
    {
        $request->validate([
            'busqueda' => 'required|string',
            'materia' => 'nullable|integer',
        ]);
        $query = $request->input('busqueda', 'derecho');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        // $highlight = ['descriptor'];
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo', 'materia', 'magistrado', 'forma_resolucion'];

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 5);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id', 'jurisprudencia_id as id'];



        $search = Jurisprudencia::search('', function (Builder $builder) use ($query, $perPage, $offset, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('@descriptor $query')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('descriptor_facet')->groupBy('resolution_id')->take($perPage)
                ->offset($offset);
            return $builder;
        })->raw();

        $facets = $search['facets']['descriptor_facet'] ?? [];
        $facetas = [];

        foreach ($facets as $value) {
            $parts = explode('||', $value['key']);
            if (count($parts) === 3) {
                $facetas[] = [
                    'root_id' => intval($parts[0]),
                    'descriptor_id' => intval($parts[1]),
                    'descriptor' => $parts[2],
                    'cantidad' => intval($value['count']),
                ];
            }
        }


        usort($facetas, function ($a, $b) {
            return $a['cantidad'] < $b['cantidad'];
        });

        return response()->json($facetas);
    }

    public function obtenerResolucionesCronologia(Request $request)
    {

        $request->validate([
            'busqueda' => 'nullable|string',
            'materia' => 'nullable|array',
            'materia.*' => 'required|integer',
            'descriptor' => 'nullable|array',
            'descriptor.*' => 'required|string',
            'restrictor' => 'nullable|array',
            'restrictor.*' => 'required|string',
            'proceso' => 'nullable|array',
            'proceso.*' => 'required|string',
            'periodo' => 'nullable|array',
            'tipo_resolucion' => 'nullable|array',
            'sala' => 'nullable|array',
            'departamento' => 'nullable|array',
            'periodo.*' => 'required|integer',
            'tipo_resolucion.*' => 'required|integer',
            'sala.*' => 'required|integer',
            'departamento.*' => 'required|integer',
        ]);

        $query = $request->input('busqueda', 'derecho');
        $campo = $request->input('campo', default: 'ratio');


        $highlight = $request->input('highlight', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $highlight = ['contenido', 'sintesis', 'precedente', 'maxima', 'proceso'];
        $highlight = ['descriptor', 'ratio', 'restrictor'];
        // $highlight = ['descriptor'];
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo', 'materia', 'magistrado', 'forma_resolucion'];

        $highlight = $request->input('highlight', ['sintesis']);

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id', 'jurisprudencia_id as id', 'nro_resolucion', 'sala', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion', 'descriptor', 'restrictor'];


        if ($request->has('tipo_decision')) {
            $select[] = "tipo_decision";
        }


        if ($request->has('proceso')) {
            $select[] = "proceso_facet as proceso";
        }


        $search = Jurisprudencia::search('', function (Builder $builder) use ($query, $campo, $perPage, $offset, $request, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('@$campo $query')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')
                ->facet('tipo_resolucion')
                ->facet('periodo')->facet('tipo_decision')
                ->facet('magistrado')->facet('proceso_facet')->facet('restrictor_facet')->facet('materia_facet')
                ->facet('materia')->facet('tipo_jurisprudencia')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

            if ($request->has('materia')) {
                $list = implode(',', $request->materia);
                $builder->whereRaw("materia IN ($list)");
            }

            if ($request->has('descriptor')) {
                $builder->whereIn("materia_facet", $request->descriptor);
            }

            if ($request->has('proceso')) {
                $builder->whereIn("proceso_facet", $request->proceso);
            }
            if ($request->has('restrictor')) {
                $builder->whereIn("restrictor_facet", $request->restrictor);
            }

            if ($request->has('periodo')) {
                $list = implode(',', $request->periodo);
                $builder->whereRaw("periodo IN ($list)");
            }

            if ($request->has('tipo_resolucion')) {
                $list = implode(',', $request->tipo_resolucion);
                $builder->whereRaw("tipo_resolucion IN ($list)");
            }
            if ($request->has('sala')) {
                $list = implode(',', $request->sala);
                $builder->whereRaw("sala IN ($list)");
            }
            if ($request->has('departamento')) {
                $list = implode(',', $request->departamento);
                $builder->whereRaw("departamento IN ($list)");
            }

            if ($request->has('magistrado')) {
                $list = implode(',', $request->magistrado);
                $builder->whereRaw("magistrado IN ($list)");
            }
            if ($request->has('forma_resolucion')) {
                $list = implode(',', $request->forma_resolucion);
                $builder->whereRaw("forma_resolucion IN ($list)");
            }

            if ($request->has("tipo_decision")) {
                $list = implode(',', $request->tipo_decision);
                $builder->whereRaw("tipo_decision IN ($list)");
            }

            return $builder;
        })->raw();

        $facetas = $search['facets'] ?? [];

        // Convertir todos los grupos a colecciones de FacetaResource
        $facetas = collect($facetas)->map(fn($group) => FacetaResource::collection(collect($group)))->toArray();

        // Extraer facetas especiales y crear facetas_textos
        $facetas_textos = [
            'descriptor' => $facetas['materia_facet'] ?? null,
            'restrictor' => $facetas['restrictor_facet'] ?? null,
            'proceso'    => $facetas['proceso_facet'] ?? null,
        ];

        // Remover claves que ya usamos y fusionar con facetas_textos
        $facetas = array_diff_key($facetas, array_flip(['materia_facet', 'restrictor_facet', 'proceso_facet'])) + $facetas_textos;


        //return response()->json($search, 200);
        return response()->json([
            'data' => $search['hits'] ?? [],
            'facets' => $facetas,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['meta']['total_found'] ?? 0,
            'last_page' => ceil(($search['meta']['total_found'] ?? 0) / $perPage),

        ]);
    }
}
