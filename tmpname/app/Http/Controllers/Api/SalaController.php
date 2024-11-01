<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resolutions;
use App\Models\Salas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalaController extends Controller
{

    public function getSalas()
    {

        try {
            $resultado = Salas::orderBy('id')->get();
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
