<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Jurisprudencias;
use App\Models\Magistrados;
use App\Models\Mapeos;
use App\Models\Resolutions;
use App\Models\Sala;
use App\Models\Tema;
use App\Models\TipoJurisprudencia;
use App\Models\TipoResolucions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\SimpleExcel\SimpleExcelReader;

class ExcelController extends Controller
{

    public function upload_jurisprudencia(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('subir_jurisprudencia')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario.'], 403);
        }

        $file = $request->file('excelFile');
        if (!$file) {
            return response()->json(['error' => 'No se proporcionó un archivo.'], 400);
        }

        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, ['csv', 'xls', 'xlsx'])) {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }

        try {
            $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')->getRows();

            $resolutionMap = [];
            $tipoJurisprudenciaMap = [];
            $totalRecords = 0;
            $skippedRecords = 0;

            $rows->each(function (array $row) use (&$resolutionMap, &$tipoJurisprudenciaMap, &$totalRecords, &$skippedRecords) {
                $totalRecords++;

                $idResolucion = $row['id_resolucion'] ?? null;

                if (!$idResolucion || array_keys(array_filter($row, fn($v) => $v !== null && $v !== '')) === ['id_resolucion']) {
                    $skippedRecords++;
                    return;
                }

                // Obtener resolution_id desde mapeo (si aún no se tiene)
                if (!isset($resolutionMap[$idResolucion])) {
                    $mapeo = Mapeos::where('external_id', $idResolucion)->first();
                    if (!$mapeo) {
                        $skippedRecords++;
                        return;
                    }
                    $resolutionMap[$idResolucion] = $mapeo->resolution_id;
                }

                // Sanitizar campos
                $restrictor = $this->sanitize($row['restrictor_id'] ?? null);
                $descriptor_id = $this->sanitize($row['descriptor_id'] ?? null);
                $root_id = $this->sanitize($row['root_id'] ?? null);
                $descriptor = $this->sanitize($row['descriptor'] ?? null);
                $ratio = $this->sanitize($row['ratio'] ?? null);
                $tipoNombre = $this->sanitize($row['tipo_jurisprudencia'] ?? null);

                // Obtener tipo_jurisprudencia_id
                $tipoJurisprudenciaId = $this->getOrCreateId(TipoJurisprudencia::class, 'nombre', $tipoNombre, $tipoJurisprudenciaMap);

                // Verificar duplicados
                $exists = Jurisprudencias::where('resolution_id', $resolutionMap[$idResolucion])
                    ->where('restrictor_id', $restrictor)
                    ->where('descriptor', $descriptor)
                    ->where('tipo_jurisprudencia_id', $tipoJurisprudenciaId)
                    ->where('ratio', $ratio)
                    ->exists();

                if ($exists) {
                    $skippedRecords++;
                    return;
                }

                Jurisprudencias::create([
                    'resolution_id' => $resolutionMap[$idResolucion],
                    'descriptor' => $descriptor,
                    'descriptor_id' => $descriptor_id,
                    'restrictor_id' => $restrictor,
                    'root_id'=> $root_id,
                    'tipo_jurisprudencia_id' => $tipoJurisprudenciaId,
                    'ratio' => $ratio,
                ]);
            });

            return response()->json([
                'mensaje' => 'Carga completada exitosamente.',
                'success' => true,
                'total_records' => $totalRecords,
                'skipped_records' => $skippedRecords,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al procesar jurisprudencia: ' . $e->getMessage());
            return response()->json(['error' => 'Ocurrió un error al procesar el archivo.', 'detalles' => $e->getMessage()], 500);
        }
    }


    public function upload(Request $request)
    {
        // Verificación de permisos
        if (!Auth::user()->hasPermissionTo('subir_jurisprudencia')) {
            return response()->json(['success' => false, 'mensaje' => 'El usuario no cuenta con el permiso necesario'], 403);
        }

        // Validación de archivo
        $file = $request->file('excelFile');
        if (!$file) {
            return response()->json(['error' => 'No se proporcionó un archivo.'], 400);
        }

        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, ['csv', 'xls', 'xlsx'])) {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }

        try {
            $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')->getRows();

            $maps = [
                'departamento' => [],
                'sala' => [],
                'tipoResolucion' => [],
                'magistrado' => [],
                'formaResolucion' => [],
                'temas' => []
            ];

            $totalFilas = 0;
            $filasOmitidas = 0;

            $rows->each(function (array $row) use (&$maps, &$totalFilas, &$filasOmitidas) {
                $totalFilas++;

                if (Mapeos::where('external_id', $row['id'])->exists()) {
                    $filasOmitidas++;
                    return;
                }

                try {
                    $data = [
                        'magistrado_id'       => $this->getOrCreateId(Magistrados::class, 'nombre', $row['magistrado'], $maps['magistrado']),
                        'forma_resolucion_id' => $this->getOrCreateId(FormaResolucions::class, 'nombre', $row['forma_resolucion'], $maps['formaResolucion']),
                        'sala_id'             => $this->getOrCreateId(Sala::class, 'nombre', $row['sala'], $maps['sala']),
                        'departamento_id'     => $this->getOrCreateId(Departamentos::class, 'nombre', $row['departamento'], $maps['departamento']),
                        'tipo_resolucion_id'  => $this->getOrCreateId(TipoResolucions::class, 'nombre', $row['tipo_resolucion'], $maps['tipoResolucion']),
                        'tema_id'             => $row['id_tema'] ? $this->getTemaId($row['id_tema'], $maps['temas']) : null,
                        'fecha_emision'       => $this->parseDate($row['fecha_emision'] ?? null),
                        'fecha_publicacion'   => $this->parseDate($row['fecha_publicacion'] ?? null),
                        'nro_resolucion'      => $this->sanitize($row['nro_resolucion'] ?? null),
                        'nro_expediente'      => $this->sanitize($row['nro_expediente'] ?? null),
                        'proceso'             => $this->sanitize($row['proceso'] ?? null),
                        'precedente'          => $this->sanitize($row['precedente'] ?? null),
                        'demandante'          => $this->sanitize($row['demandante'] ?? null),
                        'demandado'           => $this->sanitize($row['demandado'] ?? null),
                        'maxima'              => $this->sanitize($row['maxima'] ?? null),
                        'sintesis'            => $this->sanitize($row['sintesis'] ?? null),
                    ];

                    $data = array_filter($data, fn($value) => !is_null($value));

                    $resolution = Resolutions::create($data);

                    Contents::create([
                        'contenido' => $row['contenido'] ?? '',
                        'resolution_id' => $resolution->id,
                    ]);

                    Mapeos::create([
                        'external_id' => $row['id'],
                        'resolution_id' => $resolution->id,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error al procesar fila', [
                        'fila' => $row,
                        'error' => $e->getMessage(),
                    ]);
                    $filasOmitidas++;
                }
            });

            return response()->json([
                'success' => true,
                'mensaje' => 'Procesamiento completado exitosamente.',
                'total_filas' => $totalFilas,
                'filas_omitidas' => $filasOmitidas
            ]);
        } catch (\Exception $e) {
            Log::error('Error al leer archivo: ' . $e->getMessage());
            return response()->json(['error' => 'Ocurrió un error al procesar los datos.', 'detalles' => $e->getMessage()], 500);
        }
    }

    // Métodos auxiliares

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

    private function getTemaId($temaID, &$map)
    {
        if (!isset($map[$temaID])) {
            $tema = Tema::find($temaID);
            if ($tema) {
                $map[$temaID] = $tema->id;
            }
        }
        return $map[$temaID] ?? null;
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
