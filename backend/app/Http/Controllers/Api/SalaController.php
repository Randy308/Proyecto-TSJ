<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GrupoSala;
use App\Models\Sala;
use Illuminate\Http\Request;

class SalaController extends Controller
{
    //
    public function show($id)
    {
        $grupo = Sala::findOrFail($id);
        return response()->json($grupo);
        // Logic to show a specific group room by ID
    }
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nombre' => 'nullable|string|max:255',
            'grupo_sala_id' => 'required|exists:grupo_salas,id',
        ]);

        Sala::findOrFail($id)->update($validatedData);
        return response()->json([
            'message' => 'GrupoSala updated successfully'
        ]);
        // Logic to update a specific group room by ID
    }
    public function destroy($id)
    {
        $grupo = Sala::find($id);
        $grupo->delete();
        return response()->json([
            'message' => 'Sala deleted successfully'
        ]);
        // Logic to delete a specific group room by ID  
    }
    public function index()
    {
        // Logic to list all group rooms
        $grupos = Sala::with('grupoSala')->get()->map(function ($sala) {
            return [
                'id' => $sala->id,
                'nombre' => $sala->nombre,
                'grupo_sala_id' => $sala->grupo_sala_id,
                'grupo_sala' => $sala->grupoSala?->nombre
            ];
        })->toArray();

        return response()->json($grupos);
    }
}
