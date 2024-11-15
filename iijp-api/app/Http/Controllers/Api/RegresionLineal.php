<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpArima\ArimaModel;

class RegresionLineal extends Controller
{
    //

    public function multiplicarListas($list_y, $list_x)
    {
        $lista = [];
        if (count($list_y) == count($list_x)) {
            foreach ($list_y as $key => $value) {
                $lista[$key] = $value * $list_x[$key];
            }
        }
        return $lista;
    }

    public function restar_media($list, $mean)
    {
        $sum = 0;
        foreach ($list as $value) {
            $sum += pow($value - $mean, 2);
        }
        return $sum;
    }

    public function regresion_lineal($array)
    {
        $n = count($array);
        $x = range(1, $n);
        $y = $array;

        $Sum_x = array_sum($x);
        $Sum_y = array_sum($y);
        $Sum_x_2 = array_sum($this->multiplicarListas($x, $x));
        $Sum_y_2 = array_sum($this->multiplicarListas($y, $y));
        $Sum_x_y = array_sum($this->multiplicarListas($x, $y));

        $denominador = ($n * $Sum_x_2) - pow($Sum_x, 2);

        if ($denominador != 0) {
            $a = (($Sum_y * $Sum_x_2) - ($Sum_x * $Sum_x_y)) / $denominador;
            $b = (($n * $Sum_x_y) - ($Sum_x * $Sum_y)) / $denominador;

            $mean_y = $Sum_y / $n;
            $y_pred = $this->get_predicted_array($x, $a, $b);

            $y_m = $this->restar_media($y, $mean_y);
            $y_pred_m = $this->restar_media($y_pred, $mean_y);

            $r = ($y_m != 0) ? $y_pred_m / $y_m : 0;

            return [
                'a' => $a,
                'b' => $b,
                'correlation_coefficient' => $r,
                'predicted_values' => $y_pred
            ];
        } else {
            throw new Exception("Denominator for calculating regression line is zero.");
        }
    }

    public function get_predicted_array($x, $a, $b)
    {
        $pred = [];
        foreach ($x as $key => $value) {
            $pred[$key] = $a + $b * $value;
        }
        return $pred;
    }


    public function get_predicted_array_completed($x, $a, $b, $periodo)
    {
        $pred = [];


        foreach ($x as $key => $value) {
            $pred[$key] = $a + $b * $value;
        }

        $n = count($x);
        $next_multiple = ceil($n / $periodo) * $periodo;

        for ($i = $n; $i < $next_multiple; $i++) {
            $pred[$i] = $a + $b * ($i + 1);
        }

        return $pred;
    }


    public function test_reg()
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
            'fechaInicial' => "2012-01-01",
            'fechaFinal' => "2015-09-01",
            'magistradoId' => 1,
        ]);


        $window = 4;
        $data =  array_column($resolutions, "cantidad");

        $order = array(2, 1, 2);

        $cut = 4;
        $train = array_slice($data, 0, count($data) - $cut);
        $test = array_slice($data, -$cut);


        $prediction = ArimaModel::auto_arima($train, $cut);

        // Calculate Mean Absolute Error (MAE)
        $mae = 0;
        for ($i = 0; $i < count($test); $i++) {
            $mae += abs($test[$i] - $prediction[$i]);
        }
        $mae /= count($test);

        // Calculate Mean Squared Error (MSE)
        $mse = 0;
        for ($i = 0; $i < count($test); $i++) {
            $mse += pow($test[$i] - $prediction[$i], 2);
        }
        $mse /= count($test);

        // Calculate Root Mean Squared Error (RMSE)
        $rmse = sqrt($mse);

        return response()->json([
            'prediction' => $prediction,
            'test' => $test,
            'mae' => $mae,
            'mse' => $mse,
            'rmse' => $rmse
        ], 200);
    }
}
