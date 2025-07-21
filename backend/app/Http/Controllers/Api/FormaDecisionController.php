<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormaDecision;
use App\Models\ResuelveFondo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class FormaDecisionController extends Controller
{


    public function index()
    {
        $formaDecisiones = FormaDecision::all();
        return response()->json(['message' => 'List of ResuelveFondo', 'data' => $formaDecisiones], 200);
    }

    public function show($id)
    {

        $formaDecision = FormaDecision::findOrFail($id);
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
            'tipo_decision' => 'nullable|string',
            'grupo_decision' => 'required|string',
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

        if ($request->has('tipo_decision') && $request->input('tipo_decision') !== null) {
            $formaDecision->tipo_decision = $request->input('tipo_decision');
        }

        if ($request->has('grupo_decision') && $request->input('grupo_decision') !== null) {
            $formaDecision->grupo_decision = $request->input('grupo_decision');
        }

        if ($request->has('resuelve_fondo_id') && $request->input('resuelve_fondo_id') !== null) {
            $formaDecision->resuelve_fondo_id = $request->input('resuelve_fondo_id');
        }

        if ($request->has('forma_resolucion_id') && $request->input('forma_resolucion_id') !== null) {
            $formaDecision->forma_resolucion_id = $request->input('forma_resolucion_id');
        }

        $formaDecision->save();

        return response()->json(['message' => "ResuelveFondo with ID: $id updated successfully"], 200);
    }

    public function destroy($id)
    {
        $formaDecision = FormaDecision::findOrFail($id);
        $formaDecision->delete();
        return response()->json(['message' => "ResuelveFondo with ID: $id deleted successfully"], 200);
    }
}