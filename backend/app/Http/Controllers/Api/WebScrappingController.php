<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcesarLotes;
use App\Models\Mapeo;
use App\Models\Resolution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class WebScrappingController extends Controller
{

    public function intToRoman(int $num): string
    {
        if ($num <= 0) {
            return ''; // Roman numerals do not represent zero or negative numbers
        }

        $lookup = [
            1000 => 'M',
            900 => 'CM',
            500 => 'D',
            400 => 'CD',
            100 => 'C',
            90 => 'XC',
            50 => 'L',
            40 => 'XL',
            10 => 'X',
            9 => 'IX',
            5 => 'V',
            4 => 'IV',
            1 => 'I'
        ];

        $result = '';
        foreach ($lookup as $value => $roman) {
            while ($num >= $value) {
                $result .= $roman;
                $num -= $value;
            }
        }
        return $result;
    }

    public function testeo()
    {

        $sala_id = request()->input("sala_id", 2);


        $page = request()->input("page", 1);
        $perPage = request()->input("offset", 10);

        $count = Resolution::where('sala_id', $sala_id)->count();


        $result = DB::select('SELECT * FROM get_contenidos_por_sala(?, ?, ?)', [$sala_id, $page, $perPage]);


        $todosTitulos = []; // Array global para todos los títulos


        foreach ($result as $rowIndex => $row) {
            $titulos = [];
            $lastTitulo = null; // Último título procesado
            $indices = [];

            $bloques = json_decode($row->bloques, true);
            $contadorTitulos = []; // Contador para títulos repetidos por fila

            foreach ($bloques as $index => $bloque) {
                $bloque = trim($bloque);

                // Regex para capturar títulos hasta \t, \n, \r, . , .- o :
                if (preg_match('/^([A-Z0-9ÁÉÍÓÚÑ\s\.\,\-\(\)\/]+?)(?:\t|\n|\r|\.\s|\.\-|:|\))/u', $bloque, $matches)) {
                    $titulo = trim($matches[1]);
                } else {

                    if (preg_match('/^\p{Lu}[\p{Lu}\sÁÉÍÓÚÜÑ]*$/u', $bloque)) {
                        $titulo = $bloque;
                    } elseif (mb_strlen($bloque) <= 50) {
                        $titulo = $bloque;
                    } else {
                        $titulo = explode(" ", $bloque)[0];
                    }
                }

                // Manejar títulos repetidos dentro de la misma fila
                if (isset($contadorTitulos[$titulo])) {
                    $contadorTitulos[$titulo]++;
                    $romanNumeral = $this->intToRoman($contadorTitulos[$titulo]);
                    $tituloUnico = $titulo . '.' . $romanNumeral;
                } else {
                    $contadorTitulos[$titulo] = 0;
                    $tituloUnico = $titulo;
                }


                $titulos[$index] = $tituloUnico;

                // --- Bucle adicional: agregar al array global ---
                if (!isset($todosTitulos[$tituloUnico])) {
                    $todosTitulos[$tituloUnico] = 1;
                } else {
                    $todosTitulos[$tituloUnico]++;
                }


                if (preg_match('/^[IVXLCDM]+(?:\.\d+)*$/', $titulo)) {
                    $indices[$index] = $lastTitulo;
                } else {
                    $indices[$index] = 0;
                    $lastTitulo = $titulo;
                }
                $special_chars_to_remove = "#$%^&*()-+="; // Add all special characters you want to remove
                $bloques[$index] = ltrim(trim(substr($bloque, strlen($titulo) + 1)), $special_chars_to_remove);
                // --- fin del bucle adicional ---
            }

            $row->bloques = $bloques;
            $row->titulos = $titulos;
            $row->indices = $indices;
        }

        // Ahora $todosTitulos contiene todos los títulos únicos de todas las filas

        return response()->json(['message' => 'Funciona correctamente', 'data' => $result, 'total' => $count, 'last_page' => ceil($count / $perPage)]);
    }
    public function buscarResolucionesTSJ(Request $request)
    {

        $user = Auth::user();

        if (! $user) { // Verifica si el usuario no está autenticado
            return response()->json(['mensaje' => 'El usuario no está autenticado'], 403);
        }

        if (! $user->hasPermissionTo('web_scrapping')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario'], 403);
        }

        if (DB::table('jobs')->where('payload', 'like', '%WebScrappingJob%')->exists()) {
            return response()->json(['message' => 'El Web Scraping ya se está ejecutando.'], 409);
        }

        $httpClient = HttpClient::create([
            'verify_peer' => false,
            'verify_host' => false,
            'timeout' => 10,
        ]);

        $lastId = Mapeo::max('external_id');
        $errorCount = 0;
        $maxErrors = 10;
        $iterations = 10;
        $counts = 0;
        $ultimaRes = $lastId;
        $maxRequests = 25; // Límite de intentos
        $requestCount = 0;

        while ($requestCount < $maxRequests) {
            if ($errorCount > $maxErrors) {
                Log::warning('Demasiados errores consecutivos. Deteniendo proceso.');
                break;
            }

            try {
                $i = $iterations + $lastId;
                usleep(random_int(500000, 2000000));

                $response = $httpClient->request('GET', "https://jurisprudencia.tsj.bo/jurisprudencia/$i");

                if ($response->getStatusCode() !== 200) {
                    throw new \Exception('Error HTTP ' . $response->getStatusCode());
                }

                $data = $response->toArray();
                if (! empty($data['resolucion'])) {
                    $counts++;
                    $ultimaRes = $i;
                    $iterations += 20;
                    $errorCount = 0; // Reiniciar contador de errores
                } else {
                    $errorCount++;
                    $iterations += ($errorCount >= 3) ? 50 : 20;
                }
            } catch (TransportExceptionInterface | ClientExceptionInterface | ServerExceptionInterface | \Exception $e) {
                Log::error("Error al procesar ID $i: " . $e->getMessage());
                $errorCount++;

                if ($errorCount > $maxErrors) {
                    Log::error('Se alcanzó el número máximo de errores. Proceso detenido.');
                    break;
                }
            }

            $requestCount++;
        }

        if ($counts > 0) {
            return response()->json([
                'message' => 'Se han encontrado nuevas resoluciones.',
                'cantidad' => $ultimaRes - $lastId,
            ]);
        } else {
            return response()->json(['message' => 'No existen nuevas resoluciones.'], 409);
        }
    }

    public function obtenerResolucionesTSJ(Request $request)
    {

        $user = Auth::user();

        if (! $user) { // Verifica si el usuario no está autenticado
            return response()->json(['mensaje' => 'El usuario no está autenticado'], 403);
        }

        if (! $user->hasPermissionTo('realizar_web_scrapping')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario'], 403);
        }

        $isRunning = DB::table('jobs')->where('payload', 'like', '%WebScrappingJob%')->exists();

        if ($isRunning) {
            return response()->json(['message' => 'El Web Scraping ya se está ejecutando.'], 409);
        }

        $iterations = 200;
        $lastId = Mapeo::max('external_id') ?: 0;
        $lastId = $lastId + 1; // Asegura que lastId sea al menos 1
        $userId = $user->id;
        // Log::info("Búsqueda iniciada");
        ProcesarLotes::dispatch($iterations, $lastId, $userId);

        return response()->json(['message' => 'Web Scraping iniciado.']);
    }
}
