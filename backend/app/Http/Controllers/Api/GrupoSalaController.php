<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GrupoSala;
use Illuminate\Http\Request;

class GrupoSalaController extends Controller
{
    //
    public function show($id)
    {
        $grupo = GrupoSala::findOrFail($id);
        return response()->json($grupo);
        // Logic to show a specific group room by ID
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255|unique:grupo_salas,nombre',
        ]);

        $grupo = GrupoSala::create($validatedData);
        return response()->json([
            'message' => 'GrupoSala created successfully',
            'grupo' => $grupo
        ], 201);
        // Logic to create a new group room
    }
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        GrupoSala::findOrFail($id)->update($validatedData);
        return response()->json([
            'message' => 'GrupoSala updated successfully'
        ]);
        // Logic to update a specific group room by ID
    }
    public function destroy($id)
    {
        $grupo = GrupoSala::find($id);
        $grupo->delete();
        return response()->json([
            'message' => 'GrupoSala deleted successfully'
        ]);
        // Logic to delete a specific group room by ID  
    }
    public function index()
    {
        // Logic to list all group rooms
        $grupos = GrupoSala::all();
        return response()->json($grupos);
    }
}
