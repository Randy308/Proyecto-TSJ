<?php

namespace App\Jobs;

use App\Models\Mapeo;
use App\Models\Notification;
use App\Models\ResuelveDecision;
use App\Models\ResuelveFondo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Log;


class ImportDecisionesChunk implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $uniqueFor = 3600;

    private $chunk;
    private $userId;
    private $salaId;
    /**
     * Create a new job instance.
     */
    public function __construct(
        $chunk,
        $userId,
        $salaId
    ) {
        $this->chunk = $chunk;
        $this->userId = $userId;
        $this->salaId = $salaId;
    }

    /**
     * Execute the job.
     */

    public $tries = 1; // no reintentar, ya que los errores se manejan por fila

    public function handle(): void
    {
        $filasExitosas = 0;
        $filasOmitidas = 0;

        $resolutionMap = [];
        $resuelveFondoMap = [];

        $this->chunk->each(function (array $row) use (&$resolutionMap, &$resuelveFondoMap, &$filasExitosas, &$filasOmitidas) {
            $idResolucion = $row['id'] ?? null;

            // Fila vacía o solo contiene ID
            // if (!$idResolucion || array_keys(array_filter($row, fn($v) => $v !== null && $v !== '')) === ['id']) {
            //     Log::warning("Fila omitida: vacía o solo contiene ID [id={$idResolucion}]");
            //     $filasOmitidas++;
            //     return;
            // }

            // Resolución ya procesada
            if (isset($resolutionMap[$idResolucion])) {
                Log::warning("Fila omitida: resolución externa ya procesada [id={$idResolucion}]");
                $filasOmitidas++;
                return;
            }

            // Buscar mapeo
            $mapeo = Mapeo::where('external_id', $idResolucion)->first();
            if (!$mapeo) {
                Log::warning("Fila omitida: no se encontró mapeo para resolución externa [id={$idResolucion}]");
                $filasOmitidas++;
                return;
            }

            $resolutionId = $mapeo->resolution_id;
            $resolutionMap[$idResolucion] = $resolutionId;

            // Evitar duplicados
            if (ResuelveDecision::where('resolution_id', $resolutionId)->exists()) {
                Log::warning("Fila omitida: resolución ya tiene una entrada en ResuelveDecision [resolution_id={$resolutionId}]");
                $filasOmitidas++;
                return;
            }

            // Sanitizar campos
            $tipo = $this->sanitizeNumber($row['tipo'] ?? null);
            $decision = $this->sanitizeNumber($row['decision'] ?? null);
            $observacionTipo = $this->sanitize($row['observacion_tipo'] ?? null);
            $observacionDecision = $this->sanitize($row['observacion_decision'] ?? null);

            // Buscar o crear ResuelveFondo
            $resuelveFondo = $resuelveFondoMap[$this->salaId][$tipo] ?? null;

            if (!$resuelveFondo) {
                $resuelveFondo = ResuelveFondo::where('sala_id', $this->salaId)
                    ->where('tipo_decision', $tipo)
                    ->first();

                if (!$resuelveFondo) {
                    $resuelveFondo = ResuelveFondo::updateOrCreate(
                        [
                            'sala_id' => $this->salaId,
                            'tipo_decision' => $tipo,
                            'observaciones' => $observacionTipo,
                            'nombre'=>$tipo
                        ],
                        []
                    );
                }

                if (!$resuelveFondo || !$resuelveFondo->id) {
                    Log::error("No se pudo crear o encontrar ResuelveFondo [id_externa={$idResolucion}, tipo={$tipo}]");
                    $filasOmitidas++;
                    return;
                }

                $resuelveFondoMap[$this->salaId][$tipo] = $resuelveFondo;
            }

            // Crear relación
            ResuelveDecision::create([
                'resolution_id' => $resolutionId,
                'resuelve_fondo_id' => $resuelveFondo->id,
                'nombre' => $decision,
                'tipo' => $decision,
                'observaciones' => $observacionDecision,
            ]);

            $filasExitosas++;
        });

        // Notificación
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
