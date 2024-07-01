<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resolutions;
use App\Models\Salas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalaController extends Controller
{

    public function index()
    {
        $data = [
            'salas' => [],
            'years' => []
        ];

        try {
            $resultado = Salas::orderBy('id')->get(["sala as nombre"]);
            $salas = $resultado->toArray();
            array_unshift($salas, ['nombre' => 'Todas']);
            $data['salas'] = $salas;
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener las salas'
            ], 500);
        }

        try {
            $resultado_years = Resolutions::select(DB::raw('DISTINCT DATE_PART(\'year\', fecha_emision) AS year'))->pluck('year');
            $years = $resultado_years->toArray();
            //array_unshift($years, 'Todos');
            $data['years'] = $years;
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener los years'
            ], 500);
        }

        return response()->json($data, 200);
    }


    public function store(Request $request)
    {
        //
    }


    public function show($id)
    {
        //
    }


    public function update(Request $request, $id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }
}
