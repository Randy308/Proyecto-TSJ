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
    public function obtenerEstadisticasXYZ(Request $request){

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $departamentos = Departamentos::select('nombre as departamento')->get();
        $tipos = TipoResolucions::select('nombre as tipo')->get();

        // Extract values as arrays
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
        return $combinations;
    }
    public function obtenerEstadisticasXY(Request $request)
    {

        $salas = Salas::select('nombre as sala')->whereIn('id', $request->salas)->get();
        $departamentos = Departamentos::select('nombre as departamento')->get();
        $lista = [];

        $mayor = sizeof($departamentos) > sizeof($salas) ? $departamentos : $salas;
        $menor = sizeof($departamentos) > sizeof($salas) ? $salas : $departamentos;

        foreach ($mayor as $itemMayor) {
            foreach ($menor as $itemMenor) {
                $lista[] = [
                    "cantidad" => 0,
                    "sala" => $itemMayor->sala ?? $itemMenor->sala,
                    "departamento" => $itemMayor->departamento ?? $itemMenor->departamento
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

        foreach ($lista as &$item) {
            foreach ($datos as $dato) {
                if ($item['sala'] == $dato->sala && $item['departamento'] == $dato->departamento) {
                    $item['cantidad'] = $dato->cantidad;
                    break;
                }
            }
        }

        usort($lista, function ($a, $b) {
            return $a['departamento'] > $b['departamento'];
        });

        return response()->json($lista, 200);
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
