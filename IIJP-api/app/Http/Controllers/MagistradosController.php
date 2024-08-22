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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Magistrados  $magistrados
     * @return \Illuminate\Http\Response
     */
    public function show(Magistrados $magistrados)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Magistrados  $magistrados
     * @return \Illuminate\Http\Response
     */
    public function edit(Magistrados $magistrados)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Magistrados  $magistrados
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Magistrados $magistrados)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Magistrados  $magistrados
     * @return \Illuminate\Http\Response
     */
    public function destroy(Magistrados $magistrados)
    {
        //
    }
}
