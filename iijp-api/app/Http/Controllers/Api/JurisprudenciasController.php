<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Jurisprudencias;
use App\Models\Temas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JurisprudenciasController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function actualizarNodo(Request $request)
    {
        $busqueda = $request->input('busqueda');
        $myArray = explode(' / ', $busqueda);
        $nodos = [];

        foreach ($myArray as $key => $value) {
            if ($key === 0) {
                $query = Temas::where('nombre', $value)->first();
                if ($query) {
                    $nodos[] = ['id' => $query->id, 'nombre' => $query->nombre];
                }
            } else {
                $last = end($nodos);
                $query = Temas::where('nombre', $value)->where('tema_id', $last['id'])->first();
                if ($query) {
                    $nodos[] = ['id' => $query->id, 'nombre' => $query->nombre];
                }
            }
        }
        $last = end($nodos);

        return response()->json([
            'nodos' => $nodos,
            'last' => $last['id'],
        ], 200);
    }

    public function busquedaTerminos(Request $request)
    {

        $request->validate([
            'busqueda' => 'required|string',
            'descriptor' => 'nullable|string',
        ]);


        $busqueda = $request->input('busqueda');
        $descriptor = $request->input('descriptor');


        $query = DB::table('jurisprudencias as j')
            ->select(
                'j.descriptor',
                DB::raw('COUNT(j.resolution_id) as cantidad')
            )
            ->groupBy('j.descriptor');


        if (!empty($descriptor)) {
            $descriptor = $descriptor . ' / ';
            $query->where('j.descriptor', 'ilike', $descriptor . '%' . $busqueda);
        } else {

            $query->whereRaw("j.descriptor ~* ?", ['(\/[^\/]*\m' . $busqueda . ')(?![^\/]*\/)']);
        }
        $resultados = $query->orderByDesc('cantidad')->get();

        return response()->json($resultados);
    }


    public function store(Request $request)
    {
        //
    }

    public function show(Jurisprudencias $jurisprudencias)
    {
        //
    }

    public function edit(Jurisprudencias $jurisprudencias)
    {
        //
    }

    public function update(Request $request, Jurisprudencias $jurisprudencias)
    {
        //
    }


    public function destroy(Jurisprudencias $jurisprudencias)
    {
        //
    }
}
