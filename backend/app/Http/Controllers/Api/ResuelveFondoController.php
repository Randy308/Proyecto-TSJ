<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResuelveFondo;
use Illuminate\Http\Request; // <-- Este es el correcto
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class ResuelveFondoController extends Controller
{
    public function index(): JsonResponse
    {

        $resuelveFondos = ResuelveFondo::with('sala')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nombre' => $item->nombre,
                "tipo_decision" =>  $item->tipo_decision,
                'slug' => $item->slug,
                "sala_id" =>  $item->sala_id,
                'sala' => $item->sala->nombre ?? null, // aplanado
            ];
        });


        return response()->json([
            'message' => 'Lista de ResuelveFondo',
            'data' => $resuelveFondos
        ]);
    }

    public function show($id): JsonResponse
    {
        $resuelveFondo = ResuelveFondo::find($id);

        if (!$resuelveFondo) {
            return response()->json([
                'message' => "No se encontró el ResuelveFondo con ID: $id"
            ], 404);
        }

        return response()->json([
            'message' => "Detalle del ResuelveFondo con ID: $id",
            'data' => $resuelveFondo
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'tipo_decision' => 'required|integer',
            'sala_id' => 'required|exists:salas,id',
            'slug' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors' => $validator->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $resuelveFondo = ResuelveFondo::create($request->only([
            'nombre',
            'tipo_decision',
            'sala_id',
            'slug'
        ]));

        return response()->json([
            'message' => 'ResuelveFondo creado exitosamente',
            'data' => $resuelveFondo
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'tipo_decision' => 'required|integer',
            'sala_id' => 'required|exists:salas,id',
            'slug' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors' => $validator->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $resuelveFondo = ResuelveFondo::find($id);


        if (!$resuelveFondo) {
            return response()->json([
                'message' => "No se encontró el ResuelveFondo con ID: $id"
            ], 404);
        }

        $resuelveFondo->update($request->only([
            'nombre',
            'slug'
        ]));

        return response()->json([
            'message' => "ResuelveFondo con ID: $id actualizado exitosamente",
            'data' => $resuelveFondo
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $resuelveFondo = ResuelveFondo::find($id);

        if (!$resuelveFondo) {
            return response()->json([
                'message' => "No se encontró el ResuelveFondo con ID: $id"
            ], 404);
        }

        $resuelveFondo->delete();

        return response()->json([
            'message' => "ResuelveFondo con ID: $id eliminado exitosamente"
        ]);
    }
}
