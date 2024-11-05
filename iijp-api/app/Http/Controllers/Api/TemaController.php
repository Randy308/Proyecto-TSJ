<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Resolutions;
use App\Models\Salas;
use App\Models\Temas;
use App\Models\TipoResolucions;
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

    public function index()
    {
        //
    }

    public function obtenerNodos(Request $request)
    {
        $id = $request->id;

        if ($id) {
            $nodo_principal = Temas::where('id', $id)->first();

            if (!$nodo_principal) {
                return response()->json(['error' => 'Nodo no encontrado'], 404);
            }

            $hijos = Temas::where('tema_id', $id)->get();
            return response()->json($hijos);
        } else {
            $temas_generales = Temas::whereNull('tema_id')->get(['id', 'nombre', 'tema_id']);
            return response()->json($temas_generales);
        }
    }


    public function verTemasGenerales()
    {
        $temas_generales = DB::table('temas')->select('id', 'nombre', 'tema_id')->whereNull('tema_id')->get();
        return $temas_generales;
    }
    public function obtenerHijos($id)
    {

        $hijos = Temas::where('tema_id', '=', $id)->get();
        return $hijos->toJson();
    }


    public function obtenerParametrosCronologia(Request $request)
    {
        // Validar el descriptor
        $request->validate([
            'descriptor' => 'required|string',
        ]);

        $descriptor = $request->input('descriptor');

        // Función auxiliar para evitar la repetición de código
        $getDistinctValues = function ($joinTable, $nameTable, $joinColumn, $selectColumn) use ($descriptor) {
            return DB::table('jurisprudencias as j')
                ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
                ->join($joinTable, "$nameTable.id", '=', $joinColumn)
                ->where('j.descriptor', 'like', '%' . $descriptor . '%')
                ->distinct()
                ->pluck($selectColumn);
        };

        // Obtener los valores únicos
        $forma_resolucions = $getDistinctValues('forma_resolucions as fr', "fr", 'r.forma_resolucion_id', 'fr.nombre');
        $departamentos = $getDistinctValues('departamentos as d', "d", 'r.departamento_id', 'd.nombre');
        $tipo_resolucions = $getDistinctValues('tipo_resolucions as tr', "tr", 'r.tipo_resolucion_id', 'tr.nombre');

        // Preparar la respuesta
        $data = [
            'departamentos' => $departamentos,
            'forma_resolucions' => $forma_resolucions,
            'tipo_resolucions' => $tipo_resolucions,
        ];

        return response()->json($data);
    }



    public function obtenerCronologias(Request $request)
    {

        $tema_id = $request['tema_id'];
        $descriptor = $request['descriptor'];
        $departamento = $request["departamento"];
        $tipo_resolucion = $request["tipo_resolucion"];
        $forma_resolucion = $request["forma_resolucion"];
        $fecha_exacta = $request["fecha_exacta"];
        $fecha_desde = $request["fecha_desde"];
        $fecha_hasta = $request["fecha_hasta"];
        $cantidad = $request["cantidad"];

        $mi_departamento = null;
        $mi_tipo_resolucion = null;
        $mi_forma_resolucion = null; // Valor por defecto si forma_resolucion es "Todas"


        if ($forma_resolucion !== "Todas") {
            $mi_forma_resolucion = validarModelo(FormaResolucions::class, 'nombre', $forma_resolucion);
        }
        if ($forma_resolucion !== "Todas") {
            $mi_forma_resolucion = validarModelo(TipoResolucions::class, 'nombre', $tipo_resolucion);
        }
        if ($forma_resolucion !== "Todas") {
            $mi_forma_resolucion = validarModelo(Departamentos::class, 'nombre', $departamento);
        }
        // Encuentra el tema por ID
        $tema = Temas::where('id', $tema_id)->first();

        if (!$tema) {
            return response()->json(['error' => 'Tema no encontrado'], 404);
        }

        $query = DB::table('jurisprudencias as j')
            ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->select('j.resolution_id', 'j.ratio', 'j.descriptor', 'j.restrictor', 'j.tipo_jurisprudencia', 'r.nro_resolucion', 'tr.nombre as tipo_resolucion', 'r.proceso', 'fr.nombre as forma_resolucion')
            ->where('j.descriptor', 'like', '%' . $descriptor . '%');


        if ($mi_tipo_resolucion) {
            $query->where('r.tipo_resolucion_id', $mi_tipo_resolucion->id);
        }
        if ($mi_forma_resolucion) {
            $query->where('r.forma_resolucion_id', $mi_forma_resolucion->id);
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
        if ($cantidad) {
            $query->limit($cantidad);
        } else {
            $query->limit(25);
        }
        $results = $query->orderBy('j.descriptor')->get();

        if (!$results) {
            return response()->json(['error' => 'Sala no encontrada'], 404);
        }

        if ($results->count() === 0) {
            return response()->json(['error' => 'Datos no encontrados '], 404);
        }

        $data = [];
        $current = [];
        //return $results;




        foreach ($results as $element) {
            $pieces = explode(" / ", $element->descriptor);
            //array_push($lista, $pieces);
            $indices = [];
            if (count($current) > 0) {
                foreach ($pieces as $piece) {
                    $key = array_search($piece, $pieces);
                    if (in_array($piece, $current)) {

                        unset($pieces[$key]);
                    } else {
                        array_push($indices, $key);
                        array_push($current, $piece);
                    }
                }
                $element->descriptor = array_values($pieces);
                $element->indices = $indices;
            } else {
                $current = $pieces;
                foreach ($pieces as $piece) {
                    $key = array_search($piece, $pieces);
                    array_push($indices, $key);
                }
                $element->descriptor = $pieces;
                $element->indices = $indices;
            }
        }

        $data[] = [
            'current' => $current,
            'data' => $results->toArray()
        ];


        //return $request->estilos;
        $pdf = LaravelMpdf::loadView('pdf', ['results' => $results->toArray(), 'estilos' => $request->estilos], [], [
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
        //return $pdf->stream('document.pdf');
    }



    public function getCronologia(Request $request)
    {
        //
        $year = $request['nombreMateria'];
        $sala = $request['nombreMateria'];
        $departamento = $request['nombreMateria'];


        $mi_sala = Salas::where('nombre', $sala)->first();

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


    public function store(Request $request)
    {
        //
    }


    public function show($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }
}
