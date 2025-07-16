<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\Resolutions;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConfigController extends Controller
{
    //


    public function repararDepartamentos(Request $request)
    {

        $departamentos = Departamentos::all()->pluck('id', 'nombre')->toArray();

        // return response()->json($departamentos, 200);
        $statement = "select * from obtener_departamentos_vacios(100);";
        //$statement = 'select * from obtener_fechas_limite(100);';

        $querys = DB::select($statement);

    
        foreach ($querys as $query) {
            $resolution = Resolutions::find($query->r_id);

            $departamento = ucwords(strtolower($query->departamento));
            if ($departamento === 'Potosi' || $departamento === 'PotosÍ') {
                $departamento = 'Potosí'; // Normalizar el nombre de Potosí
            }
            if ($resolution && isset($departamentos[$departamento])) {
                $resolution->departamento_id = $departamentos[$departamento];
                $resolution->save();
            }
            $query->new_departamento = $departamento; // Normalizar el nombre del departamento

        }

        return response()->json($querys, 200);
    }


    public function repararFechasEmision(Request $request)
    {
        $statement = 'select * from obtener_fechas_limite(10);';

        $months = [
            'enero' => 'January',
            'febrero' => 'February',
            'marzo' => 'March',
            'abril' => 'April',
            'mayo' => 'May',
            'junio' => 'June',
            'julio' => 'July',
            'agosto' => 'August',
            'septiembre' => 'September',
            'octubre' => 'October',
            'noviembre' => 'November',
            'diciembre' => 'December',
        ];
        $querys = DB::select($statement);
        // $data = [];
        foreach ($querys as $query) {
            if (! empty($query->fecha)) {
                $dateString = preg_replace('/[{}"]/', '', strtolower($query->fecha));
                $dateString = strtr($dateString, $months); // traducir mes
                $carbonDate = Carbon::createFromFormat('d \d\e F \d\e Y', $dateString);

                $resolution = Resolutions::find($query->r_id);
                if ($resolution) {
                    $resolution->fecha_emision = $carbonDate->format('Y-m-d');
                }
                // $data[] = $resolution;
                $resolution->save();
            }
        }

        return response()->json(['message' => 'Fechas actualizadas correctamente'], 200);
    }

    public function generarTerminosClaveUnificados(Request $request)
    {
        $statement = 'SELECT actualizar_terminos_clave_unificados();';
        DB::statement($statement);

        return response()->json(['message' => 'Términos clave unificados actualizados correctamente'], 200);
    }

    public function generarResumenJerarquico(Request $request)
    {
        $statement = 'REFRESH MATERIALIZED VIEW CONCURRENTLY resumen_jerarquico;';
        DB::statement($statement);

        return response()->json(['message' => 'Resumen jerárquico actualizado correctamente'], 200);
    }
}
