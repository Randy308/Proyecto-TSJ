<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessCronologia;
use App\Models\Descriptor;
use App\Models\Estilo;
use App\Models\Jurisprudencia;
use App\Models\Resolution;
use App\Models\Sala;
use App\Models\Tema;
use App\Utils\Busqueda;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Mpdf\HTMLParserMode;
use Mpdf\Mpdf;

function validarModelo($modelClassName, $field, $value)
{
    $errorMessage = null;
    $modelo = $modelClassName::where($field, $value)->first();

    if (! $modelo) {
        $defaultErrorMessage = "No se encontró el modelo '$modelClassName' con '$field' igual a '$value'.";
        throw new ModelNotFoundException($errorMessage ?: $defaultErrorMessage);
    }

    return $modelo;
}
class TemaController extends Controller
{
    public function obtenerNodos(Request $request)
    {
        $datos = DB::select('SELECT * FROM resumen_jerarquico');

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
        // $highlight = ['descriptor'];
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo', 'materia', 'magistrado', 'forma_resolucion'];
        $strategy = request()->input('strategy', false);

        $extraFields = [
            'id',
            'resolution_id',
            'tipo_resolucion',
            'nro_resolucion',
            'periodo',
        ];

        // unir ambos arrays sin duplicados
        $allFields = array_unique(array_merge($highlight, $extraFields));

        $options = [
            'query_by' => implode(',', $highlight),
            'highlight_full_fields' => implode(',', $highlight),
            'highlight_start_tag' => '<b class="highlight">',
            'highlight_end_tag' => '</b>',
            'highlight_affix_num_tokens' => 9,
            'snippet_threshold' => 100,
            'matching_strategy' => $strategy,
            'facet_by' => implode(',', $facetas),
            'per_page' => $perPage,
            'offset' => $offset,
            'page' => $page,
            'include_fields' => implode(',', $allFields),
        ];

        $search = Jurisprudencia::search($query)->options($options);

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
            $search->whereIn('tipo_resolucion', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $search->whereIn('sala', $request->sala);
        }
        if ($request->has('departamento')) {
            $search->whereIn('departamento', $request->departamento);
        }
        if ($request->has('magistrado')) {
            $search->whereIn('magistrado', $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $search->whereIn('forma_resolucion', $request->forma_resolucion);
        }

        $search = $search->raw();

        $hits = Busqueda::generarResultado($search);

        $facetas = $search['facet_counts'] ?? [];

        $facets = Busqueda::obtenerFacetas($facetas);

        return response()->json([
            'data' => $hits,
            'facets' => $facets,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['found'] ?? 0,
            'last_page' => ceil(($search['found'] ?? 0) / $perPage),

        ]);
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
        $search = Jurisprudencia::search($query, function ($meilisearch, $query, $options) use ($lista) {
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
            if (! isset($facets[$value])) {
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

        if (! is_array($ids) || empty($ids)) {
            return response()->json(['error' => 'IDs no válidos'], 400);
        }

        if (count($ids) > 40) {
            return response()->json(['error' => 'Demasiados IDs, máximo 40 permitidos'], 400);
        }

        $seccion = filter_var($request['seccion'], FILTER_VALIDATE_BOOLEAN);

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

        $results = $query->orderBy('j.descriptor')->orderBy('j.restrictor')->get();


        if (! $results) {
            return response()->json(['error' => 'Sala no encontrada'], 404);
        }

        if ($results->count() === 0) {
            return response()->json(['error' => 'Datos no encontrados '], 404);
        }

        // Preparar datos
        $current = [];
        $current_restrictor = null;

        foreach ($results as $element) {
            $pieces = explode(' / ', $element->descriptor);
            //$pieces[] =  $element->restrictor;
            $temp_restrictor = $element->restrictor;

            // Evita repetir restrictor
            if ($current_restrictor === $temp_restrictor) {
                $element->restrictor = "";
            }
            $current_restrictor = $temp_restrictor;

            $indices = [];

            if (!empty($current)) {
                $newPieces = [];
                $parentPath = "";

                foreach ($pieces as $key => $piece) {
                    // Generar path único
                    $path = $parentPath . "/" . $this->getInitials($piece);

                    // Solo si el path no existe aún, se guarda
                    if (!isset($current[$path])) {
                        $current[$path] = true; // ahora guardamos como set
                        $indices[] = $key;
                        $newPieces[] = $piece;
                    }

                    $parentPath = $path;
                }

                $element->descriptor = array_values($newPieces);
            } else {
                // Primer elemento
                $parentPath = "";
                foreach ($pieces as $key => $piece) {
                    $path = $parentPath . "/" . $this->getInitials($piece);
                    $current[$path] = true;
                    $parentPath = $path;
                }

                $indices = array_keys($pieces);
                $element->descriptor = $pieces;
            }

            $element->indices = $indices;
        }




        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $estilos = Estilo::where('tipo', 'Default')->get();
        $idsVistos = [];
        $referencias = [];
        foreach ($results as $item) {
            if (! in_array($item->resolution_id, $idsVistos)) {
                $idsVistos[] = $item->resolution_id;

                $fecha_formateada = '';
                if (! empty($item->fecha_emision)) {
                    try {
                        $fecha_formateada = Carbon::parse($item->fecha_emision)->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
                    } catch (\Exception $e) {
                        // Puedes registrar el error si lo deseas
                        $fecha_formateada = '';
                    }
                }

                $variables = explode('/', $item->nro_resolucion, 2);
                $referencias[] = (object) [
                    'id' => $item->resolution_id,
                    'external_id' => $item->external_id,
                    'nro_resolucion' => $variables[1] ?? '',
                    'fecha_emision' => $fecha_formateada,
                    'sala' => $item->sala,
                    'tipo_resolucion' => $item->tipo_resolucion,

                ];
            }
        }

        $pdf = new Mpdf([
            'tempDir' => storage_path('app/mpdf'),
            'format' => 'letter',
            'margin_left' => 25,
            'margin_right' => 25,
            'margin_top' => 25,
            'margin_bottom' => 25,
            'margin_header' => 10,
            'margin_footer' => 10,
            'orientation' => 'P',
            'title' => 'Documento',
            'author' => 'IIJP',
            'fontDir' => public_path('fonts/'),
            'fontdata' => [
                'cambria' => [
                    'R' => 'Cambriax.ttf',
                    'B' => 'Cambria-Bold.ttf',
                    'I' => 'Cambria-Italic.ttf',
                    'BI' => 'Cambria-Bold-Italic.ttf',
                ],
                'Arno_Pro' => [
                    'R' => 'ArnoPro-Regular.ttf',
                ],
                'bodoni_antiqua' => [
                    'R' => 'Bodoni-Antiqua.ttf',
                ],
                'chaparral' => [
                    'R' => 'Chaparral.ttf',
                ],
                'garamond' => [
                    'R' => 'Garamond.ttf',
                    'I' => 'Garamond-Italic.ttf',
                ],
                'myriad' => [
                    'R' => 'Myriad.ttf',
                ],
                'bauer' => [
                    'R' => 'bauer.ttf',
                ],
                'script_mt' => [
                    'R' => 'script-mt.ttf',
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

        // Cabecera
        $header = view('style', ['estilos' => $estilos])->render();
        $pdf->WriteHTML($header, HTMLParserMode::HEADER_CSS);

        // Portada
        $cover = view('head', ['titulo' => "", 'subtitulo' => '', 'fechaActual' => $fechaActual])->render();
        $pdf->WriteHTML($cover, HTMLParserMode::HTML_BODY);


        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Tabla de Contenido</h2>',
            'toc-bookmarkText' => 'Tabla de Contenido',
            'toc-suppress' => 'on',
            'toc-resetpagenum' => 1,
            'name' => "descriptor",
            'toc-odd-header-value' => "off", // This is the key setting
            'toc-odd-footer-value' => "off", // You can keep the footer if needed
            'resetpagenum' => 1
        ]);

        //ini_set('max_execution_time', '500');

        $pdf->SetHTMLFooter('<table style="width:168mm;border: none; border-collapse: collapse; margin-left: -1.5mm;">
        <tr>
            <td style="width: 8mm;" align="center">1</td>
            <td style="width: 8mm;" align="center">2</td>
            <td style="width: 8mm;" align="center">3</td>
            <td style="width: 8mm;" align="center">4</td>
            <td style="width: 8mm;" align="center">5</td>
            <td style="width: 8mm;" align="center">6</td>
            <td style="width: 8mm;" align="center">7</td>
            <td style="width: 112mm;" align="right"></td>
        </tr>
        <tr>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="right" class="footer-pagination">{PAGENO}</td>
        </tr>
    </table>
');


        $pdf->SetHTMLHeader('<table style="width:168mm;border: none; border-collapse: collapse; margin-left: -1.5mm;">
        <tr>
            <td style="width: 8mm;" align="center">1</td>
            <td style="width: 8mm;" align="center">2</td>
            <td style="width: 8mm;" align="center">3</td>
            <td style="width: 8mm;" align="center">4</td>
            <td style="width: 8mm;" align="center">5</td>
            <td style="width: 8mm;" align="center">6</td>
            <td style="width: 8mm;" align="center">7</td>
            <td style="width: 112mm;" align="right">IIJP</td>
        </tr>
        <tr>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
        </tr>
    </table>
    ');



        foreach (array_chunk($results->toArray(), 70) as $chunk) {
            $body = view('contents', ['results' => $chunk])->render();
            $pdf->WriteHTML($body, HTMLParserMode::HTML_BODY);
            //usleep(50000);
        }


        $footer = view('footer', ['referencias' => $referencias])->render();
        $pdf->WriteHTML($footer, HTMLParserMode::HTML_BODY);


        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Tabla de contenido detallado</h2>',
            'toc-bookmarkText' => 'Tabla de restrictores',
            'toc-show-pagenumbers' => true,
            'toc-resetpagenum' => 0,
            'name' => 'restrictor', // 🔸 Solo entradas con este toc-id
        ]);

        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Indice de autos supremos,resoluciones y
sentencias constitucionales</h2>',
            'toc-bookmarkText' => 'Indice de autos supremos',
            'toc-show-pagenumbers' => true,
            'toc-resetpagenum' => 0,
            'name' => 'autos', // 🔸 Solo entradas con este toc-id
        ]);

        $content = $pdf->Output();

        return response($content, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="documento.pdf"');
    }

    public function obtenerCronologiaMaterias(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('exportar_materias')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario.'], 403);
        }

        $request->validate([
            'materia' => 'required|integer|exists:descriptors,id',
            'subtema' => 'nullable|integer',
        ]);

        $tema_id = $request->input('materia');
        $subtema_id = $request->input('subtema', 0);

        // Validar solo la materia (obligatoria)
        $tema = Descriptor::find($tema_id);

        if (!$tema) {
            return response()->json(['error' => 'Materia no encontrada'], 404);
        }

        // Si el subtema no existe, se asigna 0
        if ($subtema_id > 0) {
            $subtemaExiste = Descriptor::where('id', $subtema_id)->exists();
            if (!$subtemaExiste) {
                $subtema_id = 0;
            }
        }

        ProcessCronologia::dispatch($tema_id, $subtema_id, Auth::id());

        return response()->json([
            'message' => 'Tarea en cola para ser procesada.',
            'subtema_usado' => $subtema_id
        ]);
    }


    function getInitials(string $inputString): string
    {
        $words = explode(' ', $inputString);
        $initials = '';
        foreach ($words as $word) {
            if (!empty($word)) { // Ensure the word is not empty (e.g., from multiple spaces)
                $initials .= mb_substr($word, 0, 3, 'UTF-8'); // Use mb_substr for multi-byte support
            }
        }
        return $initials;
    }
    public function obtenerCronologias(Request $request)
    {

        $request->validate([
            'tema_id' => 'required|integer',
            'descriptor' => 'nullable|string',
            'cantidad' => 'nullable|integer|min:1|max:100',
            'seccion' => 'nullable|boolean',
        ]);

        $tema_id = $request['tema_id'];

        // Encuentra el tema por ID
        $tema = Descriptor::where('id', $tema_id)->first();

        if (! $tema) {
            return response()->json(['error' => 'Tema no encontrado'], 404);
        }


        $seccion = filter_var($request['seccion'], FILTER_VALIDATE_BOOLEAN);

        // Encuentra el tema por ID
        $tema = Descriptor::where('id', $tema_id)->first();

        if (! $tema) {
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

        $query->where('j.descriptor_id', $tema_id);


        $query->limit(20);
        $results = $query->orderBy('j.descriptor')->get();

        if (! $results) {
            return response()->json(['error' => 'Sala no encontrada'], 404);
        }

        if ($results->count() === 0) {
            return response()->json(['error' => 'Datos no encontrados '], 404);
        }

        $current = [];

        // Preparar datos
        $current = [];
        $current_restrictor = null;

        foreach ($results as $element) {
            $pieces = explode(' / ', $element->descriptor);
            //$pieces[] =  $element->restrictor;
            $temp_restrictor = $element->restrictor;

            // Evita repetir restrictor
            if ($current_restrictor === $temp_restrictor) {
                $element->restrictor = "";
            }
            $current_restrictor = $temp_restrictor;

            $indices = [];

            if (!empty($current)) {
                $newPieces = [];
                $parentPath = "";

                foreach ($pieces as $key => $piece) {
                    // Generar path único
                    $path = $parentPath . "/" . $this->getInitials($piece);

                    // Solo si el path no existe aún, se guarda
                    if (!isset($current[$path])) {
                        $current[$path] = true; // ahora guardamos como set
                        $indices[] = $key;
                        $newPieces[] = $piece;
                    }

                    $parentPath = $path;
                }

                $element->descriptor = array_values($newPieces);
            } else {
                // Primer elemento
                $parentPath = "";
                foreach ($pieces as $key => $piece) {
                    $path = $parentPath . "/" . $this->getInitials($piece);
                    $current[$path] = true;
                    $parentPath = $path;
                }

                $indices = array_keys($pieces);
                $element->descriptor = $pieces;
            }

            $element->indices = $indices;
        }



        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $estilos = Estilo::where('tipo', 'Default')->get();


        $pdf = new Mpdf([
            'format' => 'letter',
            'tempDir' => storage_path('app/mpdf'),
            'margin_left' => 25,
            'margin_right' => 25,
            'margin_top' => 25,
            'margin_bottom' => 25,
            'margin_header' => 10,
            'margin_footer' => 10,
            'orientation' => 'P',
            'title' => 'Documento',
            'author' => 'IIJP',
            'fontDir' => public_path('fonts/'),
            'fontdata' => [
                'cambria' => [
                    'R' => 'Cambriax.ttf',
                    'B' => 'Cambria-Bold.ttf',
                    'I' => 'Cambria-Italic.ttf',
                    'BI' => 'Cambria-Bold-Italic.ttf',
                ],
                'Arno_Pro' => [
                    'R' => 'ArnoPro-Regular.ttf',
                ],
                'bodoni_antiqua' => [
                    'R' => 'Bodoni-Antiqua.ttf',
                ],
                'chaparral' => [
                    'R' => 'Chaparral.ttf',
                ],
                'garamond' => [
                    'R' => 'Garamond.ttf',
                    'I' => 'Garamond-Italic.ttf',
                ],
                'myriad' => [
                    'R' => 'Myriad.ttf',
                ],
                'bauer' => [
                    'R' => 'bauer.ttf',
                ],
                'script_mt' => [
                    'R' => 'script-mt.ttf',
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

        // Cabecera
        $header = view('style', ['estilos' => $estilos])->render();
        $pdf->WriteHTML($header, HTMLParserMode::HEADER_CSS);

        // Portada
        $cover = view('head', ['titulo' => "", 'subtitulo' => '', 'fechaActual' => $fechaActual])->render();
        $pdf->WriteHTML($cover, HTMLParserMode::HTML_BODY);


        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2>Tabla de Contenido</h2>',
            'toc-bookmarkText' => 'Tabla de Contenido',
            'toc-suppress' => 'on',
            'toc-resetpagenum' => 1,
            'toc-odd-header-value' => "off", // This is the key setting
            'toc-odd-footer-value' => "off", // You can keep the footer if needed
            'resetpagenum' => 1,
            'name' => "descriptor",
        ]);

        //ini_set('max_execution_time', '500');

        $pdf->SetHTMLFooter('<table style="width:168mm;border: none; border-collapse: collapse; margin-left: -1.5mm;">
        <tr>
            <td style="width: 8mm;" align="center">1</td>
            <td style="width: 8mm;" align="center">2</td>
            <td style="width: 8mm;" align="center">3</td>
            <td style="width: 8mm;" align="center">4</td>
            <td style="width: 8mm;" align="center">5</td>
            <td style="width: 8mm;" align="center">6</td>
            <td style="width: 8mm;" align="center">7</td>
            <td style="width: 112mm;" align="right"></td>
        </tr>
        <tr>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="right" class="footer-pagination">{PAGENO}</td>
        </tr>
    </table>
');


        $pdf->SetHTMLHeader('<table style="width:168mm;border: none; border-collapse: collapse; margin-left: -1.5mm;">
        <tr>
            <td style="width: 8mm;" align="center">1</td>
            <td style="width: 8mm;" align="center">2</td>
            <td style="width: 8mm;" align="center">3</td>
            <td style="width: 8mm;" align="center">4</td>
            <td style="width: 8mm;" align="center">5</td>
            <td style="width: 8mm;" align="center">6</td>
            <td style="width: 8mm;" align="center">7</td>
            <td style="width: 112mm;" align="right">IIJP</td>
        </tr>
        <tr>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
        </tr>
    </table>
    ');



        foreach (array_chunk($results->toArray(), 70) as $chunk) {
            $body = view('contents', ['results' => $chunk])->render();
            $pdf->WriteHTML($body, HTMLParserMode::HTML_BODY);
            //usleep(50000);
        }



        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Tabla de contenido detallado</h2>',
            'toc-bookmarkText' => 'Tabla de restrictores',
            'toc-show-pagenumbers' => true,
            'toc-resetpagenum' => 0,
            'name' => 'restrictor', // 🔸 Solo entradas con este toc-id
        ]);

        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Indice de autos supremos,resoluciones y
sentencias constitucionales</h2>',
            'toc-bookmarkText' => 'Indice de autos supremos',
            'toc-show-pagenumbers' => true,
            'toc-resetpagenum' => 0,
            'name' => 'autos', // 🔸 Solo entradas con este toc-id
        ]);


        $content = $pdf->Output();

        return response($content, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="documento.pdf"');
    }

    public function getCronologia(Request $request)
    {
        //
        $year = $request['nombreMateria'];
        $sala = $request['nombreMateria'];
        $departamento = $request['nombreMateria'];

        $mi_sala = Sala::where('nombre', $sala)->first();

        if (! $mi_sala) {
            return response()->json(['error' => 'Sala no encontrada a' . $sala], 404);
        }

        $data = [];
        $forma_resolucion = Resolution::select('forma_resolucion')->distinct()->get();

        foreach ($forma_resolucion as $res) {
            $resolutions = Resolution::whereYear('fecha_emision', $year)
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
                    'data' => $resolutions->toArray(),
                ];
            }
        }

        return $data;
    }
}
