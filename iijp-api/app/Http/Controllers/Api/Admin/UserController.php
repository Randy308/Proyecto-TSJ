<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index()
    {

        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin');
        })->paginate(20);


        $users->getCollection()->transform(function ($user) {
            $user->role = $user->getRoleNames()->first();
            return $user;
        });

        return response()->json($users, 200);
    }




    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);

        $user->role = $user->getRoleNames()->first();


        return response()->json($user, 200);
    }


    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'role' => 'required|string|max:255|exists:roles,name',
        ]);

        $validatedData['password'] = bcrypt($validatedData['password']);


        $role = Role::where('name', $validatedData['role'])->first();
        if (!$role) {
            return response()->json(['error' => 'Role not found'], 400);
        }

        $user = User::create($validatedData);

        $user->assignRole($validatedData['role']);

        return response()->json($user->only(['id', 'name', 'email', 'role']), 201);
    }


    public function update(Request $request, $id)
    {

        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|min:8',
            'role' => 'nullable|string|max:255|exists:roles,name',
        ]);

        

        $user = User::findOrFail($id);

        if ($request->has('name')) {
            $user->name = $validatedData['name'];
        }

        if ($request->has('email')) {
            $user->email = $validatedData['email'];
        }

        if ($request->has('password')) {
            $user->password = bcrypt($validatedData['password']);
        }

        if ($request->has('role')) {
            $user->syncRoles([$validatedData['role']]);
        }

        $user->save();

        return response()->json($user->only(['id', 'name', 'email', 'role']), 200);
    }


    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->hasRole('admin')) {
            return response()->json([
                'message' => 'No se puede eliminar un usuario administrador.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente',
        ], 200);
    }
}
