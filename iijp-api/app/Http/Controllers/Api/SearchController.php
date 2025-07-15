<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FacetaResource;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Utils\NLP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;
use RomanStruk\ManticoreScoutEngine\Mysql\Builder;

class SearchController extends Controller
{
    //
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
        $resultados = Jurisprudencias::search('', function (Builder $builder) use ($secondQuery, $perPage, $offset) {
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

        $highlight[] = $request->input('highlight', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $strategy = $request->input('strategy', 'last');

        if ($strategy != 'all' || $strategy != 'last') {
            $strategy = 'last';
        }
        $search = Resolutions::search($query, function ($meilisearch, $query, $options) use ($highlight, $perPage, $offset, $strategy) {
            $options['attributesToHighlight'] = $highlight;
            $options['attributesToCrop'] = $highlight;
            $options['cropLength'] = 100;
            $options['highlightPreTag'] = '<b class="highlight">';
            $options['highlightPostTag'] = '</b>';
            $options['matchingStrategy'] = $strategy;

            $options['attributesToSearchOn'] = $highlight;
            $options['limit'] = $perPage;
            $options['offset'] = $offset;
            $options['attributesToRetrieve'] = [
                'id',
                'sala',
                'nro_expediente',
                'nro_resolucion',
                'magistrado',
                'tipo_resolucion',
                'forma_resolucion',
                'periodo',
                '_formatted',
            ];

            return $meilisearch->search($query, $options);
        })->raw();

        // Solo los _formatted
        $formattedResults = collect($search['hits'])->map(function ($hit) {
            return $hit['_formatted'] ?? [];
        });

        return response()->json([
            'data' => $formattedResults,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $search['estimatedTotalHits'] ?? 0,
                'last_page' => ceil(($search['estimatedTotalHits'] ?? 0) / $perPage),
            ],
        ]);

        $request->validate([
            'search' => 'required|string|max:100',
        ]);

        $query = $request->input('search');
        $query = preg_replace('/\s+/', ' ', $query);
        $query = trim($query);
        $query = strtolower($query);
        $stopwords = NLP::getStopWords();
        if (in_array($query, $stopwords)) {
            return response()->json([
                'message' => 'La palabra no puede ser una palabra de parada',
            ], 404);
        }

        $results = Resolutions::search($request->search)->where('sala_id', '1')->raw();

        return response()->json($results);

        $search = $request->input('search');
        $search = preg_replace('/\s+/', ' ', $search);
        $search = trim($search);
        $search = strtolower($search);
        $stopwords = NLP::getStopWords();
        if (in_array($search, $stopwords)) {
            return response()->json([
                'message' => 'La palabra no puede ser una palabra de parada',
            ], 404);
        }

        $query = Resolutions::whereHas('content', function ($query) use ($search) {
            $query->whereRaw('searchtext @@ plainto_tsquery(\'spanish\', ?)', [$search]);
        })
            ->with(['content' => function ($query) use ($search) {
                $query->selectRaw(
                    "resolution_id, ts_headline('spanish', contenido, plainto_tsquery('spanish', ?)) as contexto",
                    [$search]
                );
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(10)->toArray();

        return response()->json($query, 200);
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

        $query = $request->input('term', '');
        $highlight = $request->input('highlight', ['contenido']);

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 50);
        $offset = ($page - 1) * $perPage;

        $search = Resolutions::search($query, function ($meilisearch, $query, $options) use ($highlight, $perPage, $offset) {
            $options['attributesToHighlight'] = $highlight;
            $options['attributesToCrop'] = $highlight;
            $options['cropLength'] = 80;
            $options['highlightPreTag'] = '<b class="highlight">';
            $options['highlightPostTag'] = '</b>';
            $options['limit'] = $perPage;
            $options['offset'] = $offset;
            $options['attributesToSearchOn'] = $highlight;
            $options['attributesToRetrieve'] = [
                'id',
                'sala',
                'nro_expediente',
                'nro_resolucion',
                'magistrado',
                'tipo_resolucion',
                'forma_resolucion',
                'periodo',
                '_formatted',
            ];

            return $meilisearch->search($query, $options);
        });
        if ($request->has('ids')) {
            $ids = $request->input('ids');
            $search->whereIn('id', $ids);
        }

        $search = $search->raw();

        // Solo los _formatted
        $formattedResults = collect($search['hits'])->map(function ($hit) {
            return $hit['_formatted'] ?? [];
        });

        $pdf = LaravelMpdf::loadView('resolution', ['results' => $formattedResults], [], [
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

        return $pdf->Output('document.pdf', 'I');
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

        $query = $request->input('term', '');
        $highlight = $request->input('highlight', ['sintesis']);

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id as id', 'sala', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion'];



        $search = Resolutions::search('', function (Builder $builder) use ($query, $perPage, $offset, $request, $highlight, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('@(proceso,sintesis) $query')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')
                ->facet('tipo_resolucion')
                ->facet('periodo')->facet('mes')
                ->facet('magistrado')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

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
            return $builder;
        })->raw();

        $facetas = $search['facets'] ?? [];

        foreach ($facetas as $nombre => $facetGroup) {
            $facetas[$nombre] = FacetaResource::collection(collect($facetGroup));
        }



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

    public function busquedaTerminos(Request $request)
    {
        $request->validate([
            'busqueda' => 'required|string',
            'materia' => 'nullable|integer',
        ]);


        $query = $request->input('busqueda', 'derecho');
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
        $perPage = (int) $request->input('per_page', 5);
        $offset = ($page - 1) * $perPage;
        $select = ['resolution_id', 'jurisprudencia_id as id'];



        $search = Jurisprudencias::search('', function (Builder $builder) use ($query, $perPage, $offset, $request, $highlight, $select) {


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
                $facetas[] =  [
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
            'descriptor' => 'nullable|integer',
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
        $select = ['resolution_id', 'jurisprudencia_id as id', 'nro_resolucion', 'sala', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion', 'ratio', 'descriptor', 'restrictor'];



        $search = Jurisprudencias::search('', function (Builder $builder) use ($query, $perPage, $offset, $request, $highlight, $select) {


            $builder->selectRaw(implode(",", $select))->whereRaw("MATCH('@(ratio,restrictor,descriptor) $query')")
                ->highlight(['before_match' => '<b>', 'after_match' => '</b>'])
                ->facet('sala')->groupBy('resolution_id')
                ->facet('departamento')
                ->facet('tipo_resolucion')
                ->facet('periodo')
                ->facet('magistrado')
                ->facet('materia')
                ->facet('forma_resolucion')->take($perPage)
                ->offset($offset);

            if ($request->has('materia')) {
                $list = implode(',', $request->materia);
                $builder->whereRaw("materia IN ($list)");
            }

            if ($request->has('descriptor')) {
                $item = intval( $request->descriptor);
                $builder->whereRaw("descriptor_id = $item");
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
            return $builder;
        })->raw();

        $facetas = $search['facets'] ?? [];

        foreach ($facetas as $nombre => $facetGroup) {
            $facetas[$nombre] = FacetaResource::collection(collect($facetGroup));
        }

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
