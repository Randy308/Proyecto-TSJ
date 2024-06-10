<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resolutions;
use App\Models\Salas;
use App\Models\Temas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TemaController extends Controller
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

    public function verTemasGenerales()
    {
        $temas_generales = DB::table('temas')->select('id','nombre','tema_id')->whereNull('tema_id')->get();
        return $temas_generales;
    }
    public function obtenerHijos($id){

        $hijos = Temas::where('tema_id', '=', $id)->get();
        return $hijos->toJson();
    }

    public function getCronologia(Request $request)
    {
        //
        $year = $request['nombreMateria'];
        $sala = $request['nombreMateria'];
        $departamento = $request['nombreMateria'];


        $mi_sala = Salas::where('sala', $sala)->first();

        if (!$mi_sala) {
            return response()->json(['error' => 'Sala no encontrada a' . $sala], 404);
        }



        $data = [];
        $forma_resolucion = Resolutions::select('forma_resolucion')->distinct()->get();

        foreach ($forma_resolucion as $res) {
            $resolutions = Resolutions::whereYear('fecha_emision', $year)
                ->where('departamento', $departamento)
                ->where('sala_id', $mi_sala->id)
                ->where('forma_resolucion', $res->forma_resolucion)
                ->select(
                    DB::raw('DATE_PART(\'month\', fecha_emision) as mes'),
                    DB::raw('count(*) as cantidad')
                )
                ->groupBy('mes')
                ->orderBy('mes')
                ->get();
            if ($resolutions->isNotEmpty()) {
                $data[] = [
                    'id' => $res->forma_resolucion,
                    'color' => 'hsl(118, 70%, 50%)',
                    'data' => $resolutions->toArray()
                ];
            }
        }


        return $data;

    }


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
}
