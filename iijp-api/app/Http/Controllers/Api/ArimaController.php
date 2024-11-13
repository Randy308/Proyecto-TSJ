<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpArima\ArimaModel;
use PhpArima\ArmaMath;
use PhpArima\TimeSeries;

class ArimaController extends Controller
{
    function calcularMediaMovil($data, $window)
    {
        $keys = array_keys($data); // Obtener las claves originales
        $ma = [];

        for ($i = $window - 1; $i < count($keys); $i++) {
            $currentKey = $keys[$i];
            $windowKeys = array_slice($keys, $i - $window + 1, $window);

            // Sumar valores dentro de la ventana usando las claves originales
            $sum = 0;
            foreach ($windowKeys as $key) {
                $sum += $data[$key];
            }

            $ma[$currentKey] = $sum / $window;
        }

        return $ma;
    }

    function calcularMA($data, $window)
    {
        $keys = array_keys($data); // Obtener las claves originales
        $ma = [];

        // Ajustar el bucle para que empiece desde $window - 2
        for ($i = $window - 2; $i < count($keys); $i++) {
            // Obtener las claves de la ventana
            $windowKeys = array_slice($keys, $i - $window + 1, $window);

            // Sumar valores dentro de la ventana usando las claves originales
            $sum = 0;
            foreach ($windowKeys as $key) {
                $sum += $data[$key];
            }

            // Calcular el promedio
            $average = $sum / $window;

            // Reemplazar la clave del promedio con el índice ajustado
            $newKey = $keys[$i - $window + 2]; // Reemplaza la clave por $window - 2
            $ma[$newKey] = $average; // Asignar el promedio con la nueva clave
        }

        return $ma;
    }


    function modificarClaves($array, $window)
    {

        $newArray = [];
        $i = $window - 2;

        foreach ($array as $key => $value) {

            $newKey = intval($key) - ($window - 2);

            if ($newKey >= 0) {
                $newArray[$newKey] = $value;
            }
        }

        return $newArray;
    }
    function mediaMovilCentralizada($data, $windowSize)
    {
        $keys = array_keys($data);
        $n = count($data);
        $halfWindow = floor($windowSize / 2);
        $result = [];

        // Recorrer los datos para calcular la media móvil centrada
        foreach ($keys as $i => $key) {
            $sum = 0;
            $count = 0;

            // Calcular el inicio y fin de la ventana
            $start = max(0, $i - $halfWindow);
            $end = min($n - 1, $i + $halfWindow);

            // Sumar los valores dentro de la ventana centrada
            for ($j = $start; $j <= $end; $j++) {
                $sum += $data[$keys[$j]];
                $count++;
            }

            // Calcular el valor promedio de la ventana centrada
            $result[$key] = $sum / $count;
        }

        foreach ($result as $res) {
        }

        return $result;
    }
    public function obtenerIndicesEstacionarios($data, $media_movil_centralizada, $window)
    {
        // Ensure the arrays are not empty
        if (count($data) == 0 || count($media_movil_centralizada) == 0) {
            return [];
        }

        $last_index = count($data) - 1;
        $indices = [];

        // Fill missing values in the moving average array
        $media_movil_completa = ArimaController::rellenarFaltantes($media_movil_centralizada, $last_index);

        // Ensure both arrays have the same length
        if (count($data) == count($media_movil_completa)) {
            foreach ($data as $key => $value) {
                // Avoid division by zero
                if ($media_movil_completa[$key] != 0) {
                    $indices[$key] = $value / $media_movil_completa[$key];
                } else {
                    // Handle zero in moving average, can be set to 0, null, or skipped based on your requirement
                    $indices[$key] = 0; // or $indices[$key] = 0 or skip
                }
            }
        }

        $lista_indices = [];

        if (count($indices) > 0) {
            // Loop through the indices array
            $total_indices = count($indices);
            $num_grupos = ceil($total_indices / $window);
            for ($i = 0; $i < $window; $i++) {
                $suma = 0;
                $j = $i;
                while ($j < $total_indices) {
                    $suma += $indices[$j];
                    $j = $j + $window;
                }
                $lista_indices[] = $suma / $num_grupos;
            }
        }

        $suma = array_sum($lista_indices);
        if(  !$suma == $window){
            $correccion = $window/$suma;
            foreach($lista_indices as $mi_indice){
                $mi_indice = $mi_indice * $correccion;

            }
        }

        return $lista_indices;
    }


    public function rellenarFaltantes($media_movil_centralizada, $last_index, $first_index = 0, $value = 0)
    {
        $newArray = [];
        for ($i = $first_index; $i <= $last_index; $i++) {
            if (isset($media_movil_centralizada[$i])) {
                $newArray[$i] = $media_movil_centralizada[$i];
            } else {
                $newArray[$i] = $value;
            }
        }
        return $newArray;
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
            'fechaInicial' => "2012-01-01",
            'fechaFinal' => "2015-09-01",
            'magistradoId' => 1,
        ]);


        $window = 4;
        $data =  array_column($resolutions, "cantidad");

        $window = 4;

        $media_movil = ArimaController::calcularMediaMovil($data, $window);
        $media_movil = ArimaController::modificarClaves($media_movil, $window);
        // Aplicar media móvil centralizada
        $centered_window = $window % 2 == 0 ? 2 : 3;
        $media_movil_centrada = ArimaController::calcularMediaMovil($media_movil, $centered_window);
        $media_movil_centrada = ArimaController::modificarClaves($media_movil_centrada, $centered_window);

        $indices = ArimaController::obtenerIndicesEstacionarios($data, $media_movil_centrada, $window);
        return response()->json([
            'Media movil' => $media_movil,
            'Media movil centrada' => $media_movil_centrada,
            'Indices Estacionarios' => $indices
        ], 200);
        // Imprimir el resultado



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
