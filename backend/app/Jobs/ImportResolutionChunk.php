<?php

namespace App\Jobs;

use App\Models\Content;
use App\Models\Mapeo;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Resolution;
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

    public $tries = 1; // no reintentar, ya que los errores se manejan por fila

    public function handle(): void
    {
        $totalFilas = 0;
        $filasOmitidas = 0;
        $filasExitosas = 0;

        $this->chunk->each(function (array $row) use (&$totalFilas, &$filasOmitidas, &$filasExitosas) {
            $totalFilas++;

            // Evitar duplicados
            if (Mapeo::where('external_id', $row['id'])->exists()) {
                $filasOmitidas++;
                return;
            }

            try {
                // Validación básica de campos mínimos requeridos
                if (empty($row['nro_resolucion']) || empty($row['fecha_emision'])) {
                    Log::warning('Fila omitida por datos mínimos faltantes.', ['row' => $row]);
                    $filasOmitidas++;
                    return;
                }

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

                $filteredData = Arr::where($data, fn($value) => !is_null($value) && $value !== '');

                // Crear resolución
                $resolution = Resolution::withoutSyncingToSearch(function () use ($filteredData) {
                    return Resolution::create($filteredData);
                });

                if (!$resolution) {
                    $filasOmitidas++;
                    return;
                }

                // Asociar contenido y mapeo
                Content::create([
                    'contenido' => $row['contenido'] ?? '',
                    'resolution_id' => $resolution->id,
                ]);

                Mapeo::create([
                    'external_id' => $row['id'],
                    'resolution_id' => $resolution->id,
                ]);

                $resolution->searchable();
                $filasExitosas++;
            } catch (\Throwable $e) {
                $filasOmitidas++;

                Log::error('Error al procesar fila', [
                    'mensaje' => $e->getMessage(),
                    'row_id' => $row['id'] ?? null,
                    'trace' => substr($e->getTraceAsString(), 0, 1000),
                ]);
            }
        });

        Notification::create([
            'user_id' => $this->userId,
            'mensaje' => $filasExitosas > 0
                ? "La tarea finalizó: {$filasExitosas} resoluciones guardadas, {$filasOmitidas} filas omitidas."
                : 'La tarea finalizó sin resoluciones guardadas. Todas las filas fueron omitidas.',
        ]);
    }


    public function uniqueId(): string
    {
        return Str::uuid()->toString();
    }
}
