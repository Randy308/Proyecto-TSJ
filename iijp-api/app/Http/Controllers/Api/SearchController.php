<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Utils\NLP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;

class SearchController extends Controller
{
    //
    public function test(Request $request)
    {
        $request->validate([
            'search' => 'required|string|max:100',
        ]);
        $query = $request->input('search', '');

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
            ]
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
                'errors' => $validator->errors()
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

        return $pdf->Output('document.pdf', 'I');
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



        $query = $request->input('term', '');
        $highlight = $request->input('highlight', ['sintesis']);

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo','magistrado','forma_resolucion'];

        $search = Resolutions::search($query, function ($meilisearch, $query, $options) use ($highlight, $perPage, $offset, $facetas) {
            $options['attributesToHighlight'] = $highlight;
            $options['attributesToCrop'] = $highlight;
            $options['cropLength'] = 50;
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
                'departamento',
                'magistrado',
                'tipo_resolucion',
                'forma_resolucion',
                'periodo',
                '_formatted',
            ];
            $options['facets'] = $facetas;

            return $meilisearch->search($query, $options);
        });
    
        if ($request->has('periodo')) {
            $search->where('periodo', $request->periodo[0]);
        }

        if ($request->has('tipo_resolucion')) {
            $search->whereIn("tipo_resolucion", $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $search->whereIn("sala", $request->sala);
        }
        if ($request->has('departamento')) {
            $search->whereIn("departamento", $request->departamento);
        }

        if ($request->has('magistrado')) {
            $search->whereIn("magistrado", $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $search->whereIn("forma_resolucion", $request->forma_resolucion);
        }

        $search = $search->raw();

        // Solo los _formatted
        $formattedResults = collect($search['hits'])->map(function ($hit) {
            return $hit['_formatted'] ?? [];
        });


        $facets = $search['facetDistribution'] ?? [];
        return response()->json($facets);

        $filtros = [];

        foreach ($facetas as $value) {
            if (!isset($facets[$value])) {
                continue;
            }

            $numericalKeys = array_map('intval', array_keys($facets[$value]));

            $filtered = array_filter($numericalKeys, function ($item) {
                return $item !== 0;
            });

            $filtros[$value] = array_values($filtered); // Reindexa
        }


        return response()->json([
            'data' => $formattedResults,
            'facets' => $filtros,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['estimatedTotalHits'] ?? 0,
            'last_page' => ceil(($search['estimatedTotalHits'] ?? 0) / $perPage),

        ]);

        return response()->json($resultados);




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
    public function busquedaTerminos(Request $request)
    {
        $request->validate([
            'busqueda' => 'required|string',
            'materia' => 'nullable|integer',
        ]);


        $query = $request->input('busqueda', '');
        $search = Jurisprudencias::search($query, function ($meilisearch, $query, $options) {
            $options['facets'] = ['descriptor_facet'];
            return $meilisearch->search($query, $options);
        });

        if ($request->has('materia')) {
            $materia = $request->input('materia');
            $search->where('materia', $materia);
        }


        $search = $search->raw();


        $facets = $search['facetDistribution']['descriptor_facet'] ?? [];


        $facets = collect($facets)->map(function ($count, $facet) {
            $parts = explode('||', $facet);
            return [
                'root_id' => $parts[0],
                'descriptor_id' => $parts[1],
                'descriptor' => $parts[2],
                'cantidad' => $count,
            ];
        })->values()->toArray();

        usort($facets, function ($a, $b) {
            return $a['cantidad'] < $b['cantidad'];
        });

        return response()->json($facets);
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


        $query = $request->input('busqueda', '');
        $highlight = $request->input('highlight', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $highlight = ['contenido', 'sintesis', 'precedente', 'maxima', 'proceso'];
        $highlight = ['descriptor', 'ratio', 'restrictor'];
        //$highlight = ['descriptor'];
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo', 'materia', 'magistrado', 'forma_resolucion'];

        $search = Jurisprudencias::search($query, function ($meilisearch, $query, $options) use ($highlight, $perPage, $offset, $facetas) {
            $options['attributesToHighlight'] = $highlight;
            $options['attributesToCrop'] = $highlight;
            $options['cropLength'] = 50;
            $options['highlightPreTag'] = '<b class="highlight">';
            $options['highlightPostTag'] = '</b>';
            $options['limit'] = $perPage;
            $options['offset'] = $offset;
            $options['attributesToSearchOn'] = $highlight;
            $options['facets'] = $facetas;
            $options['attributesToRetrieve'] = [
                'id',
                'resolution_id',
                'tipo_resolucion',
                'nro_resolucion',
                'periodo',
                '_formatted',
            ];

            return $meilisearch->search($query, $options);
        });
        if ($request->has('materia')) {
            $materia = $request->input('materia');
            $search->where('materia', $materia[0]);
        }

        if ($request->has('descriptor')) {
            $descriptor = $request->input('descriptor');
            $search->where('descriptor_id', $descriptor);
        }
        if ($request->has('periodo')) {
            $search->where('periodo', $request->periodo[0]);
        }

        if ($request->has('tipo_resolucion')) {
            $search->whereIn("tipo_resolucion", $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $search->whereIn("sala", $request->sala);
        }
        if ($request->has('departamento')) {
            $search->whereIn("departamento", $request->departamento);
        }
        if ($request->has('magistrado')) {
            $search->whereIn("magistrado", $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $search->whereIn("forma_resolucion", $request->forma_resolucion);
        }

        $search = $search->raw();

        // Solo los _formatted
        $formattedResults = collect($search['hits'])->map(function ($hit) {
            return $hit['_formatted'] ?? [];
        });



        $facets = $search['facetDistribution'] ?? [];



        $filtros = [];

        foreach ($facetas as $value) {
            if (!isset($facets[$value])) {
                continue;
            }

            $numericalKeys = array_map('intval', array_keys($facets[$value]));

            $filtered = array_filter($numericalKeys, function ($item) {
                return $item !== 0;
            });

            $filtros[$value] = array_values($filtered); // Reindexa
        }


        return response()->json([
            'data' => $formattedResults,
            'facets' => $filtros,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['estimatedTotalHits'] ?? 0,
            'last_page' => ceil(($search['estimatedTotalHits'] ?? 0) / $perPage),

        ]);

        return response()->json($resultados);
    }

}
