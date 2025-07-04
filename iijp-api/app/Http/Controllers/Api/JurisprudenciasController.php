<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Descriptor;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Models\Tema;
use App\Utils\Listas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Utils\NLP;
use Illuminate\Support\Facades\Validator;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;

class JurisprudenciasController extends Controller
{
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
        $highlight = $request->input('highlight', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 50);
        $offset = ($page - 1) * $perPage;
        $highlight = ['contenido', 'demandante', 'demandado', 'proceso', 'sintesis', 'maxima', 'precedente'];

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

    public function buscarSerieTemporal(Request $request)
    {
        $request->validate([
            'campo' => 'required|string|in:maxima,sintesis,restrictor,ratio,precedente,proceso,demandante,demandado',
            'busqueda' => 'required|string',
        ]);


        $busqueda = $request->input('busqueda');
        $campo = $request->input('campo');

        $stopwords = NLP::getStopwords();
        if (in_array($busqueda, $stopwords)) {
            return response()->json("Ingrese terminos de busqueda no stopwords", 422);
        }

        $lista = ["restrictor", "ratio"];

        if (!in_array($campo, $lista)) {
            $query = Resolutions::select(
                DB::raw("DATE_TRUNC('year', fecha_emision)::date AS periodo"),
                DB::raw('COUNT(*) as cantidad'),
            )
                ->where($campo, 'ilike', '%' . $busqueda . '%')
                ->groupBy(DB::raw("DATE_TRUNC('year', fecha_emision)::date"))
                ->orderBy(DB::raw("DATE_TRUNC('year', fecha_emision)::date"))
                ->get();
        } else {
            $query = Jurisprudencias::join('resolutions as r', 'jurisprudencias.resolution_id', '=', 'r.id')
                ->select(
                    DB::raw("DATE_TRUNC('year', r.fecha_emision)::date AS periodo"),
                    DB::raw('COUNT(DISTINCT(r.id)) as cantidad'),
                )
                ->where($campo, 'ilike', '%' . $busqueda . '%')
                ->groupBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)::date"))
                ->orderBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)::date"))
                ->get();
        }



        $result = $query->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();


        return response()->json([
            'termino' => [
                'name' => "termino_" . $busqueda,
                'id' => $busqueda,
                'value' => ucfirst($busqueda),
                "detalles" => $campo,
            ],
            'resoluciones' => [
                'name' => ucfirst($busqueda),
                'type' => 'line',
                'id' => $busqueda,
                'data' => $result
            ],
            'departamentos' => $campo
        ]);

        return response()->json($result);
    }
    public function actualizarNodo(Request $request)
    {
        $busqueda = $request->input('busqueda');
        $myArray = explode(' / ', $busqueda);
        $nodos = [];

        foreach ($myArray as $key => $value) {
            if ($key === 0) {
                $query = Descriptor::where('nombre', $value)->first();
                if ($query) {
                    $nodos[] = ['id' => $query->id, 'nombre' => $query->nombre];
                }
            } else {
                $last = end($nodos);
                $query = Descriptor::where('nombre', $value)->where('descriptor_id', $last['id'])->first();
                if ($query) {
                    $nodos[] = ['id' => $query->id, 'nombre' => $query->nombre];
                }
            }
        }
        $last = end($nodos);


        return response()->json([
            'nodos' => $nodos,
            'last' => $last['id'],
        ], 200);
    }

    public function search(Request $request)
    {

        $request->validate([
            'busqueda' => 'required|string',
            'descriptor' => 'nullable|string',
        ]);


        $stopwords = NLP::getStopwords();


        $busqueda = $request->input('busqueda');
        $descriptor = $request->input('descriptor');

        if (in_array($busqueda, $stopwords)) {
            return response()->json("Ingrese terminos de busqueda no stopwords", 422);
        }
        $query = DB::table('jurisprudencias as j')
            ->select(
                'j.descriptor',
                'j.root_id',
                'j.restrictor',
                DB::raw('COUNT(j.resolution_id) as cantidad'),
            )
            ->groupBy('j.descriptor');


        if (!empty($descriptor)) {
            $descriptor = $descriptor . ' / ';
            $query->where('j.descriptor', 'ilike', $descriptor . '%' . $busqueda);
        } else {

            $query->whereRaw("? % j.restrictor or ? % j.descriptor",  [$busqueda, $busqueda]);
        }
        $resultados = $query->orderByDesc('cantidad')->get();

        if ($resultados->isEmpty()) {
            return response()->json(['mensaje' => "No se encontraron resultados"], 404);
        }
        // foreach ($resultados as &$item) {
        //     $item->ids = array_map('intval', explode(',', trim($item->ids, '{}')));
        // }

        return response()->json($resultados);
    }

    public function buscarDescriptor(Request $request)
    {
        $request->validate([
            'busqueda' => 'required|string',
            'descriptor' => 'nullable|string',
        ]);

        $busqueda = $request->input('busqueda');
        $descriptor = $request->input('descriptor');

        $query = DB::table('jurisprudencias as j')->select(
            'j.descriptor',
            DB::raw('COUNT(j.resolution_id) as cantidad')
        )->groupBy('j.descriptor');

        if (!empty($descriptor)) {
            $descriptor = $descriptor . ' / ';
            $query->where('j.descriptor', 'ilike', $descriptor . '%' . $busqueda . '%');
        } else {
            $query->where('j.descriptor', 'ilike', '%' . $busqueda . '%');
        }

        $resultados = $query
            ->havingRaw('COUNT(j.resolution_id) > ?', [7])
            ->orderByDesc('cantidad')
            ->get();

        if ($resultados->isEmpty()) {
            return response()->json(['mensaje' => "No se encontraron resultados"], 404);
        }

        return response()->json($resultados);
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
}
