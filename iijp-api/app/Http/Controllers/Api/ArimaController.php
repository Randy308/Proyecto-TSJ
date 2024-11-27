<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use DateInterval;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
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
        $i = floor($window / 2);

        foreach ($array as $key => $value) {

            $newKey = intval($key) - $i;

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
        $correccion = 1;
        if ($suma != $window) {
            $correccion = $window / $suma;
            foreach ($lista_indices as $key => $mi_indice) {
                $lista_indices[$key] = $mi_indice * $correccion;
            }
        }

        return $lista_indices;
    }


    public function rellenarFaltantes($lista, $last_index, $first_index = 0, $value = 0)
    {
        $newArray = [];
        for ($i = $first_index; $i <= $last_index; $i++) {
            if (isset($lista[$i])) {
                $newArray[$i] = $lista[$i];
            } else {
                $newArray[$i] = $value;
            }
        }
        return $newArray;
    }


    public function obtenerSerieTemporal(Request $request)


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

        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');
        $intervalo = $request->input('intervalo');

        $intervalo = "quarter";
        $validIntervals = ['day', 'month', 'year', 'week', 'quarter'];
        if (!in_array($intervalo, $validIntervals)) {
            throw new InvalidArgumentException("Invalid interval specified.");
        }

        $query = DB::table('resolutions AS r')
            ->selectRaw('COUNT(r.id) AS cantidad');

        switch ($intervalo) {
            case 'day':
                $query->selectRaw('DATE(r.fecha_emision) AS periodo');
                $query->groupBy(DB::raw('DATE(r.fecha_emision)'));
                $query->orderBy(DB::raw('DATE(r.fecha_emision)'));
                break;
            case 'week':
                $query->selectRaw('DATE_TRUNC(\'week\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'week\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'week\', r.fecha_emision)::date'));
                break;
            case 'month':
                $query->selectRaw('DATE_TRUNC(\'month\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'month\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'month\', r.fecha_emision)::date'));
                break;
            case 'quarter':

                $query->selectRaw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date'));
                break;
            case 'year':

                $query->selectRaw('DATE_TRUNC(\'year\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'year\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'year\', r.fecha_emision)::date'));
                break;
        }


        if ($request->has('limite')) {
            $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 2005');
        }
        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 1999');
        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) < 2025');
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
        if ($request->has('departamento')) {
            $query->where('r.departamento_id', $request->departamento);
        }

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipo_jurisprudencia = $request->tipo_jurisprudencia ?? 'all';
            $materia = $request->materia ?? 'all';

            $query->join(DB::raw("(SELECT resolution_id FROM jurisprudencias
            WHERE ('{$tipo_jurisprudencia}' = 'all' OR tipo_jurisprudencia = '{$tipo_jurisprudencia}')
            AND ('{$materia}' = 'all' OR descriptor LIKE '{$materia}%')) AS j"), 'j.resolution_id', '=', 'r.id');
        }

        $resolutions = $query->get();

        $cantidad = $resolutions->pluck('cantidad')->toArray();
        $periodo = $resolutions->pluck('periodo')->toArray();
        sort($periodo);

        $intervalMap = [
            'day' => 'P1D',
            'week' => 'P7D',
            'month' => 'P1M',
            'quarter' => 'P3M',
            'year' => 'P1Y',
        ];

        $intervalo = $intervalMap[$intervalo] ?? null;

        if ($intervalo) {
            $inicio = new DateTime(reset($periodo));
            $fin = new DateTime(end($periodo));
            $rangoFechas = [];
            $resultado = [];

            while ($inicio <= $fin) {
                $rangoFechas[] = $inicio->format('Y-m-d');
                $inicio->add(new DateInterval($intervalo));
            }

            foreach ($rangoFechas as $fecha) {
                $key = array_search($fecha, $periodo);
                if ($key !== false) {
                    $resultado[] = [
                        'periodo' => $fecha,
                        'cantidad' => $cantidad[$key],
                    ];
                } else {
                    $resultado[] = [
                        'periodo' => $fecha,
                        'cantidad' => 0,
                    ];
                }
            }
        }

        $periodoCompleto = array_column($resultado, 'periodo');
        $cantidadCompleta = array_column($resultado, 'cantidad');

        $window = 4;
        return [
            'cantidad' => $cantidadCompleta,
            'periodo' => $periodoCompleto,
            'window' => $window,
            'prediccion' => 3,
        ];
    }


    public function crearMatrix($resolutions){
        $result = $resolutions->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();
        return $result;
    }

    public function realizar_prediccion(Request $request)
    {

        $serie_temporal =  ArimaController::obtenerSerieTemporal($request);
        //return $serie_temporal;
        $data = array_map('intval', $serie_temporal['cantidad']);
        $periodos = $serie_temporal['periodo'];
        $window = $serie_temporal['window'];
        $cantidad_predecir = $serie_temporal['prediccion'];

        $media_movil = ArimaController::calcularMediaMovil($data, $window);
        $media_movil = ArimaController::modificarClaves($media_movil, $window);

        $centered_window = $window % 2 == 0 ? 2 : 3;
        $media_movil_centrada = ArimaController::calcularMediaMovil($media_movil, $centered_window);
        $media_movil_centrada = ArimaController::modificarClaves($media_movil_centrada, $centered_window);

        $indices = ArimaController::obtenerIndicesEstacionarios($data, $media_movil_centrada, $window);


        $regresion_lineal = new RegresionLineal;
        $regresion = $regresion_lineal->regresion_lineal($data);

        $a = $regresion['a'];
        $b = $regresion['b'];

        $y_pred = $regresion_lineal->get_predicted_array_completed($data, $a, $b, $cantidad_predecir);


        $lastDate = new DateTime(end($periodos));

        $missingPeriods = count($y_pred) - count($periodos);

        if (!empty($periodos)) {
            // Calcular la variación entre los periodos
            foreach ($periodos as $key => $value) {
                if (isset($periodos[$key + 1])) {
                    $fechaActual = new DateTime($value);
                    $fechaSiguiente = new DateTime($periodos[$key + 1]);

                    // Calcular la diferencia en meses
                    $diff = $fechaActual->diff($fechaSiguiente);
                    $variacion[$key] = $diff->m + ($diff->y * 12); // Meses totales
                }
            }

            // Comprobar si todas las variaciones son iguales
            $intervaloConsistente = count(array_unique($variacion)) === 1 ? $variacion[0] : null;

            if ($intervaloConsistente !== null) {
                // Convertir la última fecha en `periodos` a un objeto DateTime
                $lastDate = new DateTime(end($periodos));

                // Agregar las fechas faltantes según el intervalo consistente
                for ($i = 0; $i < $missingPeriods; $i++) {
                    $lastDate->add(new DateInterval("P{$intervaloConsistente}M"));
                    $periodos[] = $lastDate->format('Y-m-d');
                }
            } else {
                throw new Exception("Los intervalos entre periodos no son consistentes.");
            }
        }

        $y_pred_multiplied = [];
        $indices_count = count($indices);

        for ($i = 0; $i < count($y_pred); $i++) {

            $index = $indices[$i % $indices_count];
            $y_pred_multiplied[$i] = ceil($y_pred[$i] * $index);
        }

        return response()->json([
            'original' => $data,
            'periodo' => $periodos,
            'prediccion' => $y_pred_multiplied,
            'Media movil centrada' => $media_movil_centrada,
            'Indices Estacionarios' => $indices
        ], 200);
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

        $order = array(2, 1, 2);

        $cut = 4;
        $train = array_slice($data, 0, count($data) - $cut);
        $test = array_slice($data, -$cut);

        $window = 12;

        $media_movil = ArimaController::calcularMediaMovil($data, $window);
        $media_movil = ArimaController::modificarClaves($media_movil, $window);
        // Aplicar media móvil centralizada
        $centered_window = $window % 2 == 0 ? 2 : 3;
        $media_movil_centrada = ArimaController::calcularMediaMovil($media_movil, $centered_window);
        $media_movil_centrada = ArimaController::modificarClaves($media_movil_centrada, $centered_window);

        $indices = ArimaController::obtenerIndicesEstacionarios($data, $media_movil_centrada, $window);


        $regresion_lineal = new RegresionLineal;
        $regresion = $regresion_lineal->regresion_lineal($data);
        $a = $regresion['a'];
        $b = $regresion['b'];

        $y_pred = $regresion_lineal->get_predicted_array_completed($data, $a, $b, $window);


        $y_pred_multiplied = [];
        $indices_count = count($indices);

        for ($i = 0; $i < count($y_pred); $i++) {
            // Use modulo to loop through indices if $y_pred is larger than $indices
            $index = $indices[$i % $indices_count];
            $y_pred_multiplied[$i] = $y_pred[$i] * $index;
        }

        return response()->json([
            'serie original' => $data,
            'y_pred_multiplied' => $y_pred_multiplied,
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
