<?php

namespace App\Http\Controllers\api;

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
use Spatie\SimpleExcel\SimpleExcelReader;

class ExcelController extends Controller
{

    public function upload_jurisprudencia(Request $request)
    {
        $file = $request->file('excelFile');
        $extension = $file->getClientOriginalExtension();


        if ($extension == 'csv') {
            $rows = SimpleExcelReader::create($file->getPathname(), 'csv')->getRows();
        } elseif (in_array($extension, ['xls', 'xlsx'])) {
            $rows = SimpleExcelReader::create($file->getPathname(), 'xlsx')->getRows();
        } else {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }

        $data = [];
        $resolucionMap = [];


        $rows->each(function (array $row) use (&$resolucionMap, &$data) {
            $resolucionId = $row['id_resolucion'];


            if (isset($resolucionMap[$resolucionId]) || ($mapeo = Mapeos::where('external_id', $resolucionId)->first())) {

                if (!isset($resolucionMap[$resolucionId])) {
                    $resolucionMap[$resolucionId] = $mapeo->resolution_id;
                }


                $jurisprudencia = new Jurisprudencias([
                    'resolution_id' => $resolucionMap[$resolucionId],
                    'restrictor' => !empty($row['restrictor']) ? $row['restrictor'] : null,
                    'descriptor' => !empty($row['descriptor']) ? $row['descriptor'] : null,
                    'tipo_jurisprudencia' => !empty($row['tipo_jurisprudencia']) ? $row['tipo_jurisprudencia'] : null,
                    'ratio' => !empty($row['precedente']) ? $row['precedente'] : null,
                ]);


                $jurisprudencia->save();

                $data[] = $jurisprudencia;
            }
        });



        return response()->json($data);
    }
    public function upload(Request $request)
    {


        $file = $request->file('excelFile');
        $extension = $file->getClientOriginalExtension();


        if ($extension == 'csv') {
            $rows = SimpleExcelReader::create($file->getPathname(), 'csv')->getRows();
        } elseif (in_array($extension, ['xls', 'xlsx'])) {
            $rows = SimpleExcelReader::create($file->getPathname(), 'xlsx')->getRows();
        } else {
            return response()->json(['error' => 'Tipo de archivo no soportado.'], 400);
        }

        $data = [];
        $departamentoMap = [];
        $salaMap = [];
        $tipoResolucionMap = [];
        $magistradoMap = [];
        $formaResolucionMap = [];
        $temasMap = [];
        $rows->each(function (array $row) use (&$departamentoMap, &$tipoResolucionMap, &$salaMap, &$magistradoMap, &$temasMap, &$formaResolucionMap, &$data) {
            $salaId = $row['sala'];
            $tipoResolucionNombre = $row['tipo_resolucion'];
            $departamentoNombre = $row['departamento'];
            $formaResolucionNombre = $row['forma_resolucion'];
            $magistradoNombre = $row['magistrado'];
            $temaID = $row['tema_id'];

            if (!isset($tipoResolucionMap[$tipoResolucionNombre])) {
                $tipoResolucion = TipoResolucions::firstOrCreate(['nombre' => $tipoResolucionNombre]);
                $tipoResolucionMap[$tipoResolucionNombre] = $tipoResolucion->id;
            }


            if (!isset($salaMap[$salaId])) {
                $sala = Salas::firstOrCreate(['nombre' => $salaId]);
                $salaMap[$salaId] = $sala->id;
            }

            if (!isset($departamentoMap[$departamentoNombre])) {

                $departamento = Departamentos::firstOrCreate(['nombre' =>  $departamentoNombre]);
                $departamentoMap[$departamentoNombre] = $departamento->id;
            }

            if (!isset($magistradoMap[$magistradoNombre])) {

                $magistrado = Magistrados::firstOrCreate(['nombre' =>  $magistradoNombre]);
                $magistradoMap[$magistradoNombre] = $magistrado->id;
            }
            if (!isset($formaResolucionMap[$formaResolucionNombre])) {

                $forma_resolucion = FormaResolucions::firstOrCreate(['nombre' =>  $formaResolucionNombre]);
                $formaResolucionMap[$formaResolucionNombre] = $forma_resolucion->id;
            }

            $resolucion = new Resolutions([
                'magistrado_id' => $magistradoMap[$magistradoNombre] ?? null,
                'forma_resolucion_id' => $formaResolucionMap[$formaResolucionNombre] ?? null,
                'sala_id' => $salaMap[$salaId] ?? null,
                'departamento_id' => $departamentoMap[$departamentoNombre] ?? null,
                'tipo_resolucion_id' => $tipoResolucionMap[$tipoResolucionNombre] ?? null,
                'nro_resolucion' => $row['nro_resolucion'] ?? null,
                'nro_expediente' => !empty($row['nro_expediente']) ? $row['nro_expediente'] : null,
                'fecha_emision' => !empty($row['fecha_emision']) ? $row['fecha_emision'] : null,
                'fecha_publicacion' => !empty($row['fecha_publicacion']) ? $row['fecha_publicacion'] : null,
                'proceso' => !empty($row['proceso']) ? $row['proceso'] : null,
                'precedente' => !empty($row['precedente']) ? $row['precedente'] : null,
                'demandante' => !empty($row['demandante']) ? $row['demandante'] : null,
                'demandado' => !empty($row['demandado']) ? $row['demandado'] : null,
                'maxima' => !empty($row['maxima']) ? $row['maxima'] : null,
                'sintesis' => !empty($row['sintesis']) ? $row['sintesis'] : null,
            ]);



            if ($temaID) {
                if (isset($temasMap[$temaID]) || ($tema = Temas::where('id', $temaID)->first())) {

                    if (!isset($temaID[$temaID])) {
                        $temasMap[$temaID] = $tema->id;
                    }

                    $resolucion->tema_id = $temasMap[$temaID];
                }
            }


            $resolucion->save();

            $contenido = new Contents([
                'contenido' => $row['contenido'],
                'resolution_id' => $resolucion->id,
            ]);

            $contenido->save();

            $mapeo = new Mapeos([
                'external_id' => $row['id'],
                'resolution_id' => $resolucion->id,
            ]);

            $mapeo->save();

            $data[] = $resolucion;
        });

        return response()->json($data);
    }
}
