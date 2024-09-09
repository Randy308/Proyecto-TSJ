<?php

namespace App\Http\Controllers;

use App\Models\Magistrados;
use App\Models\Resolutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MagistradosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $magistrados = Magistrados::select('id', 'name as nombre')->get();

        return response()->json([
            'magistrados' => $magistrados
        ]);
    }
    public function obtenerDatos($id)
    {

        $magistrado = Magistrados::where("id", $id)->first();
        return $magistrado;
    }
    public function obtenerResoluciones(Request $request)
    {
        $id = $request["id"];
        $magistrado = Magistrados::where("id", $id)->first();
        if ($magistrado) {

            $query = DB::table('resolutions as r')
                ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
                ->join('salas as s', 's.id', '=', 'r.sala_id')
                ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
                ->select('r.nro_resolucion', "r.id", "r.fecha_emision", 'tr.name as tipo_resolucion', 'd.name as departamento', "s.sala as sala")
                ->where('r.magistrado_id', $magistrado->id);
            $paginatedData = $query->orderBy('fecha_emision')->paginate(10);

            return response()->json($paginatedData);
        } else {

            return response()->json([
                'error' => 'Magistrado no encontrado'
            ], 404);
        }
    }
    public function obtenerEstadisticas($id)
    {

        $magistrado = Magistrados::where('id', $id)->first();
        $resolutions = Resolutions::where('magistrado_id', $magistrado->id)
            ->select(
                DB::raw('DATE_PART(\'year\', fecha_emision) as year'),
                DB::raw('count(*) as cantidad')
            )->whereNotNull("fecha_emision")
            ->groupBy('year')
            ->orderBy('year')
            ->get();
        $completed_res = Resolutions::where('magistrado_id', $magistrado->id)->whereNotNull("fecha_emision")->count();
        $total_res = Resolutions::where('magistrado_id', $magistrado->id)->count();

        $res_departamentos = DB::table('resolutions as r')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                'd.name as name',
                DB::raw('count(*) as value')
            )
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->groupBy('d.name')
            ->orderBy('d.name')
            ->get();
        if ($resolutions->isNotEmpty()) {
            $data = [
                'magistrado' => $magistrado->name,
                'res completas' => $completed_res,
                'total_res' => $total_res,
                'departamentos' => $res_departamentos,
                'data' => $resolutions->toArray()
            ];
        }

        return response()->json([
            'data' => $data
        ]);
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        //
    }


    public function show(Magistrados $magistrados)
    {
        //
    }


    public function edit(Magistrados $magistrados)
    {
        //
    }


    public function update(Request $request, Magistrados $magistrados)
    {
        //
    }


    public function destroy(Magistrados $magistrados)
    {
        //
    }
}
