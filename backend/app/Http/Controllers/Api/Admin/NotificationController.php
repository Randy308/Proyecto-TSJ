<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller



{
    public function updateAll()
    {
        $userId = Auth::id();
        abort_if(! $userId, 403, 'El usuario no está autenticado');
        Notification::where('user_id', $userId)
            ->where('estado', 'unread')
            ->update(['estado' => 'read']);
        return response()->json(['mensaje' => 'Todas las notificaciones han sido actualizadas a leídas'], 200);
    }

    public function index()
    {
        $userId = Auth::id();
        abort_if(! $userId, 403, 'El usuario no está autenticado');

        $notifications = Notification::where('user_id', $userId)->paginate(10);

        if ($notifications->isEmpty()) {
            return response()->json(['mensaje' => 'No tiene notificaciones'], 200);
        }

        return response()->json($notifications, 200);
    }

    public function unread()
    {
        $userId = Auth::id();
        abort_if(! $userId, 403, 'El usuario no está autenticado');

        $notifications = Notification::where('user_id', $userId)
            ->where('estado', 'unread')
            ->get();

        if ($notifications->isEmpty()) {
            return response()->json(['mensaje' => 'No cuenta con notificaciones no leídas'], 200);
        }

        return response()->json($notifications, 200);
    }

    public function update($id)
    {
        $userId = Auth::id();

        abort_if(! $userId, 403, 'El usuario no está autenticado');

        $notification = Notification::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $notification->estado = 'read';
        $notification->save();

        return response()->json(['mensaje' => 'Notificación marcada como leída'], 200);
    }
}
