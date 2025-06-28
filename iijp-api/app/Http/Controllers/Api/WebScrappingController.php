<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Jobs\ProcesarLotes;
use App\Jobs\WebScrappingJob;
use App\Models\Mapeos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\{TransportExceptionInterface, ClientExceptionInterface, ServerExceptionInterface};

class WebScrappingController extends Controller
{
    public function buscarResolucionesTSJ(Request $request)
    {

        $user = Auth::user();

        if (!$user) { // Verifica si el usuario no está autenticado
            return response()->json(['mensaje' => "El usuario no está autenticado"], 403);
        }

        if (!$user->hasPermissionTo('web_scrapping')) {
            return response()->json(['mensaje' => "El usuario no cuenta con el permiso necesario"], 403);
        }


        if (DB::table('jobs')->where('payload', 'like', '%WebScrappingJob%')->exists()) {
            return response()->json(['message' => 'El Web Scraping ya se está ejecutando.'], 409);
        }

        $httpClient = HttpClient::create([
            'verify_peer' => false,
            'verify_host' => false,
            'timeout' => 10,
        ]);

        $lastId = Mapeos::max('external_id');
        $errorCount = 0;
        $maxErrors = 10;
        $iterations = 10;
        $counts = 0;
        $ultimaRes = $lastId;
        $maxRequests = 25; // Límite de intentos
        $requestCount = 0;

        while ($requestCount < $maxRequests) {
            if ($errorCount > $maxErrors) {
                Log::warning("Demasiados errores consecutivos. Deteniendo proceso.");
                break;
            }

            try {
                $i = $iterations + $lastId;
                usleep(random_int(500000, 2000000));

                $response = $httpClient->request('GET', "https://jurisprudencia.tsj.bo/jurisprudencia/$i");

                if ($response->getStatusCode() !== 200) {
                    throw new \Exception("Error HTTP " . $response->getStatusCode());
                }

                $data = $response->toArray();
                if (!empty($data['resolucion'])) {
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
                    Log::error("Se alcanzó el número máximo de errores. Proceso detenido.");
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

        if (!$user) { // Verifica si el usuario no está autenticado
            return response()->json(['mensaje' => "El usuario no está autenticado"], 403);
        }

        if (!$user->hasPermissionTo('realizar_web_scrapping')) {
            return response()->json(['mensaje' => "El usuario no cuenta con el permiso necesario"], 403);
        }


        $isRunning = DB::table('jobs')->where('payload', 'like', '%WebScrappingJob%')->exists();

        if ($isRunning) {
            return response()->json(['message' => 'El Web Scraping ya se está ejecutando.'], 409);
        }

        $iterations = 200;
        $lastId = Mapeos::max('external_id') ?: 0;
        $lastId = $lastId + 1; // Asegura que lastId sea al menos 1
        $userId = $user->id;
        //Log::info("Búsqueda iniciada");
        ProcesarLotes::dispatch($iterations, $lastId, $userId);

        return response()->json(['message' => 'Web Scraping iniciado.']);
    }
}
