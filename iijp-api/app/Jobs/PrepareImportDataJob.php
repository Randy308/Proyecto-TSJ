<?php

namespace App\Jobs;

use App\Models\CategoriaResolucion;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Magistrados;
use App\Models\Sala;
use App\Models\TipoResolucions;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Spatie\SimpleExcel\SimpleExcelReader;
use App\Jobs\ImportCsv;

class PrepareImportDataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $filePath;
    protected int $userId;

    public function __construct(string $filePath, int $userId)
    {
        $this->filePath = $filePath;
        $this->userId = $userId;
    }

    public function handle(): void
    {
        $fullPath = storage_path('app/' . $this->filePath);

        try {
            $rows = SimpleExcelReader::create($fullPath)
                ->getRows();

            $departamentos = $rows->pluck('departamento')->unique()->toArray();
            $salas = $rows->pluck('sala')->unique()->toArray();
            $tipoResoluciones = $rows->pluck('tipo_resolucion')->unique()->toArray();
            $magistrados = $rows->pluck('magistrado')->unique()->toArray();
            $formasResolucion = $rows->pluck('forma_resolucion')->unique()->toArray();
            $categoriasResolucion = $rows->pluck('categoria')->unique()->toArray();

            $maps = [
                'departamento' => $this->addModel(Departamentos::class, $departamentos),
                'sala' => $this->addModel(Sala::class, $salas),
                'tipoResolucion' => $this->addModel(TipoResolucions::class, $tipoResoluciones),
                'magistrado' => $this->addModel(Magistrados::class, $magistrados),
                'formaResolucion' => $this->addModel(FormaResolucions::class, $formasResolucion),
                'categoria_resolucion' => $this->addCategoria(CategoriaResolucion::class, $categoriasResolucion, 'S/N'),
            ];

            $cleanRows = $rows->map(function ($row) use ($maps) {
                return [
                    'departamento_id' => $maps['departamento'][$row['departamento']] ?? null,
                    'sala_id' => $maps['sala'][$row['sala']] ?? null,
                    'categoria_resolucion_id' => $maps['categoria_resolucion'][$row['categoria']] ?? null,
                    'tipo_resolucion_id' => $maps['tipoResolucion'][$row['tipo_resolucion']] ?? null,
                    'magistrado_id' => $maps['magistrado'][$row['magistrado']] ?? null,
                    'forma_resolucion_id' => $maps['formaResolucion'][$row['forma_resolucion']] ?? null,
                    'nro_resolucion' => $row['nro_resolucion'] ?? null,
                    'nro_expediente' => $row['nro_expediente'] ?? null,
                    'fecha_emision' => $this->parseDate($row['fecha_emision'] ?? null),
                    'fecha_publicacion' => $this->parseDate($row['fecha_publicacion'] ?? null),
                    'proceso' => $this->sanitize($row['proceso'] ?? null),
                    'precedente' => $this->sanitize($row['precedente'] ?? null),
                    'demandante' => $this->sanitize($row['demandante'] ?? null),
                    'demandado' => $this->sanitize($row['demandado'] ?? null),
                    'maxima' => $this->sanitize($row['maxima'] ?? null),
                    'sintesis' => $this->sanitize($row['sintesis'] ?? null),
                    'contenido' => $row['contenido'] ?? '',
                    'id' => $row['id'] ?? null,
                ];
            })->toArray();

            if (empty($cleanRows)) {
                Log::warning('No hay filas válidas después de la limpieza.');
                return;
            }

            // Guardar nuevo archivo CSV con IDs mapeados
            $newCsvName = 'importado_' . now()->format('Ymd_His') . '.csv';
            $csv = fopen('php://temp', 'r+');

            // Escribir encabezado
            fputcsv($csv, array_keys($cleanRows[0]));

            // Escribir cada fila
            foreach ($cleanRows as $row) {
                fputcsv($csv, $row);
            }

            rewind($csv);
            $csvContent = stream_get_contents($csv);
            fclose($csv);

            Storage::disk('local')->put($newCsvName, $csvContent);

            Log::info("Archivo procesado y convertido: $newCsvName");

            // Disparar importación final
            ImportCsv::dispatch($newCsvName, $this->userId);
        } catch (\Exception $e) {
            Log::error('Error procesando datos para importación: ' . $e->getMessage());
        }
    }

    private function addCategoria(string $model, array $value, $default = 'Desconocido'): ?array
    {
        $map = [];
        foreach ($value as $val) {
            try {
                $val = is_string($val) ? trim($val) : $default;
                $val = $val === '' ? $default : $val;

                $instance = $model::firstOrCreate(['slug' => $val, 'nombre' => $val]);

                if (!$instance || !$instance->id) {
                    Log::error("No se pudo crear o encontrar {$model} con {$val}");
                    return null;
                }

                $map[$val] = $instance->id;
            } catch (\Exception $e) {
                Log::error("Error creando {$model} con {$val}: " . $e->getMessage());
                return null;
            }
        }

        return $map;
    }

    private function addModel(string $model, array $value, $default = 'Desconocido'): ?array
    {
        $map = [];
        foreach ($value as $val) {
            try {
                $val = is_string($val) ? trim($val) : $default;
                $val = $val === '' ? $default : $val;

                $instance = $model::firstOrCreate(['nombre' => $val]);

                if (!$instance || !$instance->id) {
                    Log::error("No se pudo crear o encontrar {$model} con {$val}");
                    return null;
                }

                $map[$val] = $instance->id;
            } catch (\Exception $e) {
                Log::error("Error creando {$model} con {$val}: " . $e->getMessage());
                return null;
            }
        }

        return $map;
    }

    private function parseDate($value)
    {
        return $value && strtotime($value) ? date('Y-m-d', strtotime($value)) : null;
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
