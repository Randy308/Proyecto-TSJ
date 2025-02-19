<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Models\Salas;
use App\Models\TipoResolucions;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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





    public function ordenarArrayXYZ($combinations, $nombre_y, $nombre_z)
    {
        $variableY = $nombre_y;
        $variableZ = 'sala';
        $variableX = $nombre_z;

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

    public function ordenarArrayXY($combinations, $name)
    {
        $variableX = $name;
        $variableY = 'sala';

        $uniqueColumns = collect($combinations)->map(function ($item) use ($variableX) {
            return $item[$variableX];
        })->unique()->values()->all();

        $resultado = [];
        $uniqueItems = collect($combinations)->pluck($variableY)->unique();

        $combinations = collect($combinations);

        foreach ($uniqueItems as $mainValue) {

            $row = [$variableY => $mainValue];

            foreach ($uniqueColumns as $column) {

                $colValue = $column;

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

    public function obtenerModelo($name, $values)
    {
        $errorMessage = null;

        if ($name == "tipo_jurisprudencia") {
            $model = DB::table('jurisprudencias as x')
                ->select('x.tipo_jurisprudencia as ' . $name)->whereNotNull('x.tipo_jurisprudencia')
                ->distinct()
                ->get();
        } else {
            $full_name = $name . "s";
            $model = DB::table($full_name . ' as x')
                ->select('x.nombre as ' . $name)
                ->whereIn('x.id', $values)
                ->get();
        }

        if ($model->isEmpty()) {
            $defaultErrorMessage = "No se encontró el modelo '$name'.";
            throw new ModelNotFoundException($errorMessage ?: $defaultErrorMessage);
        }

        return $model;
    }

    public function generarConsulta($formaId, $salas, $tablas)
    {
        // Initial select and group by
        $select = "COALESCE(COUNT(r.id), 0) AS cantidad, salas.nombre AS sala";
        $group_by = "salas.nombre";

        // Base query
        $query = FormaResolucions::selectRaw($select)
            ->join('resolutions as r', 'r.forma_resolucion_id', '=', 'forma_resolucions.id')
            ->join('salas', 'r.sala_id', '=', 'salas.id')
            ->whereIn('r.sala_id', $salas)
            ->where('forma_resolucions.id', $formaId);

        // Loop to add dynamic joins and selects based on tables array
        foreach ($tablas as $tabla) {
            $table_name = $tabla->nombre;
            $values = $tabla->ids;
            $full_name = $table_name . "s";
            if ($table_name && $values) {
                if ($table_name == "tipo_jurisprudencia") {
                    $jurisprudencia_nombres  = Jurisprudencias::whereIn('jurisprudencias.id', $values)->get("tipo_jurisprudencia")->pluck("tipo_jurisprudencia");
                    $query->join('jurisprudencias', 'jurisprudencias.resolution_id', '=', 'r.id')
                        ->whereIn('jurisprudencias.id', $jurisprudencia_nombres);
                    $select .= ", jurisprudencias.tipo_jurisprudencia AS " . $table_name;
                    $group_by .= ", " . $table_name;
                } else {
                    $query->join($full_name, $full_name . '.id', '=', 'r.' . $table_name . '_id')
                        ->whereIn($full_name . '.id', $values);
                    $select .= ", " . $full_name . ".nombre AS " . $table_name;
                    $group_by .= ", " . $full_name . ".nombre";
                }
            }
        }

        // Finalize select and group by, then get the results
        return $query->selectRaw($select)->groupByRaw($group_by)->get();
    }



    public function obtenerEstadisticasXY(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'salas' => 'required|array',
            'salas.*' => 'required|integer',
            'formaId' => 'required|integer',
            'idsY' => 'required|array',
            'idsY.*' => 'required|integer',
            'nombreY' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $nombre = $request['nombreY'];
        $ids = $request['idsY'];

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $table = SalaController::obtenerModelo($nombre, $ids);

        $salasArray = $salas->pluck('sala')->toArray();
        $tableArray = $table->pluck($nombre)->toArray();
        $combinations = [];

        foreach ($salasArray as $sala) {
            foreach ($tableArray as $row) {
                $combinations[] = [
                    'sala' => $sala,
                    $nombre => $row,
                    "cantidad" => 0,
                ];
            }
        }

        $datos = SalaController::generarConsulta($request->formaId, $request->salas, [
            (object)[
                "nombre" => $nombre,
                "ids" => $ids
            ]
        ]);

        $total = array_sum($datos->pluck('cantidad')->toArray());


        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->sala][$dato->$nombre] = $dato->cantidad;
        }


        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['sala']][$item[$nombre]] ?? 0;
        }

        return response()->json([
            'formaID' => $request->formaId,
            'total' => $total,
            'data' => SalaController::ordenarArrayXY($combinations, $nombre),
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
        }

        $response = [
            'formaResolution' => $forma->nombre,
            'total' => $total,
            'data' => $combinations,
            'salas' => $request->salas,
        ];

        return response()->json($response, 200);
    }

    public function getByIDs(Request $request)
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
    public function getParamsSalas(Request $request)
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

        $salas = $request->salas;
        $formaId = $request->formaId;

        $departamentos = DB::table('departamentos as d')
            ->selectRaw('DISTINCT(d.id), d.nombre')
            ->join('resolutions as r', 'r.departamento_id', '=', 'd.id')
            ->whereIn('r.sala_id', $salas)
            ->where('r.forma_resolucion_id', $formaId)
            ->get();

        $magistrados = DB::table('magistrados as m')
            ->selectRaw('DISTINCT(m.id), m.nombre')
            ->join('resolutions as r', 'r.magistrado_id', '=', 'm.id')
            ->whereIn('r.sala_id', $salas)
            ->where('r.forma_resolucion_id', $formaId)
            ->get();

        $tipo_resolucions = DB::table('tipo_resolucions as tr')
            ->selectRaw('DISTINCT(tr.id), tr.nombre')
            ->join('resolutions as r', 'r.tipo_resolucion_id', '=', 'tr.id')
            ->whereIn('r.sala_id', $salas)
            ->where('r.forma_resolucion_id', $formaId)
            ->get();

        // Prepare the response data, excluding any fields with only one record
        $response = [];

        if ($departamentos->count() > 1) {
            $response['departamento'] = $departamentos;
        }

        if ($magistrados->count() > 1) {
            $response['magistrado'] = $magistrados;
        }

        if ($tipo_resolucions->count() > 1) {
            $response['tipo_resolucion'] = $tipo_resolucions;
        }

        return response()->json($response, 200);
    }

    // $tipo_jurisprudencia = DB::table('jurisprudencias as j')
    //     ->select('j.tipo_jurisprudencia as nombre', DB::raw('MIN(j.id) as id'))
    //     ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
    //     ->whereIn('r.sala_id', $salas)
    //     ->where('r.forma_resolucion_id', $formaId)
    //     ->whereNotNull('j.tipo_jurisprudencia')
    //     ->groupBy('j.tipo_jurisprudencia')
    //     ->get();

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




}
