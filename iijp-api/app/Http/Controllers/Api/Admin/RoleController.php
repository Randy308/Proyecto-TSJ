<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::where('name', '!=', 'admin')->get();


        $data = $roles->map(function ($role) {
            return [
                'id' => $role->id,
                'roleName' => $role->name,
                'permissions' => $role->permissions->pluck('id'),
            ];
        });

        return response()->json($data->toArray(), 200);
    }


    public function store(Request $request)
    {

        $request->validate([
            'roleName' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'required|array',
        ]);


        $role_name = $request->roleName;
        $role = Role::create(['name' => $role_name]);

        $permissions = Permission::find($request->permissions);
        //$permissions = $request->permissions;
        $role->givePermissionTo($permissions);

        return response()->json([
            'message' => 'Rol creado correctamente!',
            'role' => $role,
        ], 201);
    }

    public function show($id)
    {

        $role = Role::with('permissions')->findOrFail($id);
        $responseData = [
            'id' => $role->id,
            'roleName' => $role->name,
            'permissions' => $role->permissions->pluck('id'),
        ];

        return response()->json($responseData, 200);
    }


    public function update(Request $request, $id)
    {

        $request->validate([
            'roleName' => 'required|string|max:255|unique:roles,name,' . $id,
            'permissions' => 'required|array',
        ]);


        $role = Role::findOrFail($id);

        if ($role->name === 'admin') {

            return response()->json([
                'message' => 'No se puede editar este rol.',
            ], 400);
        }


        $role->name = $request->roleName;
        $role->save();

        $permissions = $request->permissions;
        $role->syncPermissions($permissions);

        return response()->json([
            'message' => 'Rol actualizado correctamente!'
        ], 200);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if (!$role) {
            return response()->json([
                'message' => 'Rol no encontrado.',
            ], 404);
        }

        //return response()->json($role->name, 200);
        if ($role->name === 'admin') {

            return response()->json([
                'message' => 'No se puede eliminar este rol.',
            ], 400);
        }

        Role::where('id', $role->id)->delete();

        //$role->delete();

        return response()->json([
            'message' => 'Rol eliminado correctamente!',
        ], 200);
    }
}
