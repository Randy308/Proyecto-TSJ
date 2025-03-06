<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{

    public function index()
    {
        $posts = Post::all();
        return response()->json($posts, 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'titulo' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $user = Auth::user();
        $post = new Post();
        $post->user_id = $user->id; 

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName = time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/posts', $fileName);
            $post->ruta_imagen = str_replace('public/', 'storage/', $path); 
        }

        $post->titulo = $request->titulo;
        $post->description = $request->description;
        $post->save();

        return response()->json(['message' => 'Publicación creada con éxito', 'post' => $post], 201);
    }



    public function create()
    {
        //
    }


    public function show($id)
    {
        $post = Post::findOrFail($id);

        return response()->json([
            'message' => 'Publicación encontrada con éxito',
            'post' => $post
        ], 200);
    }


    public function edit(Post $post)
    {
        //
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'titulo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $post = Post::findOrFail($id);

        if ($request->hasFile('image')) {
            if ($post->ruta_imagen && Storage::exists(str_replace('storage/', 'public/', $post->ruta_imagen))) {
                Storage::delete(str_replace('storage/', 'public/', $post->ruta_imagen));
            }

            $image = $request->file('image');
            $fileName = time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/posts', $fileName);
            $post->ruta_imagen = str_replace('public/', 'storage/', $path);
        }

        if ($request->filled('titulo')) {
            $post->titulo = $request->titulo;
        }

        if ($request->filled('description')) {
            $post->description = $request->description;
        }

        $post->save();

        return response()->json(['message' => 'Publicación actualizada con éxito', 'post' => $post], 200);
    }



    public function destroy($id)
    {
        $post = Post::findOrFail($id);


        $post->delete();

        return response()->json([
            'message' => 'Publicación eliminada correctamente',
        ], 200);
    }

    public function obtenerActivos(){

        $posts = Post::where('estado', 'Activo')->limit(3)->get();
        if ($posts->isEmpty()) {
            $posts = Post::orderBy('updated_at', 'desc')->limit(3)->get();
        }
        return response()->json($posts, 200);
    }
}
