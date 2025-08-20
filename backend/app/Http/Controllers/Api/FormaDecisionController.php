<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormaDecision;
use App\Models\ResuelveDecision;
use App\Models\ResuelveFondo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class FormaDecisionController extends Controller
{


    public function index()
    {

        $resuelveDecisions = DB::table('resuelve_decisiones')
            ->join('resuelve_fondos', 'resuelve_decisiones.resuelve_fondo_id', '=', 'resuelve_fondos.id')
            ->join('resolutions as r', 'resuelve_decisiones.resolution_id', '=', 'r.id')
            ->join('salas', 'r.sala_id', '=', 'salas.id')
            ->select(DB::raw('DISTINCT ON (resuelve_decisiones.tipo, salas.nombre)
                resuelve_decisiones.id,
                resuelve_decisiones.nombre as nombre,
                resuelve_decisiones.tipo as tipo,
                resuelve_decisiones.resuelve_fondo_id,
                resuelve_fondos.nombre as resuelve_fondo,
                salas.id as sala_id,
                salas.nombre as sala_nombre
            '))->get();


        return response()->json(['message' => 'List of ResuelveFondo', 'data' => $resuelveDecisions], 200);
    }

    public function show($id)
    {

        $formaDecision = ResuelveDecision::findOrFail($id);
        return response()->json(['message' => "Details of ResuelveFondo with ID: $id", 'data' => $formaDecision], 200);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'tipo_decision' => 'nullable|string',
            'grupo_decision' => 'required|integer',
            'resuelve_fondo_id' => 'required|exists:resuelve_fondos,id',
            'forma_resolucion_id' => 'required|exists:forma_resolucions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        $formaDecision = new FormaDecision();

        $formaDecision->grupo_decision = $request->input('grupo_decision');
        $formaDecision->resuelve_fondo_id = $request->input('resuelve_fondo_id');
        $formaDecision->forma_resolucion_id = $request->input('forma_resolucion_id');

        if ($request->has('tipo_decision') && $request->input('tipo_decision') !== null) {
            $formaDecision->tipo_decision = $request->input('tipo_decision');
        }

        $formaDecision->save();

        return response()->json(['message' => 'Forma de decision created successfully'], 201);
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'tipo' => 'required|integer',
            'sala_id' => 'required|exists:salas,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Buscar decisión por ID y verificar sala asociada
        $decision = DB::table('resuelve_decisiones as d')
            ->join('resolutions as r', 'd.resolution_id', '=', 'r.id')
            ->join('salas as s', 'r.sala_id', '=', 's.id')
            ->where('d.id', $id)
            ->where('d.tipo', $request->input('tipo'))
            ->where('s.id', $request->input('sala_id'))
            ->select('d.id')
            ->first();

        if (!$decision) {
            return response()->json(['message' => "No se encontró el registro para actualizar"], 404);
        }

        DB::table('resuelve_decisiones')
            ->where('id', $decision->id)
            ->update(['nombre' => $request->input('nombre')]);

        return response()->json(['message' => "Registro actualizado correctamente"], 200);
    }


    public function updateMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'tipo' => 'required|integer',       // coincide con tu migración
            'sala_id' => 'required|exists:salas,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Actualiza todos los registros que cumplan con tipo + sala_id
        $updated = DB::table('resuelve_decisiones as d')
            ->join('resolutions as r', 'd.resolution_id', '=', 'r.id')
            ->join('salas as s', 'r.sala_id', '=', 's.id')
            ->where('d.tipo', $request->input('tipo'))
            ->where('s.id', $request->input('sala_id'))
            ->update(['d.nombre' => $request->input('nombre')]);

        return response()->json([
            'message' => $updated
                ? "$updated registros actualizados correctamente"
                : "No se encontró ningún registro para actualizar",
        ], $updated ? 200 : 404);
    }




    public function destroy($id)
    {
        $formaDecision = FormaDecision::findOrFail($id);
        $formaDecision->delete();
        return response()->json(['message' => "ResuelveFondo with ID: $id deleted successfully"], 200);
    }
}
