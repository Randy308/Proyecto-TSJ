<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //

    public function login(Request $request)
    {

        $response = ['success' => false];

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
        //return $request;

        if (auth()->attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = auth()->user();
            //$user->hasRole('user');
            $response['success'] = true;
            $response['message'] = "Login exitoso";
            $response['user'] =  $user;
            $response['token'] = $user->createToken('web-token')->plainTextToken;
        } else {
            $response['user'] = ['no encontrado'];
        }


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
        $user->assignRole('user');

        $response['success'] = true;
        //$response['user'] =  $user;
        //$response['token'] = $user->createToken('web token')->plainTextToken;
        return response()->json($response, 200);
    }
    public function logout()
    {
        $response['success'] = false;
        auth()->user()->tokens()->delete();
        $response['success'] = true;
        $response['message'] = 'Sesión cerrada correctamente';
        return response()->json($response, 200);
    }
}
