<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function index()
    {
        $data = User::all();
        return response()->json($data, 200);
    }


    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        $validatedData['password'] = bcrypt($validatedData['password']);
        $user = User::create($validatedData);
        $user->assignRole('user');

        return response()->json($user, 201);
    }


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->fill($request->all());
        $user->save();

        return response()->json($user, 200);
    }


    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente'], 200);
    }
}
