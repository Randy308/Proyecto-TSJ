<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Jurisprudencias;
use App\Models\Magistrados;
use App\Models\Salas;
use App\Models\Temas;
use App\Models\TipoResolucions;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

class CompareController extends Controller
{
    //

    public function obtenerElemento(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'materia' => 'nullable|string',
            'tipo_jurisprudencia' => 'nullable|string',
            'tipo_resolucion' => 'nullable|integer',
            'sala' => 'nullable|integer',
            'departamento' => 'nullable|integer',
            'magistrado' => 'nullable|integer',
            'forma_resolucion' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');
        $intervalo = $request->input('intervalo') ?? 'year';
        $numero_busqueda = $request->input('numero_busqueda');

        $validIntervals = ['month', 'quarter', 'year'];
        if (!in_array($intervalo, $validIntervals)) {
            throw new InvalidArgumentException("Invalid interval specified.");
        }

        // Construcción de la consulta principal
        $query = DB::table('resolutions AS r')->selectRaw('COUNT(r.id) AS cantidad');

        if ($request->has('limite')) {
            $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 2005');
        }

        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) BETWEEN 2000 AND 2024');

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

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipo_jurisprudencia = $request->tipo_jurisprudencia ?? 'all';
            $materia = $request->materia ?? 'all';

            $query->join(DB::raw("(SELECT resolution_id FROM jurisprudencias
            WHERE ('{$tipo_jurisprudencia}' = 'all' OR tipo_jurisprudencia = '{$tipo_jurisprudencia}')
            AND ('{$materia}' = 'all' OR descriptor LIKE '{$materia}%')) AS j"), 'j.resolution_id', '=', 'r.id');
        }

        // Clonar la consulta para la agrupación por departamento
        //$agrupar_departamentos = clone $query;

