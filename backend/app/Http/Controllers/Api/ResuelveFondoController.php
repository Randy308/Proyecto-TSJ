<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResuelveFondo;
use Exception;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ResuelveFondoController extends Controller
{


    public function index()
    {
        $resuleveFondos = ResuelveFondo::all();
        return response()->json(['message' => 'List of ResuelveFondo', 'data' => $resuleveFondos], 200);
    }

    public function show($id)
    {

        return response()->json(['message' => "Details of ResuelveFondo with ID: $id"], 200);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'tipo_decision' => 'required|string',
            'sala_id' => 'required|exists:salas,id',
            'slug' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        $resuelveFondo = new ResuelveFondo([
            'tipo_decision' => $request->input('tipo_decision'),
            'sala_id' => $request->input('sala_id'),
            'nombre' => $request->input('nombre'),
        ]);
        if ($request->has('slug') && $request->input('slug') !== null) {
            $resuelveFondo->slug = $request->input('slug');
        }
        $resuelveFondo->save();

        return response()->json(['message' => 'ResuelveFondo created successfully'], 201);
    }

    public function update(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'tipo_decision' => 'required|string',
            'sala_id' => 'required|exists:salas,id',
            'slug' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        $resuelveFondo = ResuelveFondo::findOrFail($id);

        if ($request->has('sala_id') && $request->input('sala_id') !== null) {
            $resuelveFondo->sala_id = $request->input('sala_id');
        }

        
        if ($request->has('tipo_decision') && $request->input('tipo_decision') !== null) {
            $resuelveFondo->tipo_decision = $request->input('tipo_decision');
        }
        
        if ($request->has('nombre') && $request->input('nombre') !== null) {
            $resuelveFondo->nombre = $request->input('nombre');
        }
        
        if ($request->has('slug') && $request->input('slug') !== null) {
            $resuelveFondo->slug = $request->input('slug');
        }

        $resuelveFondo->save();

        return response()->json(['message' => "ResuelveFondo with ID: $id updated successfully"], 200);
    }

    public function destroy($id)
    {
        $resuelveFondo = ResuelveFondo::findOrFail($id);
        $resuelveFondo->delete();
        return response()->json(['message' => "ResuelveFondo with ID: $id deleted successfully"], 200);
    }
}