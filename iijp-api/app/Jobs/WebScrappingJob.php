<?php

namespace App\Jobs;

use App\Models\{Contents, Departamentos, FormaResolucions, Jurisprudencias, Magistrados, Mapeos, Notification, Resolutions, Sala, Tema, TipoJurisprudencia, TipoResolucions};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\{TransportExceptionInterface, ClientExceptionInterface, ServerExceptionInterface};

class WebScrappingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $iterations;
    protected int $lastId;
    protected int $userId;
    protected string $jobId;

    public function __construct(int $iterations, int $lastId, int $userId)
    {
        $this->iterations = $iterations;
        $this->lastId = $lastId;
        $this->userId = $userId;
        $this->jobId = uniqid('scrape_', true);
    }

    public function handle(): void
    {
        $httpClient = HttpClient::create([
            'verify_peer' => false,
            'verify_host' => false,
            'timeout' => 10,
        ]);

        $errorCount = 0;
        $maxErrors = 30;
        $omitidas = 0;
        $exitosos = 0;
        $maps = [
            'departamento' => [],
            'sala' => [],
            'tipoResolucion' => [],
            'magistrado' => [],
            'formaResolucion' => [],
            'tipoJurisprudencia' => [],
            'temas' => []
        ];

        for ($i = $this->lastId; $i < $this->lastId + $this->iterations; $i++) {
            if ($errorCount > $maxErrors) {
                Log::warning("[{$this->jobId}] Demasiados errores consecutivos. Deteniendo proceso.");
                break;
            }

            try {
                usleep(random_int(4000000, 7000000));
                Log::info("[{$this->jobId}] Procesando ID $i");

                $response = $httpClient->request('GET', "https://jurisprudencia.tsj.bo/jurisprudencia/$i");
                $status = $response->getStatusCode();

                if ($status === 404) {
                    Log::notice("[{$this->jobId}] Resolución ID $i no existe (404)");
                    continue;
                }

                if ($status !== 200) {
                    throw new \Exception("HTTP $status");
                }

                $data = $response->toArray();
                if (empty($data['resolucion'])) {
                    Log::warning("[{$this->jobId}] No se encontró resolución para ID: $i");
                    $errorCount++;
                    continue;
                }

                $resolucion = $data['resolucion'];
                if (Mapeos::where('external_id', $resolucion['id'])->exists()) {
                    $omitidas++;
                    continue;
                }

                DB::beginTransaction();
                $res_data = $this->prepareResolutionData($resolucion, $maps);
                $res = Resolutions::create($res_data);
                $this->storeRelatedData($res, $resolucion, $maps);

                if (!empty($data['temas'])) {
                    $this->crearJurisprudencia($res, $data['temas'], $maps);
                }

                DB::commit();
                $exitosos++;
                $errorCount = 0;
            } catch (TransportExceptionInterface | ClientExceptionInterface | ServerExceptionInterface | \Exception $e) {
                Log::error("[{$this->jobId}] Error al procesar ID $i: " . $e->getMessage());
                DB::rollBack();
                $errorCount++;
            }
        }

        Notification::create([
            'user_id' => $this->userId,
            'mensaje' => $exitosos > 0
                ? "El scraping finalizó con éxito. {$exitosos} resoluciones nuevas de {$this->iterations}."
                : "El scraping finalizó sin nuevas resoluciones.",
        ]);

        Log::info("[{$this->jobId}] Scraping finalizado");
    }

    private function prepareResolutionData(array $resolucion, array &$maps): array
    {
        return array_filter([
            'magistrado_id' => $this->getOrCreateId(Magistrados::class, 'nombre', $resolucion['magistrado'] ?? null, $maps['magistrado']),
            'forma_resolucion_id' => $this->getOrCreateId(FormaResolucions::class, 'nombre', $resolucion['forma_resolucion'] ?? null, $maps['formaResolucion']),
            'sala_id' => $this->getOrCreateId(Sala::class, 'nombre', $resolucion['sala'] ?? null, $maps['sala']),
            'departamento_id' => $this->getOrCreateId(Departamentos::class, 'nombre', $resolucion['departamento'] ?? null, $maps['departamento']),
            'tipo_resolucion_id' => $this->getOrCreateId(TipoResolucions::class, 'nombre', $resolucion['tipo_resolucion'] ?? null, $maps['tipoResolucion']),
            'tema_id' => $this->getTemaId($resolucion['id_tema'] ?? null, $maps['temas']),
            'fecha_emision' => $this->formatDate($resolucion['fecha_emision'] ?? null),
            'fecha_publicacion' => $this->formatDate($resolucion['fecha_publicacion'] ?? null),
            'nro_resolucion' => $this->sanitize($resolucion['nro_resolucion'] ?? null),
            'nro_expediente' => $this->sanitize($resolucion['nro_expediente'] ?? null),
            'proceso' => $this->sanitize($resolucion['proceso'] ?? null),
            'precedente' => $this->sanitize($resolucion['precedente'] ?? null),
            'demandante' => $this->sanitize($resolucion['demandante'] ?? null),
            'demandado' => $this->sanitize($resolucion['demandado'] ?? null),
            'maxima' => $this->sanitize($resolucion['maxima'] ?? null),
            'sintesis' =>  $this->sanitize($resolucion['sintesis'] ?? null),
        ], fn($value) => !is_null($value));
    }

    private function storeRelatedData(Resolutions $res, array $resolucion, array &$maps): void
    {
        try {
            Contents::create(['contenido' => $this->sanitize($resolucion['contenido'] ?? null), 'resolution_id' => $res->id]);
            Mapeos::create(['external_id' => $resolucion['id'], 'resolution_id' => $res->id]);

            $restrictor = $this->sanitize($resolucion['restrictor'] ?? null);
            if ($restrictor && !Jurisprudencias::where('resolution_id', $res->id)->where('restrictor', $restrictor)->exists()) {
                Jurisprudencias::create([
                    'resolution_id' => $res->id,
                    'restrictor' => $restrictor,
                    'descriptor' => $this->sanitize($resolucion['descriptor'] ?? null),
                    'tipo_jurisprudencia_id' => $this->getOrCreateId(TipoJurisprudencia::class, 'nombre', $resolucion['tipo_jurisprudencia'] ?? null, $maps['tipoJurisprudencia']),
                    'ratio' => $this->sanitize($resolucion['ratio'] ?? null),
                ]);
            }
        } catch (\Exception $e) {
            Log::error("[{$this->jobId}] Error al almacenar datos relacionados para resolución {$res->id}: " . $e->getMessage());
        }
    }

    private function crearJurisprudencia($resolucion, $temas, &$maps): void
    {


        try {
            foreach ($temas as $tema) {
                $restrictor = $this->sanitize($tema['restrictor'] ?? null);

                $tipoJurisprudenciaId = $this->getOrCreateId(TipoJurisprudencia::class, 'nombre', $tema['tipo_jurisprudencia'] ?? null, $maps['tipoJurisprudencia']);
               
                if ($restrictor && !Jurisprudencias::where('resolution_id', $resolucion->id)->where('restrictor', $restrictor)->exists()) {
                    Jurisprudencias::create([
                        'resolution_id' => $resolucion->id,
                        'restrictor' => $restrictor,
                        'descriptor' => $this->sanitize($tema['descriptor'] ?? null),
                        'tipo_jurisprudencia_id' => $tipoJurisprudenciaId,
                        'ratio' => $this->sanitize($tema['ratio'] ?? null),
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error("[{$this->jobId}] Error al crear jurisprudencia: " . $e->getMessage());
        }
    }

    private function getOrCreateId($model, string $field, ?string $value, array &$map): ?int
    {
        $value = $value ? trim($value) : 'Desconocido';

        if (isset($map[$value])) {
            return $map[$value];
        }

        try {
            //Log::info("Buscando o creando {$model} con {$field} = {$value}");

            $instance = $model::firstOrCreate([$field => $value]);

            if (!$instance || !$instance->id) {
                Log::error("No se pudo crear o encontrar {$model} con {$field} = {$value}");
                return null;
            }

            $map[$value] = $instance->id;
            return $map[$value];
        } catch (\Exception $e) {
            Log::error("Error creando {$model} con {$field} = {$value}: " . $e->getMessage());
            return null;
        }
    }




    private function getTemaId(?int $temaID, array &$map): ?int
    {
        return $temaID ? ($map[$temaID] ??= optional(Tema::find($temaID))->id) : null;
    }

    private function formatDate(?string $date): ?string
    {
        return ($date && strtotime($date)) ? date('Y-m-d', strtotime($date)) : null;
    }

    private function sanitize($value)
    {
        if (is_string($value)) {
            $trimmed = trim($value);
            return $trimmed === '' ? null : $trimmed;
        }

        return $value;
    }
}
