<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\Descriptor;
use App\Models\Estilos;
use App\Models\FormaResolucions;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Models\Sala;
use App\Models\Tema;
use App\Models\TipoResolucions;
use App\Utils\Listas;
use Carbon\Carbon;
use Dotenv\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;
use Meilisearch\Client;

function validarModelo($modelClassName, $field, $value)
{
    $errorMessage = null;
    $modelo = $modelClassName::where($field, $value)->first();

    if (!$modelo) {
        $defaultErrorMessage = "No se encontró el modelo '$modelClassName' con '$field' igual a '$value'.";
        throw new ModelNotFoundException($errorMessage ?: $defaultErrorMessage);
    }

    return $modelo;
}
class TemaController extends Controller
{

    public function obtenerNodos(Request $request)
    {
        $datos = DB::select("SELECT * FROM resumen_jerarquico");
        return response()->json($datos);
        // Reorganizar los datos en un mapa por ID
        $mapa = [];
        foreach ($datos as $item) {
            $item->children = [];
            $mapa[$item->id] = $item;
        }

        // Construir jerarquía
        $raices = [];
        foreach ($mapa as $item) {
            if ($item->descriptor_id === null) {
                $raices[] = $item;
            } else {
                if (isset($mapa[$item->descriptor_id])) {
                    $mapa[$item->descriptor_id]->children[] = $item;
                }
            }
        }

        return response()->json($raices);
    }


