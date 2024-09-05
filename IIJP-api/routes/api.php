<?php

use App\Http\Controllers\Api\ResolutionController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\TemaController;

use App\Http\Controllers\MagistradosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/temas-generales', [TemaController::class, 'verTemasGenerales'])->name('temas-generales');

Route::get('/resoluciones', [ResolutionController::class, 'obtenerAvg'])->name('resoluciones');

Route::get('/resolucion/{id}', [ResolutionController::class, 'show'])->name('show-resolucion');
Route::get('/salas', [SalaController::class, 'index'])->name('index-salas');

Route::get('/salas-hijos/{id}', [TemaController::class, 'obtenerHijos'])->name('hijos-salas');


Route::get('/cronologias', [TemaController::class, 'obtenerCronologias'])->name('cronologias');



Route::get('/obtener-parametros', [ResolutionController::class, 'obtenerParametros'])->name('obtener-parametros');
Route::get('/filtrar-resoluciones', [ResolutionController::class, 'filtrarResoluciones'])->name('filtrar-resoluciones');
Route::get('/obtener-parametros-cronologia', [TemaController::class, 'obtenerParametrosCronologia'])->name('obtener-parametros-cronologia');

Route::get('/magistrados', [MagistradosController::class, 'index'])->name('obtener-magistrados');

Route::get('/magistrado-estadisticas/{id}', [MagistradosController::class, 'obtenerEstadisticas'])->name('obtener-estadisticas-magistrado');


Route::get('/all-resoluciones', [ResolutionController::class, 'index'])->name('all-resolutions');

Route::get('/obtener-datos-magistrado/{id}', [MagistradosController::class, 'obtenerDatos'])->name('obtener-datos-magistrado');

Route::get('/obtener-resoluciones-magistrado', [MagistradosController::class, 'obtenerResoluciones'])->name('obtener-resoluciones-magistrado');
