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
            'materia' => 'required',
            'tipo_jurisprudencia' => 'required',
            //'intervalo' => 'required',
            'tipo_resolucion' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'sala' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'departamento' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'magistrado' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'forma_resolucion' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],

        ]);

        // 'intervalo' => 'required|string',
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');
        $intervalo = $request->input('intervalo');
        $numero_busqueda = $request->input('numero_busqueda');

        $intervalo = "month";
        $validIntervals = ['day', 'month', 'year', 'week', 'quarter'];
        if (!in_array($intervalo, $validIntervals)) {
            throw new InvalidArgumentException("Invalid interval specified.");
        }

        $query = DB::table(DB::raw("generate_series('{$fecha_inicial}'::date, '{$fecha_final}'::date, '1 {$intervalo}'::interval) AS series(fecha)"))
            ->selectRaw("
            EXTRACT(YEAR FROM series.fecha) AS year,
            EXTRACT(MONTH FROM series.fecha) AS month,
            EXTRACT(DAY FROM series.fecha) AS day,
            series.fecha AS periodo,
            COALESCE(COUNT(r.id), 0) AS cantidad
        ")
            ->leftJoin('resolutions AS r', function ($join) use ($request, $intervalo) {
                $join->on(DB::raw("date_trunc('{$intervalo}', r.fecha_emision)"), '=', DB::raw("date_trunc('{$intervalo}', series.fecha)"));

                // Apply filters on 'resolutions' table
                if ($request->magistrado != "all") {
                    $join->where("r.magistrado_id", $request->magistrado);
                }
                if ($request->forma_resolucion != "all") {
                    $join->where("r.forma_resolucion_id", $request->forma_resolucion);
                }
                if ($request->tipo_resolucion != "all") {
                    $join->where("r.tipo_resolucion_id", $request->tipo_resolucion);
                }
                if ($request->sala != "all") {
                    $join->where("r.sala_id", $request->sala);
                }
                if ($request->departamento != "all") {
                    $join->where("r.departamento_id", $request->departamento);
                }
            });

        // Adding the second join on the 'jurisprudencias' table
        if (strcmp($request->materia, "all") !== 0 || strcmp($request->tipo_jurisprudencia, "all") !== 0) {
            
            $query->leftJoin('jurisprudencias AS j', function ($join) use ($request) {
                // Joining 'jurisprudencias' on 'resolution_id'
                
                $join->on("j.resolution_id", '=', "r.id");

                // Apply filters on 'jurisprudencias' table
                if (strcmp($request->tipo_jurisprudencia, "all") !== 0) {
                    $join->where("j.tipo_jurisprudencia", $request->tipo_jurisprudencia);
                }
                if (strcmp($request->materia, "all") !== 0) {
                    $join->where("j.descriptor", 'like', $request->materia . '%');
                }
            });
        }

        $resolutions = $query
            ->groupBy('year', 'month', 'day', 'periodo') // Grouping non-aggregated fields
            ->orderBy('periodo') // Ordering by 'periodo' (series.fecha)
            ->get();
        $data = $resolutions->pluck('cantidad');
        $cabeceras = $resolutions->pluck('periodo')->map(function ($fecha) {
            return Carbon::parse($fecha)->toDateString();
        });

        $request["variable"] = "fecha_emision";
        $request["orden"] = "asc";

        return response()->json([

            'cabeceras' => $cabeceras,
            'termino' => [
                'name' => "Titulo",
                'id' => $numero_busqueda,
                'value' => "Busqueda #" . $numero_busqueda,
                "detalles" => $request->all(),
            ],
            'resoluciones' => [
                'name' => "Busqueda #" . $numero_busqueda,
                'type' => 'line',
                'id' => $numero_busqueda,
                'data' => $data
            ]
        ]);
    }



    public function obtenerResoluciones(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'materia' => 'required',
            'tipo_jurisprudencia' => 'required',
            //'intervalo' => 'required',
            'tipo_resolucion' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'sala' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'departamento' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'magistrado' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
            ],
            'forma_resolucion' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if value is either 'all' or an integer
                    if ($value !== 'all' && !is_numeric($value)) {
                        return $fail($attribute . ' must be either "all" or an integer.');
                    }
                },
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

        if ($request->materia != "all" || $request->tipo_jurisprudencia != "all") {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');

            if ($request->tipo_jurisprudencia != "all") {
                $query->where("j.tipo_jurisprudencia", $request->tipo_jurisprudencia);
            }
            if ($request->materia != "all") {
                $query->where("j.descriptor", 'like', $request->materia . '%');
            }
        }
        if ($fecha_inicial && $fecha_final && strtotime($fecha_inicial) && strtotime($fecha_final)) {
            $query->whereBetween('r.fecha_emision', [$fecha_inicial, $fecha_final]);
        }

        if ($request->magistrado != "all") {
            $query->where("r.magistrado_id", $request->magistrado);
        }
        // Filter by forma_resolucion_id if provided
        if ($request->forma_resolucion != "all") {
            $query->where("r.forma_resolucion_id", $request->forma_resolucion);
        }
        // Filter by tipo_jurisprudencia if provided
        if ($request->tipo_resolucion != "all") {
            $query->where("r.tipo_resolucion_id", $request->tipo_resolucion);
        }
        // Filter by sala_id if provided
        if ($request->sala != "all") {
            $query->where("r.sala_id", $request->sala); // Fixed this line to use sala_id
        }

        if ($request->departamento != "all") {
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
            ->whereNotNull('j.tipo_jurisprudencia')
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
            // 'tipo_jurisprudencia' => $jurisprudencias,
            // 'materia' => $materia,
            'departamento' => $departamentos
        ];

        return response()->json($data);
    }


    public function getDates()
    {

        $max_date = DB::table('resolutions as r')
            ->selectRaw("MAX(r.fecha_emision) as fecha_completa")
            ->value('fecha_completa'); // Obtiene el valor directamente

        $min_date = DB::table('resolutions as r')
            ->selectRaw("MIN(r.fecha_emision) as fecha_completa")
            ->value('fecha_completa'); // Obtiene el valor directamente

        $data = [
            'superior' => $max_date,
            'inferior' => $min_date
        ];

        return response()->json($data);
    }
}
