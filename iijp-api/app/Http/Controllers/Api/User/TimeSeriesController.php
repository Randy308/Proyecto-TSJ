<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Magistrados;
use App\Models\Salas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class TimeSeriesController extends Controller
{
    //
    public function getDecomposition($id)
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
    public function seasonalDecompose($series, $model = "additive", $windowSize = 4, $seasonalPeriods = 4)
    {
        // Validate model parameter
        if (!in_array($model, ["additive", "multiplicative"])) {
            throw new InvalidArgumentException("Model must be either 'additive' or 'multiplicative'.");
        }

        // Convert the series to an array
        $seriesArray = array_values($series);

        // Calculate trend using rolling mean
        $trend = array_map(function ($i) use ($seriesArray, $windowSize) {
            // Get the window of values
            $window = array_slice($seriesArray, max(0, $i - floor($windowSize / 2)), min($windowSize, count($seriesArray) - $i + floor($windowSize / 2)));
            // Calculate the mean
            return array_sum($window) / count($window);
        }, range(0, count($seriesArray)));

        // Calculate seasonal component
        $seasonal = array_fill(0, count($seriesArray), 0);
        for ($i = 0; $i < count($seriesArray); $i++) {
            $filteredArray = array_filter($seriesArray, function ($key) use ($i, $seasonalPeriods) {
                return ceil(($key + 1) / $seasonalPeriods) === ceil(($i + 1) / $seasonalPeriods);
            });

            // Verificar que count($filteredArray) no sea cero antes de dividir
            $seasonal[$i] = count($filteredArray) > 0 ? array_sum($filteredArray) / count($filteredArray) : 0;
        }



        if ($model == "multiplicative") {
            // Replace 0s with null for division
            $trend = array_map(function ($value) {
                return $value === 0 ? null : $value;
            }, $trend);
            $seasonal = array_map(function ($i) use ($seriesArray, $trend) {
                return $trend[$i] === null ? null : $seriesArray[$i] / $trend[$i];
            }, range(0, count($seriesArray)));
            $residual = array_map(function ($i) use ($seriesArray, $trend, $seasonal) {
                return ($trend[$i] === null || $seasonal[$i] === null) ? null : $seriesArray[$i] / ($trend[$i] * $seasonal[$i]);
            }, range(0, count($seriesArray)));
        } else { // additive
            $residual = array_map(function ($i) use ($seriesArray, $trend, $seasonal) {
                return $seriesArray[$i] - $trend[$i] - $seasonal[$i];
            }, range(0, count($seriesArray)));
        }

        // Handle any remaining NaN values (e.g., edge effects from rolling mean)
        $trend = array_map(function ($i) use (&$trend) {
            return $trend[$i] === null ? (isset($trend[$i + 1]) ? $trend[$i + 1] : (isset($trend[$i - 1]) ? $trend[$i - 1] : 0)) : $trend[$i];
        }, range(0, count($trend)));
        $seasonal = array_map(function ($value) {
            return $value === null ? 0 : $value;
        }, $seasonal);
        $residual = array_map(function ($value) {
            return $value === null ? 0 : $value;
        }, $residual);

        return [$trend, $seasonal, $residual];
    }

    public function obtenerSerieTemporal($id)
    {

        $magistrado = Magistrados::where('id', $id)->firstOrFail();
        $datos = DB::table('resolutions as r')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                DB::raw('MAX(r.fecha_emision) as fecha_max'),
                DB::raw('MIN(r.fecha_emision) as fecha_min')
            )
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->get();
        $fecha_final = max($datos->pluck('fecha_max')->toArray());
        $fecha_inicial = min($datos->pluck('fecha_min')->toArray());
        $query = "
        SELECT

            series::date AS periodo,
            TO_CHAR(series::date, 'TMMonth') AS fecha,
            COALESCE(COUNT(r.magistrado_id), 0) AS cantidad
        FROM
            generate_series(:fechaInicial::date, :fechaFinal::date, '1 month'::INTERVAL) AS series
        LEFT JOIN resolutions r
            ON EXTRACT(YEAR FROM r.fecha_emision) = EXTRACT(YEAR FROM series::date)
            AND EXTRACT(MONTH FROM r.fecha_emision) = EXTRACT(MONTH FROM series::date)
            AND r.magistrado_id = :magistradoId
        GROUP BY
            periodo
        ORDER BY
            periodo;
    ";




        $resolutions = DB::select($query, [
            'fechaInicial' => $fecha_inicial,
            'fechaFinal' => $fecha_final,
            'magistradoId' => $magistrado->id,
        ]);

        $cantidades = array_column($resolutions, 'cantidad');
        foreach ($cantidades as $item) {
            if ($item <= 0) {
                $item = 0.01;
            }
        }
        return TimeSeriesController::seasonalDecompose($cantidades);
    }
}
