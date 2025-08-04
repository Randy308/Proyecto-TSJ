<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ImportResuelveFondo;
use App\Jobs\PrepareImportDataJob;
use App\Jobs\ProcesarJurisprudencia;
use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\SimpleExcel\SimpleExcelReader;

class ExcelController extends Controller
{
    public function upload_resuelve_fondo(Request $request)
    {

        if (!Auth::user()->hasPermissionTo('subir_jurisprudencia')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario.'], 403);
        }

        $file = $request->file('excelFile');
        $nombre = $request->input('sala');
        if (!$file) {
            return response()->json(['error' => 'No se proporcionó un archivo.'], 400);
        }

        if (!$nombre) {
            return response()->json(['error' => 'No se proporcionó el nombre de la sala.'], 400);
        }

        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, ['csv', 'xls', 'xlsx'])) {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }


        $sala = Sala::where('nombre', $nombre)->first();
        if (!$sala) {
            return response()->json(['error' => 'Sala no encontrada.'], 404);
        }

        try {
            // Leer solo para verificar si contiene filas
            $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')
                ->getRows();

            if ($rows->isEmpty()) {
                return response()->json(['error' => 'El archivo está vacío.'], 400);
            }

            // Guardar archivo original
            $filename = 'resuelve_forma_' . now()->format('Ymd_His') . '.' . $extension;
            $storedPath = $file->storeAs('', $filename, 'local'); // Guarda en storage/app

            Log::info("Archivo subido y guardado como: $storedPath");

            // Lanzar Job de procesamiento
            ImportResuelveFondo::dispatch($storedPath, Auth::id(), $sala->id);

            return response()->json([
                'success' => true,
                'mensaje' => 'Archivo subido exitosamente. Se iniciará el procesamiento en segundo plano.',
                'archivo' => $filename,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al leer archivo: ' . $e->getMessage());

            return response()->json([
                'error' => 'Ocurrió un error al procesar el archivo.',
                'detalles' => $e->getMessage(),
            ], 500);
        }
    }

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
            // Leer solo para verificar si contiene filas
            $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')
                ->getRows();

            if ($rows->isEmpty()) {
                return response()->json(['error' => 'El archivo está vacío.'], 400);
            }

            // Guardar archivo original
            $filename = 'jurisprudencia_' . now()->format('Ymd_His') . '.' . $extension;
            $storedPath = $file->storeAs('', $filename, 'local'); // Guarda en storage/app

            Log::info("Archivo subido y guardado como: $storedPath");

            // Lanzar Job de procesamiento
            ProcesarJurisprudencia::dispatch($storedPath, Auth::id());

            return response()->json([
                'success' => true,
                'mensaje' => 'Archivo subido exitosamente. Se iniciará el procesamiento en segundo plano.',
                'archivo' => $filename,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al leer archivo: ' . $e->getMessage());

            return response()->json([
                'error' => 'Ocurrió un error al procesar el archivo.',
                'detalles' => $e->getMessage(),
            ], 500);
        }
    }

    public function handleUpload(Request $request)
    {
        // Verificación de permisos
        if (!Auth::user()->hasPermissionTo('subir_jurisprudencia')) {
            return response()->json([
                'success' => false,
                'mensaje' => 'El usuario no cuenta con el permiso necesario',
            ], 403);
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
            // Leer solo para verificar si contiene filas
            $rows = SimpleExcelReader::create($file->getPathname(), $extension === 'csv' ? 'csv' : 'xlsx')
                ->getRows();

            if ($rows->isEmpty()) {
                return response()->json(['error' => 'El archivo está vacío.'], 400);
            }

            // Guardar archivo original
            $filename = 'resoluciones_' . now()->format('Ymd_His') . '.' . $extension;
            $storedPath = $file->storeAs('', $filename, 'local'); // Guarda en storage/app

            Log::info("Archivo subido y guardado como: $storedPath");

            // Lanzar Job de procesamiento
            PrepareImportDataJob::dispatch($storedPath, Auth::id());

            return response()->json([
                'success' => true,
                'mensaje' => 'Archivo subido exitosamente. Se iniciará el procesamiento en segundo plano.',
                'archivo' => $filename,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al leer archivo: ' . $e->getMessage());

            return response()->json([
                'error' => 'Ocurrió un error al procesar el archivo.',
                'detalles' => $e->getMessage(),
            ], 500);
        }
    }
}
