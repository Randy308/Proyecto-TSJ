<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LogsController extends Controller
{
    //

    public function show(Request $request)
    {

        $currentDate = date('Y-m-d');
        $logFileName = "laravel-{$currentDate}.log";
        $filePath = storage_path("logs/{$logFileName}");
        $data = [];
        if (file_exists($filePath)) {

            $data = [
                'size' => filesize($filePath),
                'last_modified' => date("F d Y H:i:s.", filemtime($filePath)),
                'created_at' => date("F d Y H:i:s.", filectime($filePath)),
                'logs' => file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES),
            ];
        }
        return response()->json(['message' => 'Logs retrieved successfully', 'data' => $data], 200);
    }

    public function limpiarTodosLosLogs()
    {
        $logFiles = File::glob(storage_path('logs/*.log'));

        foreach ($logFiles as $file) {
            File::delete($file);
        }

        return response()->json(['message' => 'Todos los archivos de logs han sido eliminados.']);
    }
}
