<?php

namespace App\Jobs;

use App\Models\{Contents, Departamentos, FormaResolucions, Jurisprudencias, Magistrados, Mapeos, Resolutions, Salas, Temas, TipoResolucions};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\Exception\{TransportExceptionInterface, ClientExceptionInterface, ServerExceptionInterface};
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WebScrappingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $iterations;
    protected int $lastId;

    public function __construct(int $iterations, int $lastId)
    {
        $this->iterations = $iterations;
        $this->lastId = $lastId;
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
        $maps = [
            'departamento' => [],
            'sala' => [],
            'tipoResolucion' => [],
            'magistrado' => [],
            'formaResolucion' => [],
            'temas' => []
        ];

        for ($i = $this->lastId; $i < $this->lastId + $this->iterations; $i++) {
            if ($errorCount > $maxErrors) {
                Log::warning("Demasiados errores consecutivos. Deteniendo proceso.");
                break;
            }

            try {
                usleep(random_int(500000, 2000000)); // Reducir el tiempo de espera para mayor eficiencia
                $response = $httpClient->request('GET', "https://jurisprudencia.tsj.bo/jurisprudencia/$i");

                if ($response->getStatusCode() !== 200) {
                    throw new \Exception("Error HTTP " . $response->getStatusCode());
                }

                $data = $response->toArray();
                if (empty($data['resolucion'])) {
                    Log::warning("No se encontró resolución para ID: $i");
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
                    $this->crearJurisprudencia($res, $data['temas']);
                }

                DB::commit();
                $errorCount = 0;
            } catch (TransportExceptionInterface | ClientExceptionInterface | ServerExceptionInterface | \Exception $e) {
                Log::error("Error al procesar ID $i: " . $e->getMessage());
                DB::rollBack();
                $errorCount++;
            }
        }
    }

    private function prepareResolutionData(array $resolucion, array &$maps): array
    {
        return array_filter([
            'magistrado_id' => $this->getOrCreateId(Magistrados::class, 'nombre', $resolucion['magistrado'], $maps['magistrado']),
            'forma_resolucion_id' => $this->getOrCreateId(FormaResolucions::class, 'nombre', $resolucion['forma_resolucion'], $maps['formaResolucion']),
            'sala_id' => $this->getOrCreateId(Salas::class, 'nombre', $resolucion['sala'], $maps['sala']),
            'departamento_id' => $this->getOrCreateId(Departamentos::class, 'nombre', $resolucion['departamento'], $maps['departamento']),
            'tipo_resolucion_id' => $this->getOrCreateId(TipoResolucions::class, 'nombre', $resolucion['tipo_resolucion'], $maps['tipoResolucion']),
            'nro_resolucion' => $resolucion['nro_resolucion'] ?? null,
            'nro_expediente' => $resolucion['nro_expediente'] ?? null,
            'fecha_emision' => $this->formatDate($resolucion['fecha_emision'] ?? null),
            'fecha_publicacion' => $this->formatDate($resolucion['fecha_publicacion'] ?? null),
            'proceso' => $resolucion['proceso'] ?? null,
            'precedente' => $resolucion['precedente'] ?? null,
            'demandante' => $resolucion['demandante'] ?? null,
            'demandado' => $resolucion['demandado'] ?? null,
            'maxima' => $resolucion['maxima'] ?? null,
            'sintesis' => $resolucion['sintesis'] ?? null,
            'tema_id' => $this->getTemaId($resolucion['id_tema'] ?? null, $maps['temas'])
        ], fn($value) => !is_null($value));
    }

    private function storeRelatedData(Resolutions $res, array $resolucion, array &$maps): void
    {
        try {
            Contents::create(['contenido' => $resolucion['contenido'], 'resolution_id' => $res->id]);
            Mapeos::create(['external_id' => $resolucion['id'], 'resolution_id' => $res->id]);
            if($resolucion['restrictor'] != null){
                Jurisprudencias::create([
                    'resolution_id' => $res->id,
                    'restrictor' => $resolucion['restrictor'],
                    'descriptor' => $resolucion['descriptor'] ?? null,
                    'tipo_jurisprudencia' => $resolucion['tipo_jurisprudencia'] ?? null,
                    'ratio' => $resolucion['ratio'] ?? null,
                ]);
            }

        } catch (\Exception $e) {
            Log::error("Error al almacenar datos relacionados para resolución {$res->id}: " . $e->getMessage());
        }
    }

    private function getOrCreateId($model, string $field, ?string $value, array &$map): ?int
    {
        if (!$value) return null;
        return $map[$value] ??= $model::firstOrCreate([$field => $value])->id;
    }


    private function getTemaId(?int $temaID, array &$map): ?int
    {
        if (!$temaID) return null;

        return $map[$temaID] ??= optional(Temas::find($temaID))->id;
    }


    private function formatDate(?string $date): ?string
    {
        return ($date && strtotime($date)) ? date('Y-m-d', strtotime($date)) : null;
    }

    private function crearJurisprudencia($resolucion, $temas): void
    {
        try {
            $jurisprudencias = array_map(fn($jurisprudencia) => [
                'resolution_id' => $resolucion->id,
                'restrictor' => $jurisprudencia['restrictor'] ?? null,
                'descriptor' => $jurisprudencia['descriptor'] ?? null,
                'tipo_jurisprudencia' => $jurisprudencia['tipo_jurisprudencia'] ?? null,
                'ratio' => $jurisprudencia['ratio'] ?? null,
            ], $temas);

            Jurisprudencias::insert($jurisprudencias);
        } catch (\Exception $e) {
            Log::error("Error al crear jurisprudencias para resolución {$resolucion->id}: " . $e->getMessage());
        }
    }
}
