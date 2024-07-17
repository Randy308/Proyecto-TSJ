<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
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
                ->leftJoin('departamentos as d', 'd.id', '=', 'r.departamento_id')
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
    public function obtenerParametros()
    {
        $departamentos = Departamentos::all("name as nombre");
        $salas = Salas::all("sala as nombre");

        if (!$salas || !$departamentos) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        $data = [
            'departamentos' => $departamentos->toArray(),
            'salas' => $salas->toArray()
        ];

        return response()->json($data);
    }

    public function filtrarResoluciones(Request $request)
    {
        $texto = $request['texto'];
        $departamento = $request['departamento'];
        $sala = $request['selectedSala'];
        $mi_sala = null;
        $orden = $request["orden"];
        $mi_departamento = null;
        $fecha_exacta = $request["fecha_exacta"];
        $fecha_desde = $request["fecha_desde"];
        $fecha_hasta = $request["fecha_hasta"];

        if ($sala && $sala !== "todas") {
            $mi_sala = Salas::where("sala", $sala)->first();
            if (!$mi_sala) {
                return response()->json(['error' => 'Sala no encontrada'], 404);
            }
        } elseif (!$sala) {
            return response()->json(['error' => 'Campo sala no encontrado'], 404);
        }

        if ($departamento && $departamento !== "todos") {
            $mi_departamento = Departamentos::where("name", $departamento)->first();
            if (!$mi_departamento) {
                return response()->json(['error' => 'Departamento no encontrado'], 404);
            }
        } elseif (!$departamento) {
            return response()->json(['error' => 'Campo departamento no encontrado'], 404);
        }

        $query = DB::table('resolutions as r')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->select('r.nro_resolucion', "r.id", "r.fecha_emision", 'tr.name as tipo_resolucion', 'd.name as departamento', "s.sala as sala")
            ->where('c.contenido', 'like', '%' . $texto . '%');

        if ($mi_sala) {
            $query->where('r.sala_id', $mi_sala->id);
        }

        if ($mi_departamento) {
            $query->where('r.departamento_id', $mi_departamento->id);
        }

        if ($fecha_exacta) {
            $query->where('r.fecha_emision', $fecha_exacta);
        }
        if ($fecha_desde && $fecha_hasta) {
            $query->whereBetween('r.fecha_emision', [$fecha_desde, $fecha_hasta]);
        }
        if ($orden == "Recientes") {
            $query->orderByDesc('r.fecha_emision');
        } else {
            $query->orderBy('r.fecha_emision');
        }
        $paginatedData = $query->orderBy('tipo_resolucion')->paginate(10);

        return response()->json($paginatedData);
    }


    public function obtenerAvg(Request $request)
    {
        $year = $request['selectedYear'];
        $departamento = $request['departamento'];
        $sala = $request['selectedSala'];

        $mi_sala = null;
        $mi_departamento = null;

        if ($sala && $sala !== "Todas") {
            $mi_sala = Salas::where("sala", $sala)->first();
            if (!$mi_sala) {
                return response()->json(['error' => 'Sala no encontrada'], 404);
            }
        } elseif (!$sala) {
            return response()->json(['error' => 'Campo sala no encontrado'], 404);
        }

        if ($departamento && $departamento !== "Todos") {
            $mi_departamento = Departamentos::where("name", $departamento)->first();
            if (!$mi_departamento) {
                return response()->json(['error' => 'Departamento no encontrado'], 404);
            }
        } elseif (!$departamento) {
            return response()->json(['error' => 'Campo departamento no encontrado'], 404);
        }

        $data = [];
        $formaResoluciones = DB::table('forma_resolucions as fr')
            ->join('resolutions as r', 'r.forma_resolucion_id', '=', 'fr.id')
            ->select('fr.name', 'fr.id', DB::raw('count(r.id) as resolucion_count'))
            ->groupBy('fr.id')
            ->orderBy('resolucion_count', 'desc')
            ->limit(10)
            ->get();

        foreach ($formaResoluciones as $res) {
            $query = Resolutions::where('forma_resolucion_id', $res->id);

            if ($year && $year !== "Todos") {
                $query->whereYear('fecha_emision', $year)
                    ->select(
                        DB::raw('DATE_PART(\'month\', fecha_emision) as periodo'),
                        DB::raw('count(*) as cantidad')
                    )
                    ->groupBy('periodo')
                    ->orderBy('periodo');
                $periodo = "month";
            } else {
                $query->select(
                    DB::raw('DATE_PART(\'year\', fecha_emision) as periodo'),
                    DB::raw('count(*) as cantidad')
                )
                    ->groupBy('periodo')
                    ->orderBy('periodo');
                $periodo = "year";
            }

            if ($mi_sala) {
                $query->where('sala_id', $mi_sala->id);
            }

            if ($mi_departamento) {
                $query->where('departamento_id', $mi_departamento->id);
            }

            $resolutions = $query->get();

            if ($resolutions->isNotEmpty()) {
                $data[] = [
                    'id' => $res->name,
                    'data' => $resolutions->toArray()
                ];
            }
        }

        return response()->json([

            'tipo_periodo' => $periodo,
            'data' => $data,
        ]);
    }

}
