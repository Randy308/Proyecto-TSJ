<?php

namespace App\Jobs;

use App\Models\Jurisprudencia;
use App\Models\Mapeo;
use App\Models\Notification;
use App\Models\ResuelveDecision;
use App\Models\ResuelveFondo;
use App\Models\TipoJurisprudencia;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ImportJurisprudenciaChunk implements ShouldBeUnique, ShouldQueue
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

        $filasExitosas = 0;
        $resolutionMap = [];
        $tipoJurisprudenciaMap = [];
        $totalRecords = 0;
        $skippedRecords = 0;

        $this->chunk->each(function (array $row) use (&$resolutionMap, &$tipoJurisprudenciaMap, &$totalRecords, &$skippedRecords, &$filasExitosas) {
            $totalRecords++;

            $idResolucion = $row['id_resolucion'] ?? null;

            if (!$idResolucion || array_keys(array_filter($row, fn($v) => $v !== null && $v !== '')) === ['id_resolucion']) {
                $skippedRecords++;

                return;
            }

            // Obtener resolution_id desde mapeo (si aún no se tiene)
            if (!isset($resolutionMap[$idResolucion])) {
                $mapeo = Mapeo::where('external_id', $idResolucion)->first();
                if (!$mapeo) {
                    $skippedRecords++;

                    return;
                }
                $resolutionMap[$idResolucion] = $mapeo->resolution_id;
            }

            // Sanitizar campos
            $restrictor = $this->sanitize($row['restrictor'] ?? null);
            $descriptor_id = $this->sanitize($row['descriptor_id'] ?? null);
            $root_id = $this->sanitize($row['root_id'] ?? null);
            $descriptor = $this->sanitize($row['descriptor'] ?? null);
            $ratio = $this->sanitize($row['ratio'] ?? null);
            $tipoNombre = $this->sanitize($row['tipo_jurisprudencia'] ?? null);

            // Obtener tipo_jurisprudencia_id
            $tipoJurisprudenciaId = $this->getOrCreateId(TipoJurisprudencia::class, 'nombre', $tipoNombre, $tipoJurisprudenciaMap);

            // Verificar duplicados
            $exists = Jurisprudencia::where('resolution_id', $resolutionMap[$idResolucion])
                ->where('restrictor', $restrictor)
                ->where('descriptor', $descriptor)
                ->where('tipo_jurisprudencia_id', $tipoJurisprudenciaId)
                ->where('ratio', $ratio)
                ->exists();

            if ($exists) {
                $skippedRecords++;

                return;
            }

            Jurisprudencia::create([
                'resolution_id' => $resolutionMap[$idResolucion],
                'descriptor' => $descriptor,
                'descriptor_id' => $descriptor_id,
                'restrictor' => $restrictor,
                'root_id' => $root_id,
                'tipo_jurisprudencia_id' => $tipoJurisprudenciaId,
                'ratio' => $ratio,
            ]);
            $filasExitosas++;
        });

        Notification::create([
            'user_id' => $this->userId,
            'mensaje' => $filasExitosas > 0
                ? "La tarea finalizó: {$filasExitosas} resoluciones guardadas, {$skippedRecords} filas omitidas."
                : 'La tarea finalizó sin resoluciones guardadas. Todas las filas fueron omitidas.',
        ]);
    }


    public function uniqueId(): string
    {
        return Str::uuid()->toString();
    }

    private function getOrCreateId($model, string $field, ?string $value, array &$map): ?int
    {
        $value = $value ? trim($value) : 'Desconocido';

        if (isset($map[$value])) {
            return $map[$value];
        }

        try {
            // Log::info("Buscando o creando {$model} con {$field} = {$value}");

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


    private function sanitize($value)
    {
        if (is_string($value)) {
            $trimmed = trim($value);

            return $trimmed === '' ? null : $trimmed;
        }

        return $value;
    }

    public function sanitizeNumber($value, $default = 999)
    {
        // Elimina espacios en blanco
        $value = trim((string) $value);

        // Si está vacío o no es numérico, retorna el valor por defecto
        if ($value === '' || !is_numeric($value)) {
            return $default;
        }

        // Si es un número entero (opcional: puedes convertir explícitamente)
        return (int) $value;
    }
}