        // Aplicar agrupación por periodo
        switch ($intervalo) {
            case 'month':
                $query->selectRaw("DATE_TRUNC('month', r.fecha_emision)::date AS periodo")
                ->groupBy(DB::raw("DATE_TRUNC('month', r.fecha_emision)::date"))
                ->orderBy(DB::raw("DATE_TRUNC('month', r.fecha_emision)::date"));
                break;
            case 'quarter':
                $query->selectRaw("DATE_TRUNC('quarter', r.fecha_emision)::date AS periodo")
                ->groupBy(DB::raw("DATE_TRUNC('quarter', r.fecha_emision)::date"))
                ->orderBy(DB::raw("DATE_TRUNC('quarter', r.fecha_emision)::date"));
                break;
            case 'year':
                $query->selectRaw("DATE_TRUNC('year', r.fecha_emision)::date AS periodo")
                ->groupBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)::date"))
                ->orderBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)::date"));
                break;
        }

        $resolutions = $query->get();

        // Modificar la consulta de agrupación por departamentos
        $agrupar_departamentos = DB::table('resolutions AS r')
        ->selectRaw('d.nombre as name, COUNT(r.id) AS termino_'.$numero_busqueda)
        ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
        ->groupBy('d.nombre')
        ->orderByDesc('termino_' . $numero_busqueda);

        if ($request->has('magistrado')) {
            $agrupar_departamentos->where('r.magistrado_id', $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $agrupar_departamentos->where('r.forma_resolucion_id', $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $agrupar_departamentos->where('r.tipo_resolucion_id', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $agrupar_departamentos->where('r.sala_id', $request->sala);
        }

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipo_jurisprudencia = $request->tipo_jurisprudencia ?? 'all';
            $materia = $request->materia ?? 'all';

            $agrupar_departamentos->join(DB::raw("(SELECT resolution_id FROM jurisprudencias
            WHERE ('{$tipo_jurisprudencia}' = 'all' OR tipo_jurisprudencia = '{$tipo_jurisprudencia}')
            AND ('{$materia}' = 'all' OR descriptor LIKE '{$materia}%')) AS j"), 'j.resolution_id', '=', 'r.id');
        }

        $departamentos = $agrupar_departamentos->get();
        // Formatear los resultados de resoluciones
        $result = $resolutions->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();

        $request["variable"] = "fecha_emision";
        $request["orden"] = "asc";

        return response()->json([
            'termino' => [
                'name' => "termino_" . $numero_busqueda,
                'id' => $numero_busqueda,
                'value' => "Busqueda #" . $numero_busqueda,
                "detalles" => $request->all(),
            ],
            'resoluciones' => [
                'name' => "Busqueda #" . $numero_busqueda,
                'type' => 'line',
                'id' => $numero_busqueda,
                'data' => $result
            ],
            'departamentos' => $departamentos
        ]);
    }


    public function obtenerResoluciones(Request $request)
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
            ->select('r.nro_resolucion', 'r.id', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala');

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');

            if ($request->has('tipo_jurisprudencia')) {
                $query->where("j.tipo_jurisprudencia", $request->tipo_jurisprudencia);
            }
            if ($request->has('materia')) {
                $query->where("j.descriptor", 'like', $request->materia . '%');
            }
        }
        if ($fecha_inicial && $fecha_final && strtotime($fecha_inicial) && strtotime($fecha_final)) {
            $query->whereBetween('r.fecha_emision', [$fecha_inicial, $fecha_final]);
        }

        if ($request->has('magistrado')) {
            $query->where("r.magistrado_id", $request->magistrado);
        }
        // Filter by forma_resolucion_id if provided
        if ($request->has('forma_resolucion')) {
            $query->where("r.forma_resolucion_id", $request->forma_resolucion);
        }
        // Filter by tipo_jurisprudencia if provided
        if ($request->has('tipo_resolucion')) {
            $query->where("r.tipo_resolucion_id", $request->tipo_resolucion);
        }
        // Filter by sala_id if provided
        if ($request->has('sala')) {
            $query->where("r.sala_id", $request->sala); // Fixed this line to use sala_id
        }

        if ($request->has('departamento')) {
            $query->where("r.departamento_id", $request->departamento);
        }

        $paginatedData = $query->orderBy($variable, $orden)->paginate(20);
        return response()->json($paginatedData);
    }

    public function getParams()
    {
        $tipo_resolucion = TipoResolucions::all('nombre', 'id');
        $salas = Salas::all('nombre', 'id');
        $departamentos = Departamentos::all('nombre', 'id');
        $magistrados = Magistrados::all('nombre', 'id');
        $forma_res = FormaResolucions::all('nombre', 'id');

        $jurisprudencias = DB::table('jurisprudencias as j')
            ->select(
                'j.tipo_jurisprudencia as nombre',
                DB::raw('MIN(j.id) as id')
            )
            ->whereNotNull('j.tipo_jurisprudencia')->where('j.tipo_jurisprudencia', '!=', '')
            ->groupBy('j.tipo_jurisprudencia')
            ->orderBy('j.tipo_jurisprudencia')
            ->get();

        $materia = Temas::select('nombre', 'id')->whereNull("tema_id")->get();

        if (!$salas || !$tipo_resolucion) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        $data = [
            'tipo_resolucion' => $tipo_resolucion->toArray(),
            'sala' => $salas->toArray(),
            'magistrado' => $magistrados,
            'forma_resolucion' => $forma_res,
            'tipo_jurisprudencia' => $jurisprudencias,
            'materia' => $materia,
            'departamento' => $departamentos
        ];

        return response()->json($data);
    }


    public function getDates()
    {

        $max_date = DB::table('resolutions as r')
            ->selectRaw('MAX(r.fecha_emision) as max_fecha')
            ->whereIn('r.fecha_emision', function ($query) {
                $query->select('fecha_emision')
                    ->from('resolutions as sub_r')
                    ->groupBy('fecha_emision')
                    ->havingRaw('COUNT(sub_r.id) > 10');
            })
            ->value('max_fecha');

        // Get the min date
        $min_date = DB::table('resolutions as r')
            ->selectRaw('MIN(r.fecha_emision) as min_fecha')
            ->whereIn('r.fecha_emision', function ($query) {
                $query->select('fecha_emision')
                    ->from('resolutions as sub_r')
                    ->groupBy('fecha_emision')
                    ->havingRaw('COUNT(sub_r.id) > 10');
            })
            ->value('min_fecha');

        $data = [
            'superior' => $max_date,
            'inferior' => $min_date
        ];

        return response()->json($data);
    }
}
