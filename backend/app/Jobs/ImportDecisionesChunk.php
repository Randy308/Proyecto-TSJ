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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        $totalFilas = 0;
        $filasOmitidas = 0;
        $filasExitosas = 0;


        $resolutionMap = [];
        $resuelveFondoMap = [];

        $this->chunk->each(function (array $row) use (&$resolutionMap, &$resuelveFondoMap, &$sala, &$totalRecords, &$skippedRecords) {
            $totalRecords++;

            $idResolucion = $row['id'] ?? null;

            if (!$idResolucion || array_keys(array_filter($row, fn($v) => $v !== null && $v !== '')) === ['id']) {
                $skippedRecords++;
                return;
            }
            if (isset($resolutionMap[$idResolucion])) {
                $skippedRecords++;
                return;
            }

            $mapeo = Mapeo::where('external_id', $idResolucion)->first();
            if (!$mapeo) {
                $skippedRecords++;
                return;
            }


            $resolutionMap[$idResolucion] = $mapeo->resolution_id;

            $exists = ResuelveDecision::where('resolution_id', $resolutionMap[$idResolucion])->exists();

            if ($exists) {
                $skippedRecords++;
                return;
            }


            // Sanitizar campos
            $tipo = $this->sanitizeNumber($row['tipo'] ?? null);
            $decision = $this->sanitizeNumber($row['decision'] ?? null);
            $observacion_tipo = $this->sanitize($row['observacion_tipo'] ?? null);
            $observacion_decision = $this->sanitize($row['observacion_decision'] ?? null);


            $exists = ResuelveFondo::where('sala_id', $sala->id)->where("tipo_decision", $tipo)->get();

            // Obtener tipo_jurisprudencia_id
            $instance = ResuelveFondo::updateOrCreate(
                [
                    'sala_id' => $sala->id,
                    'observaciones' => $observacion_tipo,
                    'tipo_decision' => $tipo
                ],
                []
            );
            if (!$instance || !$instance->id) {
                Log::error("No se pudo crear o encontrar ResuelveFondo con {$row['nombre']}");

                return;
            }


            ResuelveDecision::create([
                'resolution_id' => $resolutionMap[$idResolucion],
                'resuelve_fondo_id' => $instance->id,
                'nombre' => $decision,
                'tipo' =>  $decision,
                'observaciones' => $observacion_decision
            ]);
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
