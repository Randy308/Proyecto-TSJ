<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resolutions;
use App\Models\Salas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
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

        if (!$mi_sala) {
            return response()->json(['error' => 'Sala no encontrada a'.$sala], 404);
        }

        // Obtener las resoluciones filtradas por año y departamento
        $resolutions = Resolutions::whereYear('fecha_emision', $year)
            ->where('departamento', $departamento)
            ->where('sala_id', $mi_sala->id)
            ->select(
                DB::raw('DATE_PART(\'month\', fecha_emision) as mes'),
                'forma_resolucion',
                DB::raw('count(*) as cantidad')
            )
            ->groupBy('mes', 'forma_resolucion')
            ->get();

        return $resolutions;
    }
}
