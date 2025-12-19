<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ImportResuelveFondo;
use App\Jobs\PrepareImportDataJob;
use App\Jobs\ProcesarJurisprudencia;
use App\Models\Sala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;
use PhpOffice\PhpSpreadsheet\Style\Color;
use Spatie\SimpleExcel\SimpleExcelReader;

class ExcelController extends Controller
{


    public function exportarExcel(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasPermissionTo('exportar_datos')) {
            return response()->json(['mensaje' => 'El usuario no cuenta con el permiso necesario.'], 403);
        }


        $validator = Validator::make($request->all(), [
            'sala_id' => 'integer|required',
            'gestion' => 'integer|required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sala_id = request()->input("sala_id", 1);
        $gestion = request()->input("gestion", 2023);
        // Example data
        $query = DB::table('resolutions as r')
            ->leftJoin('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->join("mapeos as m", "m.resolution_id", "=", "r.id")
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('contents as c', 'c.resolution_id', '=', 'r.id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->leftJoin('resuelve_decisiones as rd', 'rd.resolution_id', '=', 'r.id')
            ->select(

                'm.external_id',
                'r.nro_resolucion',
                'r.fecha_emision',
                'tr.nombre as tipo_resolucion',
                's.nombre as sala',
                'd.nombre as departamento',
                'r.proceso',
                'fr.nombre as forma_resolucion',
                'r.sintesis',
                'r.maxima',
                'r.precedente',
                'j.ratio',
                'j.descriptor',
                'j.restrictor',
                'c.contenido',
                'r.id',
            )
            ->where('r.sala_id', $sala_id)->whereYear('r.fecha_emision', '=', $gestion)
            ->whereNull('rd.resolution_id');


        $data = $query->orderBy('tipo_resolucion')->orderBy('fecha_emision')->get()->toArray();


        if ($data == null || count($data) == 0) {
            return response()->json(['mensaje' => 'No se encontraron datos para los filtros proporcionados.'], 404);
        }
        $headers = ["id", 'Nro Resolución', 'Fecha Emisión', 'Tipo Resolución', 'Sala', 'Departamento', 'Proceso', 'Forma Resolución', 'Síntesis', 'Máxima', 'Precedente', 'Ratio', 'Descriptor', 'Restrictor', 'Contenido'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
        }
        $rowNumber = 2; // empieza en fila 2

        foreach ($data as $row) {
            $colNumber = 1; // columna A
            $url = 'https://samed-tsj.umss.edu.bo/cronojuridicas/resolucion/' . $row->id;
            foreach ($row as $key => $cell) {
                if ($cell === $row->id) {
                    continue;
                }
                if ($cell instanceof \Carbon\Carbon) {
                    $cell = $cell->format('Y-m-d');
                }
                if (is_null($cell)) {
                    $cell = '';
                }

                $colLetter = Coordinate::stringFromColumnIndex($colNumber);
                $cellCoordinate = $colLetter . $rowNumber;


                if ($key == 'contenido' && strlen($cell) > 32767) {
                    // Dividimos en chunks respetando palabras
                    $chunks = [];
                    $current = '';
                    foreach (preg_split('/\s+/', $cell) as $word) {
                        // +1 por el espacio
                        if (strlen($current) + strlen($word) + 1 > 32767) {
                            $chunks[] = trim($current);
                            $current = $word . ' ';
                        } else {
                            $current .= $word . ' ';
                        }
                    }
                    if (!empty(trim($current))) {
                        $chunks[] = trim($current);
                    }

                    // Escribimos cada chunk en columnas sucesivas
                    for ($i = 0; $i < count($chunks); $i++) {
                        $colLetter = Coordinate::stringFromColumnIndex($colNumber + $i);
                        $partCellCoordinate = $colLetter . $rowNumber;
                        $sheet->setCellValue($partCellCoordinate, $chunks[$i]);
                    }

                    continue;
                }

                // Ejemplo: si el valor empieza con "http" lo ponemos como enlace
                if ($key == 'nro_resolucion') {
                    $sheet->setCellValue($cellCoordinate, $cell); // Texto visible
                    $sheet->getCell($cellCoordinate)->getHyperlink()->setUrl($url);

                    $sheet->getStyle($cellCoordinate)->getFont()
                        ->getColor()->setARGB(Color::COLOR_BLUE);
                    $sheet->getStyle($cellCoordinate)->getFont()->setUnderline(true);
                } else {
                    $sheet->setCellValue($cellCoordinate, $cell);
                }

                $colNumber++;
            }
            $rowNumber++;
        }

        // Generar respuesta para descarga
        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="reporte.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }
    public function exportarExcelIds(Request $request)
    {



        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1|max:1000',
            'ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $ids = request()->input("ids", [2]);
        // Example data

        $query = DB::table(DB::raw('resolutions r FULL OUTER JOIN jurisprudencias j ON r.id = j.resolution_id'))
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->select(

                'r.nro_resolucion',
                'r.fecha_emision',
                'tr.nombre as tipo_resolucion',
                's.nombre as sala',
                'r.proceso',
                'fr.nombre as forma_resolucion',
                'r.sintesis',
                'r.maxima',
                'r.precedente',
                'j.ratio',
                'j.descriptor',
                'j.restrictor',
                'r.id'
            )
            ->whereIn('r.id', $ids);

        $data = $query->orderBy('tipo_resolucion')->orderBy('fecha_emision')->get()->toArray();
        $headers = ['Nro Resolución', 'Fecha Emisión', 'Tipo Resolución', 'Sala', 'Proceso', 'Forma Resolución', 'Síntesis', 'Máxima', 'Precedente', 'Ratio', 'Descriptor', 'Restrictor'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
        }
        $rowNumber = 2; // empieza en fila 2

        foreach ($data as $row) {
            $colNumber = 1; // columna A
            $url = 'https://samed-tsj.umss.edu.bo/cronojuridicas/resolucion/' . $row->id;
            foreach ($row as $cell) {
                if ($cell === $row->id) {
                    continue;
                }
                if ($cell instanceof \Carbon\Carbon) {
                    $cell = $cell->format('Y-m-d');
                }
                if (is_null($cell)) {
                    $cell = '';
                }

                $colLetter = Coordinate::stringFromColumnIndex($colNumber);
                $cellCoordinate = $colLetter . $rowNumber;

                // Ejemplo: si el valor empieza con "http" lo ponemos como enlace
                if ($colNumber == 1) {
                    $sheet->setCellValue($cellCoordinate, $cell); // Texto visible
                    $sheet->getCell($cellCoordinate)->getHyperlink()->setUrl($url);

                    $sheet->getStyle($cellCoordinate)->getFont()
                        ->getColor()->setARGB(Color::COLOR_BLUE);
                    $sheet->getStyle($cellCoordinate)->getFont()->setUnderline(true);
                } else {
                    $sheet->setCellValue($cellCoordinate, $cell);
                }

                $colNumber++;
            }
            $rowNumber++;
        }

        // Generar respuesta para descarga
        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="reporte.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }
    public function upload_resuelve_fondo(Request $request)
    {

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user()->hasPermissionTo('subir_jurisprudencia')) {
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
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->hasPermissionTo('subir_jurisprudencia')) {
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
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificación de permisos
        if (!$user->hasPermissionTo('subir_jurisprudencia')) {
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
