<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Descriptor;
use App\Models\Jurisprudencias;
use App\Models\Tema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Utils\NLP;

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
                $query = Descriptor::where('nombre', $value)->first();
                if ($query) {
                    $nodos[] = ['id' => $query->id, 'nombre' => $query->nombre];
                }
            } else {
                $last = end($nodos);
                $query = Descriptor::where('nombre', $value)->where('descriptor_id', $last['id'])->first();
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

    public function search(Request $request)
    {

        $request->validate([
            'busqueda' => 'required|string',
            'descriptor' => 'nullable|string',
        ]);


        $stopwords = NLP::getStopwords();


        $busqueda = $request->input('busqueda');
        $descriptor = $request->input('descriptor');

        if (in_array($busqueda, $stopwords)) {
            return response()->json("Ingrese terminos de busqueda no stopwords", 422);
        }
        $query = DB::table('jurisprudencias as j')
            ->select(
                'j.descriptor',
                DB::raw('COUNT(j.resolution_id) as cantidad'),
                DB::raw('array_agg(j.id) AS ids')
            )
            ->groupBy('j.descriptor');


        if (!empty($descriptor)) {
            $descriptor = $descriptor . ' / ';
            $query->where('j.descriptor', 'ilike', $descriptor . '%' . $busqueda);
        } else {

            $query->whereRaw("? % j.restrictor or ? % j.descriptor",  [$busqueda, $busqueda]);
        }
        $resultados = $query->orderByDesc('cantidad')->get();

        if ($resultados->isEmpty()) {
            return response()->json(['mensaje' => "No se encontraron resultados"], 404);
        }
        foreach ($resultados as &$item) {
            $item->ids = array_map('intval', explode(',', trim($item->ids, '{}')));
        }

        return response()->json($resultados);
    }


    public function busquedaTerminos(Request $request)
    {

        $request->validate([
            'busqueda' => 'required|string',
            'descriptor' => 'nullable|string',
        ]);

        $busqueda = $request->input('busqueda');
        $descriptor = $request->input('descriptor');


        $query = DB::table('jurisprudencias as j')->join('restrictors', 'j.restrictor_id', '=', 'restrictors.id')
            ->select(
                'j.descriptor',
                DB::raw('COUNT(j.resolution_id) as cantidad'),
                DB::raw('array_agg(j.resolution_id) AS ids')
            )
            ->groupBy('descriptor');


        if (!empty($descriptor)) {
            $descriptor = $descriptor . ' / ';
            $query->where('j.descriptor', 'ilike', $descriptor . '%' . $busqueda);
        } else {

            $query->whereRaw("restrictors.nombre ~* ? or j.descriptor ~* ?",  [" " . $busqueda, " " . $busqueda]);
        }
        $resultados = $query->orderByDesc('cantidad')->get();
        if ($resultados->isEmpty()) {
            return response()->json(['mensaje' => "No se encontraron resultados"], 404);
        }
        foreach ($resultados as &$item) {
            $item->ids = array_map('intval', explode(',', trim($item->ids, '{}')));
        }
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
