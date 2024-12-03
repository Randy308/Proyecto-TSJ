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
use App\Models\Salas;
use App\Models\Temas;
use App\Models\TipoResolucions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\SimpleExcel\SimpleExcelReader;

class ExcelController extends Controller
{

    public function upload_jurisprudencia(Request $request)
    {
        $response['success'] = false;

        $file = $request->file('excelFile');

        // Verificar permisos
        if (!Auth::user()->hasPermissionTo('subir_jurisprudencia')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario.'], 403);
        }

        // Validar la extensión del archivo
        $extension = $file->getClientOriginalExtension();
        if (!in_array($extension, ['csv', 'xls', 'xlsx'])) {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }

        // Leer el archivo
        $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')->getRows();

        $resolucionMap = [];
        $totalRecords = 0; // Contador de registros procesados
        $skippedRecords = 0; // Contador de registros omitidos

        // Procesar cada fila
        $rows->each(function (array $row) use (&$resolucionMap, &$totalRecords, &$skippedRecords) {
            $totalRecords++; // Incrementar el contador de registros procesados

            // Verificar si solo tiene `id_resolucion` y los demás valores son nulos o vacíos
            $soloIdResolucion = isset($row['id_resolucion']) && array_filter($row, fn($value) => $value !== null && $value !== '') === ['id_resolucion'];

            if ($soloIdResolucion) {
                $skippedRecords++; // Incrementar el contador de registros omitidos
                return; // Saltar esta fila
            }

            // Obtener resolución mapeada o buscarla en la base de datos
            $resolucionId = $row['id_resolucion'];
            if (!isset($resolucionMap[$resolucionId]) && $mapeo = Mapeos::where('external_id', $resolucionId)->first()) {
                $resolucionMap[$resolucionId] = $mapeo->resolution_id;
            }

            // Si no se encuentra resolución, omitir esta fila
            if (!isset($resolucionMap[$resolucionId])) {
                $skippedRecords++; // Incrementar el contador de registros omitidos
                return;
            }

            // Verificar si ya existe el registro con la misma combinación de valores
            $exists = Jurisprudencias::where('resolution_id', $resolucionMap[$resolucionId])
                ->where('restrictor', $row['restrictor'] ?? null)
                ->where('descriptor', $row['descriptor'] ?? null)
                ->where('tipo_jurisprudencia', $row['tipo_jurisprudencia'] ?? null)
                ->where('ratio', $row['ratio'] ?? null)
                ->exists();

            if ($exists) {
                $skippedRecords++; // Incrementar el contador de registros omitidos
                return; // Si existe, no se inserta el registro
            }

            // Crear y guardar jurisprudencia si no existe
            Jurisprudencias::create([
                'resolution_id' => $resolucionMap[$resolucionId],
                'restrictor' => $row['restrictor'] ?? null,
                'descriptor' => $row['descriptor'] ?? null,
                'tipo_jurisprudencia' => $row['tipo_jurisprudencia'] ?? null,
                'ratio' => $row['ratio'] ?? null,
            ]);
        });

        return response()->json([
            'mensaje' => 'Carga completada exitosamente.',
            'success' => true,
            'total_records' => $totalRecords, // Total de registros procesados
            'skipped_records' => $skippedRecords, // Total de registros omitidos
        ]);
    }


