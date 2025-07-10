<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{

    public function Authuser(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'Usuario autenticado correctamente.',
                'user' => new UserResource($user),
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No se ha encontrado el usuario autenticado.',
            ], 401);
        }
    }

    public function login(Request $request)
    {

        Log::info('CSRF Token from header: ' . $request->header('X-CSRF-TOKEN'));
        Log::info('CSRF Token from session: ' . $request->session()->token());
        Log::info('XSRF-TOKEN from header:', [$request->header('X-XSRF-TOKEN')]);


        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:4',
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser una dirección válida.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 4 caracteres.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso.',
            'login' => true,
            'user' => new UserResource($user),
            'rol' => $user->getRoleNames(),
        ]);
    }

    public function logout(Request $request)
    {
        $response['success'] = false;

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $response['success'] = true;
        $response['message'] = 'Sesión cerrada correctamente';

        return response()->json($response, 200);
    }


    public function register(Request $request)
    {
        $response = ['success' => false];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.min' => 'El nombre debe tener al menos 3 caracteres.',
            'name.max' => 'El nombre no puede tener más de 50 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser una dirección válida.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        // $role = Role::create(['name' => 'admin']);
        // $role = Role::create(['name' => 'user']);
        $user->assignRole('user');

        $response['success'] = true;
        //$response['user'] =  $user;
        //$response['token'] = $user->createToken('web token')->plainTextToken;
        return response()->json($response, 200);
    }
}
