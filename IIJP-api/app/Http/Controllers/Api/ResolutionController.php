<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\FormaResolucions;
use App\Models\Resolutions;
use App\Models\Salas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ResolutionController extends Controller
{

    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }


    public function show($id): JsonResponse
    {
        try {

            $resolucion = DB::table('contents as c')
                ->join('resolutions as r', 'r.id', '=', 'c.resolution_id')
                ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
                ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
                ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
                ->select(
                    'c.contenido',
                    'r.nro_resolucion',
                    'r.nro_expediente',
                    'r.fecha_emision',
                    'tr.name as tipo_resolucion',
                    'd.name as departamento',
                    'm.name as magistrado',
                    'fr.name as forma_resolucion',
                    'r.proceso',
                    'r.demandante',
                    'r.demandado'
                )
                ->where('r.id', '=', $id)
                ->first();


            return response()->json($resolucion, 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Resolución no encontrada'
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener la resolución'
            ], 500);
        }
    }



    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }

    public function obtenerAvg(Request $request)
    {
        $year = $request['selectedYear'];
        $departamento = $request['departamento'];
        $sala = $request['selectedSala'];

        $mi_sala = Salas::where('sala', $sala)->first();
        $mi_departamento = Departamentos::where("name", $departamento)->first();
        if (!$mi_sala) {
            return response()->json(['error' => 'Sala no encontrada a' . $sala], 404);
        }

        if (!$mi_departamento) {
            return response()->json(['error' => 'Departamento no encontrado ' . $departamento], 404);
        }



        $data = [];
        $forma_resolucion = FormaResolucions::distinct()->get();

        foreach ($forma_resolucion as $res) {
            $resolutions = Resolutions::whereYear('fecha_emision', $year)
                ->where('departamento_id', $mi_departamento->id)
                ->where('sala_id', $mi_sala->id)
                ->where('forma_resolucion_id', $res->id)
                ->select(
                    DB::raw('DATE_PART(\'month\', fecha_emision) as mes'),
                    DB::raw('count(*) as cantidad')
                )
                ->groupBy('mes')
                ->orderBy('mes')
                ->get();
            if ($resolutions->isNotEmpty()) {
                $data[] = [
                    'id' => $res->name,
                    'color' => 'hsl(118, 70%, 50%)',
                    'data' => $resolutions->toArray()
                ];
            }
        }


        return $data;
    }
}