    public function upload(Request $request)
    {
        $response = ['success' => false];

        // Verificar permisos del usuario
        if (!Auth::user()->hasPermissionTo('subir_jurisprudencia')) {
            $response['mensaje'] = "El usuario no cuenta con el permiso necesario";
            return response()->json($response, 403);
        }

        // Validar archivo de entrada
        $file = $request->file('excelFile');
        if (!$file) {
            return response()->json(['error' => 'No se proporcionó un archivo.'], 400);
        }

        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, ['csv', 'xls', 'xlsx'])) {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }

        // Leer las filas del archivo
        $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')->getRows();

        // Mapas para cachear IDs y contador de filas omitidas
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

        // Procesar cada fila
        try {
            $rows->each(function (array $row) use (&$maps, &$totalFilas, &$filasOmitidas) {
                $totalFilas++;

                // Verificar si el registro ya existe en `Mapeos` por `external_id`
                if (Mapeos::where('external_id', $row['id'])->exists()) {
                    $filasOmitidas++;
                    return; // Omitir esta fila
                }

                // Manejar relaciones
                $salaId = $this->getOrCreateId(Salas::class, 'nombre', $row['sala'], $maps['sala']);
                $tipoResolucionId = $this->getOrCreateId(TipoResolucions::class, 'nombre', $row['tipo_resolucion'], $maps['tipoResolucion']);
                $departamentoId = $this->getOrCreateId(Departamentos::class, 'nombre', $row['departamento'], $maps['departamento']);
                $magistradoId = $this->getOrCreateId(Magistrados::class, 'nombre', $row['magistrado'], $maps['magistrado']);
                $formaResolucionId = $this->getOrCreateId(FormaResolucions::class, 'nombre', $row['forma_resolucion'], $maps['formaResolucion']);
                $temaId = $row['id_tema'] ? $this->getTemaId($row['id_tema'], $maps['temas']) : null;

                // Crear resolución
                $data = [
                    'magistrado_id' => $magistradoId,
                    'forma_resolucion_id' => $formaResolucionId,
                    'sala_id' => $salaId,
                    'departamento_id' => $departamentoId,
                    'tipo_resolucion_id' => $tipoResolucionId,
                    'nro_resolucion' => $row['nro_resolucion'] ?? null,
                    'nro_expediente' => $row['nro_expediente'] ?? null,
                    'fecha_emision' => !empty($row['fecha_emision']) && strtotime($row['fecha_emision'])
                        ? date('Y-m-d', strtotime($row['fecha_emision']))
                        : null,
                    'fecha_publicacion' => !empty($row['fecha_publicacion']) && strtotime($row['fecha_publicacion'])
                        ? date('Y-m-d', strtotime($row['fecha_publicacion']))
                        : null,
                    'proceso' => $row['proceso'] ?? null,
                    'precedente' => $row['precedente'] ?? null,
                    'demandante' => $row['demandante'] ?? null,
                    'demandado' => $row['demandado'] ?? null,
                    'maxima' => $row['maxima'] ?? null,
                    'sintesis' => $row['sintesis'] ?? null,
                    'tema_id' => $temaId
                ];

                // Filtrar valores nulos
                $data = array_filter($data, fn($value) => !is_null($value));

                // Crear resolución con manejo de excepciones
                try {
                    $resolucion = Resolutions::create($data);
                    // Crear contenido
                    Contents::create([
                        'contenido' => $row['contenido'],
                        'resolution_id' => $resolucion->id,
                    ]);

                    // Registrar mapeo
                    Mapeos::create([
                        'external_id' => $row['id'],
                        'resolution_id' => $resolucion->id,
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error al crear resolución: ' . $e->getMessage(), ['data' => $data]);
                    throw $e; // Opcional: Re-lanzar la excepción
                }
            });

            return response()->json([
                'success' => true,
                'mensaje' => 'Procesamiento completado exitosamente.',
                'total_filas' => $totalFilas,
                'filas_omitidas' => $filasOmitidas
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ocurrió un error al procesar los datos.', 'detalles' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtener o crear un ID para una entidad dada.
     */
    private function getOrCreateId($model, $field, $value, &$map)
    {
        if (!isset($map[$value])) {
            $instance = $model::firstOrCreate([$field => $value]);
            $map[$value] = $instance->id;
        }
        return $map[$value];
    }

    /**
     * Obtener el ID de un tema existente.
     */
    private function getTemaId($temaID, &$map)
    {
        if (!isset($map[$temaID])) {
            $tema = Temas::find($temaID);
            if ($tema) {
                $map[$temaID] = $tema->id;
            }
        }
        return $map[$temaID] ?? null;
    }
}
