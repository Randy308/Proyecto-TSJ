<?php

namespace App\Jobs;

use App\Models\Contents;
use App\Models\Mapeos;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Resolutions;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ImportResolutionChunk implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $uniqueFor = 3600;

    private $chunk;
    private $userId;
    /**
     * Create a new job instance.
     */
    public function __construct(
        $chunk,
        $userId
    ) {
        $this->chunk = $chunk;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $totalFilas = 0;

        $filasOmitidas = 0;

        $this->chunk->each(function (array $row)  use (&$totalFilas, &$filasOmitidas) {


            $totalFilas++;
            if (Mapeos::where('external_id', $row['id'])->exists()) {
                $filasOmitidas++;

                return;
            }

            try {
                // Construye el arreglo con todos los campos posibles
                $data = [
                    'departamento_id' => $row['departamento_id'] ?? null,
                    'sala_id' => $row['sala_id'] ?? null,
                    'categoria_resolucion_id' => $row['categoria_resolucion_id'] ?? null,
                    'tipo_resolucion_id' => $row['tipo_resolucion_id'] ?? null,
                    'magistrado_id' => $row['magistrado_id'] ?? null,
                    'forma_resolucion_id' => $row['forma_resolucion_id'] ?? null,
                    'nro_resolucion' => $row['nro_resolucion'] ?? null,
                    'nro_expediente' => $row['nro_expediente'] ?? null,
                    'fecha_emision' => $row['fecha_emision'] ?? null,
                    'fecha_publicacion' => $row['fecha_publicacion'] ?? null,
                    'proceso' => $row['proceso'] ?? null,
                    'precedente' => $row['precedente'] ?? null,
                    'demandante' => $row['demandante'] ?? null,
                    'demandado' => $row['demandado'] ?? null,
                    'maxima' => $row['maxima'] ?? null,
                    'sintesis' => $row['sintesis'] ?? null,
                ];

                // Elimina claves con valores null o vacíos
                $filteredData = Arr::where($data, fn($value) => !is_null($value) && $value !== '');

                // Crear la resolución
                $resolution = Resolutions::withoutSyncingToSearch(fn() => Resolutions::create($filteredData));

                if (!$resolution) {
                    return;
                }
                Contents::create([
                    'contenido' => $row['contenido'] ?? '',
                    'resolution_id' => $resolution->id,
                ]);

                Mapeos::create([
                    'external_id' => $row['id'],
                    'resolution_id' => $resolution->id,
                ]);

                $resolution->searchable();
            } catch (\Exception $e) {
                Log::error('Error al procesar fila', [
                    'error' => substr($e->getMessage(), 0, 800),
                ]);

                $filasOmitidas++;
            }
        });

        Notification::create([
            'user_id' => $this->userId,
            'mensaje' => $totalFilas > 0
                ? "La tarea finalizó con éxito. {$totalFilas} resoluciones nuevas, se omitieron {$filasOmitidas}."
                : 'El scraping finalizó sin nuevas resoluciones, se omitieron todas las filas.',
        ]);
    }

    public function uniqueId(): string
    {
        return Str::uuid()->toString();
    }
}
