<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\Descriptor;
use App\Models\Estilos;
use App\Models\FormaResolucions;
use App\Models\Resolutions;
use App\Models\Sala;
use App\Models\Tema;
use App\Models\TipoResolucions;
use Carbon\Carbon;
use Dotenv\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Mccarlosen\LaravelMpdf\Facades\LaravelMpdf;

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


        $ids = $request->ids;
        $variable = $request["variable"];
        $orden = $request["orden"];

        $columnasPermitidas = ['nro_resolucion', 'fecha_emision', 'tipo_resolucion', 'departamento', 'sala'];
        $variable = in_array($variable, $columnasPermitidas) ? $variable : 'fecha_emision';
        $orden = in_array(strtolower($orden), ['asc', 'desc']) ? $orden : 'asc';

        $query = DB::table('resolutions as r')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->join('restrictors as rt', 'rt.id', '=', 'j.restrictor_id')
            ->select(
                'r.id',
                'r.nro_resolucion',
                'r.fecha_emision',
                DB::raw('array_agg(rt.nombre) as departamento'),
                'tr.nombre as tipo_resolucion',
                's.nombre as sala'
            )
            ->whereIn('r.id', $ids)->groupBy('r.id', 'tr.nombre', 's.nombre');



        $results = $query->orderBy($variable, $orden)->paginate(20);

        return response()->json($results);
    }

    public function obtenerParametrosCronologia(Request $request)
    {
        // Validar el descriptor
        $request->validate([
            'descriptor' => 'required|string',
        ]);

        $descriptor = $request->input('descriptor');

        // Función auxiliar para evitar la repetición de código
        $getDistinctValues = function ($selectColumn) use ($descriptor) {
            return DB::table('jurisprudencias as j')
                ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
                ->where('j.descriptor', 'like', '%' . $descriptor . '%')
                ->distinct()
                ->pluck($selectColumn);
        };

        // Obtener los valores únicos
        $salas = $getDistinctValues('sala_id');
        $departamentos = $getDistinctValues('departamento_id');
        $tipo_resolucions = $getDistinctValues('tipo_resolucion_id');

        $periodo = DB::table('resolutions as r')
            ->selectRaw("CAST(coalesce(EXTRACT(YEAR FROM fecha_emision) , '0') AS integer) as nombre")->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')->where('j.descriptor', 'like', '%' . $descriptor . '%')
            ->groupBy('nombre')
            ->orderBy('nombre', 'desc')
            ->get()->pluck("nombre");

        $ids = DB::table('jurisprudencias as j')
            ->where('j.descriptor', 'like', '%' . $descriptor . '%')
            ->distinct()->limit(40)->pluck('j.resolution_id');
        // Preparar la respuesta
        $data = [
            'departamento' => $departamentos,
            'sala' => $salas,
            'tipo_resolucion' => $tipo_resolucions,
            'ids' => $ids,
            'periodo' => $periodo
        ];

        return response()->json($data);
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
            ->join('restrictors as rt', 'rt.id', '=', 'j.restrictor_id')
            ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('tipo_jurisprudencias as tj', 'tj.id', '=', 'j.tipo_jurisprudencia_id')
            ->select('j.resolution_id', 'j.ratio', 'j.descriptor', 'rt.nombre as restrictor', 'tj.nombre as tipo_jurisprudencia', 'r.nro_resolucion', 'tr.nombre as tipo_resolucion', 'r.proceso', 'fr.nombre as forma_resolucion');



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

        //return $estilos;
        //return $request->estilos;
        $pdf = LaravelMpdf::loadView('pdf', ['results' => $results->toArray(), 'estilos' => $estilos, 'subtitulo' => $request->subtitulo, "fechaActual" => $fechaActual], [], [
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
