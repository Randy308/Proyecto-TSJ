<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\Salas;
use App\Models\TipoResolucions;
use Illuminate\Http\Request;
use Spatie\SimpleExcel\SimpleExcelReader;

class ExcelController extends Controller
{
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
        $rows->each(function (array $row) use (&$departamentoMap, &$tipoResolucionMap, $salaMap, &$data) {
            $salaId = $row['sala'];
            $tipoResolucionNombre = $row['tipo_resolucion'];
            $departamentoNombre = $row['departamento'];


            if (!isset($tipoResolucionMap[$tipoResolucionNombre])) {
                $tipoResolucion = TipoResolucions::firstOrCreate(['name' => $tipoResolucionNombre]);
                $tipoResolucionMap[$tipoResolucionNombre] = $tipoResolucion->id;
            }


            if (!isset($salaMap[$salaId])) {
                $sala = Salas::firstOrCreate(['sala' => $salaId]);
                $salaMap[$salaId] = $sala->id;
            }

            if (!isset($departamentoMap[$departamentoNombre])) {

                $departamento = Departamentos::firstOrCreate(['name' =>  $departamentoNombre]);
                $departamentoMap[$departamentoNombre] = $departamento->id;
            }
            $resolucion = [
                'id' => $row['id'],
                'descripcion' => $row['nro_resolucion'],
                'sala_id' => $salaMap[$salaId],
                'departamento_id' => $departamentoMap[$departamentoNombre],
                'tipo_resolucion_id' => $tipoResolucionMap[$tipoResolucionNombre],
            ];
            $data[] = $resolucion;
        });

        return response()->json($data);
    }
}
