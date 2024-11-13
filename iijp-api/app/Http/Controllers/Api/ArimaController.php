<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpArima\ArimaModel;
use PhpArima\ArmaMath;




class ArimaController extends Controller
{
    //
    function mediaMovilCentralizada($data, $windowSize)
    {
        $n = count($data);
        $halfWindow = floor($windowSize / 2);
        $result = [];



        // Recorrer los datos para calcular la media móvil
        for ($i = 0; $i < $n; $i++) {
            $sum = 0;
            $count = 0;

            // Calcular el inicio y fin de la ventana
            $start = max(0, $i - $halfWindow);
            $end = min($n - 1, $i + $halfWindow);

            // Sumar los valores dentro de la ventana
            for ($j = $start; $j <= $end; $j++) {
                $sum += $data[$j];
                $count++;
            }

            // Calcular el valor promedio de la ventana
            $result[] = $sum / $count;
        }

        return $result;
    }

    public function test_arima()
    {


        $query = "
            SELECT
                series::date AS periodo,
                COALESCE(COUNT(r.id), 0) AS cantidad
            FROM
                generate_series(:fechaInicial::date, :fechaFinal::date, '1 MONTH'::INTERVAL) AS series
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
            'fechaInicial' => "2009-01-01",
            'fechaFinal' => "2016-04-01",
            'magistradoId' => 5,
        ]);
        $window = 4;
        $data =  array_column($resolutions, "cantidad");

        $ma = [];

        for ($i = $window; $i < count($data); $i++) {
            $ma[$i] = array_sum(array_slice($data, $i - $window, $window)) / $window;
        }




        return $ma;

        $data =  array_column($resolutions, "cantidad");

        $lags = (count($data)) > 300 ? round(log(count($data))) :  round(sqrt(count($data)));


        $arma_math = new ArmaMath();
        $acf = $arma_math->autocorData($data, $lags);
        $pacf = $arma_math->parautocorData($data, $lags);
        return response()->json([
            'acf' => ArimaController::addXAxis($acf),
            'pacf' => ArimaController::addXAxis($pacf)
        ], 200);
        //$order = array(1, 1, 1);
    }

    function addXAxis(array $lista, int $start = 0): array
    {
        return array_map(
            fn($index, $item) => [$index + $start, $item],
            array_keys($lista),
            $lista
        );
    }
}
