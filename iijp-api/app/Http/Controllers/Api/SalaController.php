<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Resolutions;
use App\Models\Salas;
use App\Models\TipoResolucions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\Return_;

class SalaController extends Controller
{

    public function getSalas()
    {

        try {
            $resultado = Salas::orderBy('nombre')->get();
            $salas = $resultado->toArray();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener las salas'
            ], 500);
        }

        return response()->json($salas, 200);
    }

    public function index()
    {
        $data = [
            'salas' => [],
            'years' => []
        ];

        try {
            $resultado = Salas::orderBy('id')->get(["nombre"]);
            $salas = $resultado->toArray();
            array_unshift($salas, ['nombre' => 'Todas']);
            $data['salas'] = $salas;
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener las salas'
            ], 500);
        }

        try {
            $resultado_years = Resolutions::select(DB::raw('DISTINCT DATE_PART(\'year\', fecha_emision) AS year'))->whereNotNull('fecha_emision')->orderBy("year")->pluck('year');
            $years = $resultado_years->toArray();
            array_unshift($years, 'Todos');
            $data['years'] = $years;
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener los years'
            ], 500);
        }

        return response()->json($data, 200);
    }


    public function store(Request $request)
    {
        //
    }
    public function obtenerEstadisticasXYZ(Request $request)
    {

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $departamentos = Departamentos::select('nombre as departamento')->get();
        $tipos = TipoResolucions::select('nombre as tipo')->get();

        $salasArray = $salas->pluck('sala')->toArray();
        $departamentosArray = $departamentos->pluck('departamento')->toArray();
        $tiposArray = $tipos->pluck('tipo')->toArray();

        $combinations = [];
        foreach ($salasArray as $sala) {
            foreach ($departamentosArray as $departamento) {
                foreach ($tiposArray as $tipo) {
                    $combinations[] = [
                        'sala' => $sala,
                        'departamento' => $departamento,
                        'tipo' => $tipo,
                        "cantidad" => 0,
                    ];
                }
            }
        }

        $datos = FormaResolucions::selectRaw('COALESCE(COUNT(resolutions.id), 0) AS cantidad, salas.nombre as sala , departamentos.nombre as departamento ,tipo_resolucions.nombre as tipo')
            ->join('resolutions', 'resolutions.forma_resolucion_id', '=', 'forma_resolucions.id')
            ->join('tipo_resolucions', 'resolutions.tipo_resolucion_id', '=', 'tipo_resolucions.id')
            ->join('salas', 'resolutions.sala_id', '=', 'salas.id')->join('departamentos', 'resolutions.departamento_id', '=', 'departamentos.id')
            ->whereIn('resolutions.sala_id', $request->salas)
            ->where('forma_resolucions.id', $request->formaId)
            ->groupBy('forma_resolucions.nombre', 'salas.nombre', 'departamentos.nombre', 'tipo_resolucions.nombre')->orderby("departamentos.nombre")
            ->get();

        $total = array_sum($datos->pluck('cantidad')->toArray());

        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->sala][$dato->departamento][$dato->tipo] = $dato->cantidad;
        }

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']][$item['departamento']][$item['tipo']] ?? 0;
        }

        return response()->json([
            'formaID' => $request->formaId,
            'total' => $total,
            'data' => SalaController::ordenarArrayXYZ($combinations),
        ], 200);
    }

    public function ordenarArrayXYZ($combinations)
    {
        $variableX = 'tipo';
        $variableY = 'sala';
        $variableZ = 'departamento';

        $uniqueColumns = collect($combinations)->map(function ($item) use ($variableX, $variableY) {
            return $item[$variableX] . '_' . $item[$variableY];
        })->unique()->sort()->values()->all();

        $resultado = [];
        $uniqueItems = collect($combinations)->pluck($variableZ)->unique();

        $combinations = collect($combinations);

        foreach ($uniqueItems as $mainValue) {
            $row = [$variableZ => $mainValue];

            foreach ($uniqueColumns as $column) {
                $lastSpaceIndex = strrpos($column, '_');
                $colValueX = substr($column, 0, $lastSpaceIndex);
                $colValueY = substr($column, $lastSpaceIndex + 1);


                $entry = $combinations->first(function ($element) use ($mainValue, $variableX, $variableY, $variableZ, $colValueX, $colValueY) {
                    return $element[$variableZ] === $mainValue
                        && $element[$variableX] === $colValueX
                        && $element[$variableY] === $colValueY;
                });

                $row[$column] = $entry ? $entry['cantidad'] : 0;

                if ($entry) {
                    $combinations = $combinations->reject(function ($element) use ($entry) {
                        return $element === $entry;
                    });
                }
            }

            $resultado[] = $row;
        }

        return $resultado;
    }

    public function ordenarArrayXY($combinations)
    {
        $variableX = 'departamento';
        $variableY = 'sala';

        $uniqueColumns = collect($combinations)->map(function ($item) use ($variableX) {
            return ucfirst($variableX) . '_' . $item[$variableX];
        })->unique()->values()->all();

        $resultado = [];
        $uniqueItems = collect($combinations)->pluck($variableY)->unique();

        $combinations = collect($combinations);

        foreach ($uniqueItems as $mainValue) {

            $row = [$variableY => $mainValue];

            foreach ($uniqueColumns as $column) {
                $lastSpaceIndex = strrpos($column, '_');
                $colValue = substr($column, $lastSpaceIndex + 1);

                $entry = $combinations->first(function ($element) use ($mainValue, $variableX, $variableY, $colValue) {
                    return $element[$variableY] === $mainValue
                        && $element[$variableX] === $colValue;
                });

                $row[$column] = $entry ? $entry['cantidad'] : 0;

                if ($entry) {
                    $combinations = $combinations->reject(function ($element) use ($entry) {
                        return $element === $entry;
                    });
                }
            }

            $resultado[] = $row;
        }

        return $resultado;
    }



    public function obtenerEstadisticasXY(Request $request)
    {

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $departamentos = Departamentos::select('nombre as departamento')->get();
        $salasArray = $salas->pluck('sala')->toArray();
        $departamentosArray = $departamentos->pluck('departamento')->toArray();
        $combinations = [];

        foreach ($salasArray as $sala) {
            foreach ($departamentosArray as $departamento) {

                $combinations[] = [
                    'sala' => $sala,
                    'departamento' => $departamento,
                    "cantidad" => 0,
                ];
            }
        }

        $datos = FormaResolucions::selectRaw('COALESCE(COUNT(resolutions.id), 0) AS cantidad, salas.nombre as sala , departamentos.nombre as departamento')
            ->join('resolutions', 'resolutions.forma_resolucion_id', '=', 'forma_resolucions.id')
            ->join('salas', 'resolutions.sala_id', '=', 'salas.id')->join('departamentos', 'resolutions.departamento_id', '=', 'departamentos.id')
            ->whereIn('resolutions.sala_id', $request->salas)
            ->where('forma_resolucions.id', $request->formaId)
            ->groupBy('forma_resolucions.nombre', 'salas.nombre', 'departamentos.nombre')->orderby("departamentos.nombre")
            ->get();

        $total = array_sum($datos->pluck('cantidad')->toArray());

        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->sala][$dato->departamento] = $dato->cantidad;
        }

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']][$item['departamento']] ?? 0;
        }

        return response()->json([
            'formaID' => $request->formaId,
            'total' => $total,
            'data' => SalaController::ordenarArrayXY($combinations),

        ], 200);
    }
    public function obtenerEstadisticasX(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'salas' => 'required|array',
            'salas.*' => 'required|integer',
            'formaId' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        $forma = FormaResolucions::findOrFail($request->formaId);

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $salasArray = $salas->pluck('sala')->toArray();
        $combinations = [];
        foreach ($salasArray as $sala) {
            $combinations[] = [
                'sala' => $sala,
                'cantidad' => 0,
            ];
        }

        $datos = FormaResolucions::selectRaw('COALESCE(COUNT(resolutions.id), 0) AS cantidad, salas.nombre as sala')
            ->join('resolutions', 'resolutions.forma_resolucion_id', '=', 'forma_resolucions.id')
            ->join('salas', 'resolutions.sala_id', '=', 'salas.id')
            ->whereIn('resolutions.sala_id', $request->salas)
            ->where('forma_resolucions.id', $request->formaId)
            ->groupBy('salas.nombre')
            ->get();

        $total = array_sum($datos->pluck('cantidad')->toArray());
        $datoLookup = $datos->pluck('cantidad', 'sala')->toArray();

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']] ?? 0;
            $item['porcentaje'] = $total ? number_format(($item['cantidad'] / $total) * 100, 2) : 0;
        }

        $response = [
            'formaResolution' => $forma->nombre,
            'total' => $total,
            'data' => SalaController::ordenarArrayXY($combinations),
        ];

        return response()->json($response, 200);
    }

    public function getbyIDs(Request $request)
    {


        try {


            // Convertir todos los elementos de $request->salas a enteros
            $salas = array_map('intval', $request->salas);

            $resultado = DB::table('salas as s')
                ->join('resolutions as r', 's.id', '=', 'r.sala_id')
                ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
                ->selectRaw("COALESCE(fr.nombre, '') as name, COALESCE(COUNT(DISTINCT r.id), 0) AS value, fr.id")
                ->whereIn('s.id', $salas)  // Ahora se utiliza $salas, que tiene los valores como enteros
                ->groupBy('fr.id')
                ->orderBy('value', 'desc')
                ->get();


            // Convertir a array, si es necesario
            $salas = $resultado->toArray();

            $cantidades = $resultado->pluck('value')->toArray();
            //$formas = $resultado->pluck('tipo')->toArray();

            $total = array_sum($cantidades);

            $acum = 0;
            $relativo_acum = 0;
            foreach ($salas as &$item) {
                // Acumular el valor de cantidad
                $acum += $item->value;
                $item->acum = $acum; // Guardar acumulado


                $relativo = $item->value / $total * 100;
                $item->relativo = round($relativo, 2) . '%'; //

                $relativo_acum += $relativo;
                $item->relativo_acum = round($relativo_acum, 2) . '%';
            }
            // Retornar los datos en una respuesta JSON
            return response()->json([
                'data' => $salas,
                'total' => $total
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Sala no encontrada
            return response()->json([
                'error' => 'Sala no encontrada'
            ], 404);
        } catch (\Exception $e) {
            // Manejo de otros errores
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener las salas',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $sala = Salas::where('id', $id)->firstOrFail();

            $resultado = DB::table('salas as s') // Asegúrate que 'salas' es el nombre correcto de la tabla
                ->join('resolutions as r', 's.id', '=', 'r.sala_id')
                ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
                ->selectRaw("COALESCE(fr.nombre, '') as tipo, COALESCE(COUNT(DISTINCT r.id), 0) AS cantidad")
                ->where('s.id', $sala->id)
                ->groupBy('tipo')
                ->orderBy('cantidad', 'desc')
                ->get();

            // Convertir a array, si es necesario
            $salas = $resultado->toArray();

            $cantidades = $resultado->pluck('cantidad')->toArray();

            $total = array_sum($cantidades);

            $acum = 0;
            $relativo_acum = 0;
            foreach ($salas as &$item) {
                // Acumular el valor de cantidad
                $acum += $item->cantidad;
                $item->acum = $acum; // Guardar acumulado

                // Calcular el relativo
                $relativo = $item->cantidad / $total * 100;
                $item->relativo = round($relativo, 2); // Guardar relativo (porcentaje con dos decimales)

                // Calcular el relativo acumulado
                $relativo_acum += $relativo;
                $item->relativo_acum = round($relativo_acum, 2); // Guardar relativo acumulado
            }
            // Retornar los datos en una respuesta JSON
            return response()->json([
                'nombre' => $sala->nombre,
                'data' => $salas,
                'total' => $total
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Sala no encontrada
            return response()->json([
                'error' => 'Sala no encontrada'
            ], 404);
        } catch (\Exception $e) {
            // Manejo de otros errores
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener las salas',
                'details' => $e->getMessage()
            ], 500);
        }
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