    public function obtenerNodosPorNombre(Request $request)
    {
        $ids = $request->ids;
        return $ids;
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
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo','materia','magistrado', 'forma_resolucion'];

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

    public function obtenerParametrosCronologia(Request $request)
    {
        // Validar el descriptor
        $request->validate([
            'materia' => 'nullable|integer',
            'descriptor' => 'nullable|integer',
            'busqueda' => 'nullable|string|max:100',
        ]);


        $lista = ['sala', 'departamento', 'tipo_resolucion', 'periodo'];


        $query = $request->input('busqueda', '');
        $search = Jurisprudencias::search($query, function ($meilisearch, $query, $options) use ($lista) {
            $options['facets'] = $lista;
            return $meilisearch->search($query, $options);
        });

        if ($request->has('materia')) {
            $materia = $request->input('materia');
            $search->where('materia', $materia);
        }


        $search = $search->raw();


        $facets = $search['facetDistribution'] ?? [];

        $data = [];

        foreach ($lista as $value) {
            if (!isset($facets[$value])) {
                continue;
            }

            $numericalKeys = array_map('intval', array_keys($facets[$value]));

            $filtered = array_filter($numericalKeys, function ($item) {
                return $item !== 0;
            });

            $data[$value] = array_values($filtered); // Reindexa
        }
        return $data;
    }


    public function obtenerCronologiasbyIds(Request $request)
    {

        $request->validate([
            'ids' => 'required|array|max:40',
            'ids.*' => 'required|integer',
        ]);

        $ids = $request['ids'];

        if (!is_array($ids) || empty($ids)) {
            return response()->json(['error' => 'IDs no válidos'], 400);
        }

        if (count($ids) > 40) {
            return response()->json(['error' => 'Demasiados IDs, máximo 40 permitidos'], 400);
        }


        $seccion = filter_var($request["seccion"], FILTER_VALIDATE_BOOLEAN);



        $query = DB::table('jurisprudencias as j')
            ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('mapeos as m', 'm.resolution_id', '=', 'r.id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('tipo_jurisprudencias as tj', 'tj.id', '=', 'j.tipo_jurisprudencia_id')
            ->select('j.resolution_id', 'j.ratio', 'j.descriptor', 'j.restrictor', 'tj.nombre as tipo_jurisprudencia', 'r.nro_resolucion', 'tr.nombre as tipo_resolucion', 'r.proceso', 'fr.nombre as forma_resolucion', 's.nombre as sala', 'r.fecha_emision', 'r.nro_resolucion', 'm.external_id');



        $query->whereIn('r.id', $ids);
        if ($seccion === true) {
            $query->addSelect(DB::raw("substring(c.contenido from 'POR TANTO[:]?[\\s]?([[:space:][:print:]]+?)Reg[ií]strese') as resultado"));
        }



        $results = $query->orderBy('j.descriptor')->get();

        if (!$results) {
            return response()->json(['error' => 'Sala no encontrada'], 404);
        }

        if ($results->count() === 0) {
            return response()->json(['error' => 'Datos no encontrados '], 404);
        }


        $current = [];

        foreach ($results as $element) {
            $pieces = explode(" / ", $element->descriptor);
            $indices = [];

            if (!empty($current)) {
                $newPieces = [];
                foreach ($pieces as $key => $piece) {
                    if (!isset($current[$piece])) {
                        $current[$piece] = true;
                        $indices[] = $key;
                        $newPieces[] = $piece;
                    }
                }
                $element->descriptor = array_values($newPieces);
            } else {
                $current = array_fill_keys($pieces, true);
                $indices = array_keys($pieces);
                $element->descriptor = $pieces;
            }

            $element->indices = $indices;
        }


        $idsVistos = [];
        $referencias = [];
        foreach ($results as $item) {
            if (!in_array($item->resolution_id, $idsVistos)) {
                $idsVistos[] = $item->resolution_id;

                $fecha_formateada = "";
                if (!empty($item->fecha_emision)) {
                    try {
                        $fecha_formateada = Carbon::parse($item->fecha_emision)->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
                    } catch (\Exception $e) {
                        // Puedes registrar el error si lo deseas
                        $fecha_formateada = "";
                    }
                }

                $variables = explode('/', $item->nro_resolucion, 2);
                $referencias[] = (object)[
                    'id' => $item->resolution_id,
                    'external_id' => $item->external_id,
                    'nro_resolucion' => $variables[1] ?? '',
                    'fecha_emision' => $fecha_formateada,
                    'sala' => $item->sala,
                    'tipo_resolucion' => $item->tipo_resolucion,

                ];
            }
        }


        //return response()->json($results);

        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $estilos = Estilos::where('tipo', 'Default')->get();

        //return $estilos;
        //return $request->estilos;
        $pdf = LaravelMpdf::loadView('pdf', ['results' => $results->toArray(), 'estilos' => $estilos, 'subtitulo' => $request->subtitulo, "fechaActual" => $fechaActual, 'referencias' => $referencias], [], [
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



    public function obtenerCronologias(Request $request)
    {

        $tema_id = $request['tema_id'];
        $descriptor = $request['descriptor'];
        $cantidad = $request["cantidad"];


        $excluirNodos = filter_var($request["recorrer"], FILTER_VALIDATE_BOOLEAN);
        $seccion = filter_var($request["seccion"], FILTER_VALIDATE_BOOLEAN);


        // Encuentra el tema por ID
        $tema = Descriptor::where('id', $tema_id)->first();

        if (!$tema) {
            return response()->json(['error' => 'Tema no encontrado'], 404);
        }

        $query = DB::table('jurisprudencias as j')
            ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('tipo_jurisprudencias as tj', 'tj.id', '=', 'j.tipo_jurisprudencia_id')
            ->select('j.resolution_id', 'j.ratio', 'j.descriptor', 'j.restrictor', 'tj.nombre as tipo_jurisprudencia', 'r.nro_resolucion', 'tr.nombre as tipo_resolucion', 'r.proceso', 'fr.nombre as forma_resolucion');



        if ($seccion === true) {
            $query->addSelect(DB::raw("substring(c.contenido from 'POR TANTO[:]?[\\s]?([[:space:][:print:]]+?)Reg[ií]strese') as resultado"));
        }

        if ($excluirNodos === true) {
            // Busca términos que empiecen con el descriptor
            $query->where('j.descriptor', 'like',  $descriptor);
        } else {
            // Busca coincidencias parciales en cualquier posición
            $query->where('j.descriptor', 'like',  $descriptor . '%');
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


        if ($cantidad) {
            $query->limit($cantidad);
        } else {
            $query->limit(30);
        }
        $results = $query->orderBy('j.descriptor')->get();

        if (!$results) {
            return response()->json(['error' => 'Sala no encontrada'], 404);
        }

        if ($results->count() === 0) {
            return response()->json(['error' => 'Datos no encontrados '], 404);
        }

        $current = [];

        foreach ($results as $element) {
            $pieces = explode(" / ", $element->descriptor);
            $indices = [];

            if (!empty($current)) {
                $newPieces = [];
                foreach ($pieces as $key => $piece) {
                    if (!isset($current[$piece])) {
                        $current[$piece] = true;
                        $indices[] = $key;
                        $newPieces[] = $piece;
                    }
                }
                $element->descriptor = array_values($newPieces);
            } else {
                $current = array_fill_keys($pieces, true);
                $indices = array_keys($pieces);
                $element->descriptor = $pieces;
            }

            $element->indices = $indices;
        }


        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $estilos = Estilos::where('tipo', 'Default')->get();



        $referencias = [];


        //return $estilos;
        //return $request->estilos;
        $pdf = LaravelMpdf::loadView('pdf', ['results' => $results->toArray(), 'estilos' => $estilos, 'subtitulo' => $request->subtitulo, "fechaActual" => $fechaActual, 'referencias' => $referencias], [], [
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



    public function getCronologia(Request $request)
    {
        //
        $year = $request['nombreMateria'];
        $sala = $request['nombreMateria'];
        $departamento = $request['nombreMateria'];


        $mi_sala = Sala::where('nombre', $sala)->first();

        if (!$mi_sala) {
            return response()->json(['error' => 'Sala no encontrada a' . $sala], 404);
        }



        $data = [];
        $forma_resolucion = Resolutions::select('forma_resolucion')->distinct()->get();

        foreach ($forma_resolucion as $res) {
            $resolutions = Resolutions::whereYear('fecha_emision', $year)
                ->where('departamento', $departamento)
                ->where('sala_id', $mi_sala->id)
                ->where('forma_resolucion', $res->forma_resolucion)
                ->select(
                    DB::raw('DATE_PART(\'month\', fecha_emision) as mes'),
                    DB::raw('count(*) as cantidad')
                )
                ->groupBy('mes')
                ->orderBy('mes')
                ->get();
            if ($resolutions->isNotEmpty()) {
                $data[] = [
                    'id' => $res->forma_resolucion,
                    'color' => 'hsl(118, 70%, 50%)',
                    'data' => $resolutions->toArray()
                ];
            }
        }


        return $data;
    }
}
