<?php

namespace App\Jobs;

use App\Models\{Contents, Departamentos, Descriptor, FormaResolucions, Jurisprudencias, Magistrados, Mapeos, Notification, Resolutions, Sala, Tema, TipoJurisprudencia, TipoResolucions};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\{TransportExceptionInterface, ClientExceptionInterface, ServerExceptionInterface};

class ProcesarWebScrapping implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $end;
    protected int $lastId;
    protected int $userId;
    protected string $jobId;
    protected int $iterations; // Número de resoluciones a procesar por lote

    protected $httpClient;
    public function __construct($lote)
    {
        $this->end = $lote['end'];
        $this->lastId = $lote['start'];
        $this->userId = $lote['user_id'];
        $this->jobId = $lote['job_id'];
        $this->iterations = $lote['batch_size'] ?? 10; // Tamaño del lote por defecto
        $this->httpClient = HttpClient::create([

            'timeout' => 30,
            'verify_peer' => true,      // Verifica el certificado del peer
            'verify_host' => true,      // Verifica que el hostname coincida
            'cafile' => base_path('cacert.pem'),
        ]);
    }

    public function handle(): void
    {



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

        for ($i = $this->lastId; $i <= $this->end; $i++) {
            if ($errorCount > $maxErrors) {
                Log::warning("[{$this->jobId}] Demasiados errores consecutivos. Deteniendo proceso.");
                break;
            }

            try {
                usleep(random_int(4000000, 10000000));
                Log::info("[{$this->jobId}] Procesando resolución con ID $i");

                $response = $this->httpClient->request('GET', "https://jurisprudencia.tsj.bo/jurisprudencia/$i");
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
                $res_data = $this->prepareResolutionData($resolucion, $maps, $this->userId);
                $res = Resolutions::create($res_data);
                $this->storeRelatedData($res, $resolucion, $maps);

                if (!empty($data['temas'])) {
                    $this->agregarJurisprudencias($res, $data['temas'], $maps);
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

    private function prepareResolutionData(array $resolucion, array &$maps, int $id): array
    {
        return array_filter([
            'magistrado_id' => $this->getOrCreateId(Magistrados::class, 'nombre', $resolucion['magistrado'] ?? null, $maps['magistrado']),
            'forma_resolucion_id' => $this->getOrCreateId(FormaResolucions::class, 'nombre', $resolucion['forma_resolucion'] ?? null, $maps['formaResolucion']),
            'sala_id' => $this->getOrCreateId(Sala::class, 'nombre', $resolucion['sala'] ?? null, $maps['sala']),
            'departamento_id' => $this->obtenerDepartamentoId(Departamentos::class, 'nombre', $resolucion['departamento'] ?? null, $maps['departamento']),
            'tipo_resolucion_id' => $this->getOrCreateId(TipoResolucions::class, 'nombre', $resolucion['tipo_resolucion'] ?? null, $maps['tipoResolucion']),
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
            'user_id' => $id,
        ], fn($value) => !is_null($value));
    }

    private function storeRelatedData(Resolutions $res, array $resolucion, array &$maps): void
    {
        try {
            Contents::create(['contenido' => $this->sanitize($resolucion['contenido'] ?? null), 'resolution_id' => $res->id]);
            Mapeos::create(['external_id' => $resolucion['id'], 'resolution_id' => $res->id]);

            $this->crearJurisprudencia($res, $resolucion, $maps);
        } catch (\Exception $e) {
            Log::error("[{$this->jobId}] Error al almacenar datos relacionados para resolución {$res->id}: " . $e->getMessage());
        }
    }

    private function crearJurisprudencia(Resolutions $res, array $resolucion, array &$maps): void
    {


        if (empty($resolucion)) {
            return;
        }

        try {
            $restrictor = $this->sanitize($resolucion['restrictor'] ?? null);
            $ratio = $this->sanitize($resolucion['ratio'] ?? null);
            $tipoJurisprudencia = $this->sanitize($resolucion['tipo_jurisprudencia'] ?? null);
            $descriptor = $this->sanitize($resolucion['descriptor'] ?? null);

            if ($restrictor == null && $ratio === null && $tipoJurisprudencia === null && $descriptor === null) {
                Log::info("[{$this->jobId}] No se creará jurisprudencia para resolución {$res->id} debido a datos vacíos.");
                return;
            }
            if (Jurisprudencias::where('resolution_id', $res->id)->where('restrictor', $restrictor)->exists()) {
                Log::info("[{$this->jobId}] Jurisprudencia ya existe para resolución {$res->id} con restrictor {$restrictor}");
                return;
            }
            //Log::info("jurisprudencia valida");


            $variables = explode('/', $descriptor, 2);

            Jurisprudencias::create([
                'resolution_id' => $res->id,
                'restrictor' => $restrictor,
                'descriptor' => $descriptor,
                'tipo_jurisprudencia_id' => $this->getOrCreateId(TipoJurisprudencia::class, 'nombre', $tipoJurisprudencia, $maps['tipoJurisprudencia']),
                'ratio' => $ratio,
                'root_id' => $this->getOrCreateId(Descriptor::class, 'nombre',  $variables[0] ?? 'Desconocido', $maps['temas']),
                'descriptor_id' => $this->getOrCreateDescriptor($descriptor, $maps['temas']),
            ]);
        } catch (\Exception $e) {
            Log::error("[{$this->jobId}] Error al crear jurisprudencia: " . $e->getMessage());
        }
    }
    private function agregarJurisprudencias(Resolutions $res, array $temas, array &$maps): void
    {
        foreach ($temas as $tema) {
            $this->crearJurisprudencia($res, $tema, $maps);
        }
    }


    private function getOrCreateDescriptor($descriptor, array &$map): ?int
    {
        $id = null;
        $pieces = explode("/", $descriptor);

        foreach ($pieces as $piece) {
            $piece = trim($piece);
            if (empty($piece)) {
                continue;
            }

            if (isset($map[$piece])) {
                $id = $map[$piece];
                continue;
            }

            try {
                //Log::info("Procesando getOrCreateId para Descriptor con nombre = {$piece}");

                $instance = Descriptor::firstOrCreate(['nombre' => $piece, 'descriptor_id' => $id]);
                if (!$instance || !$instance->id) {
                    Log::error("No se pudo crear o encontrar descriptor: {$piece}");
                    return null;
                }
                $id = $instance->id;
                $map[$piece] = $id;
            } catch (\Exception $e) {
                Log::error("Error creando descriptor {$piece}: " . $e->getMessage());
                return null;
            }
        }

        return $id;
    }

    private function getOrCreateId($model, string $field, ?string $value, array &$map): ?int
    {
        $value = $value ? trim($value) : 'Desconocido';

        if (isset($map[$value])) {
            return $map[$value];
        }
        //Log::info("Procesando getOrCreateId para {$model} con {$field} = {$value}");

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

    private function obtenerDepartamentoId($model , string $field, ?string $value, array &$map): ?int
    {
        $value = $value ? trim($value) : 'Desconocido';

        $lista = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'];
        if (!$value || !in_array($value, $lista)) {
            $value = 'Desconocido';
        }

        if (isset($map[$value])) {
            return $map[$value];
        }

        try {

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
