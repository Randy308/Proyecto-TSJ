<?php

use App\Http\Controllers\Api\CompareController;
use App\Http\Controllers\Api\MagistradosController;
use App\Http\Controllers\Api\ResolutionController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\TemaController;

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


Route::get('/obtener-filtradores', [ResolutionController::class, 'obtenerFiltradores'])->name('obtener-filtradores');

Route::get('/obtener-estadisticas-res', [ResolutionController::class, 'obtenerEstadisticasRes'])->name('obtener-filtradores');

Route::get('/obtener-coautores/{id}', [MagistradosController::class, 'obtenerCoAutores'])->name('obtener-coautores');


//rutas de salas

Route::get('/all-salas', [SalaController::class, 'getSalas'])->name('all-salas');
Route::get('/obtener-datos-sala/{id}', [SalaController::class, 'show'])->name('obtener-datos-sala');


//rutas magistrados

Route::get('/magistrado-estadisticas-departamentos/{id}', [MagistradosController::class, 'obtenerResolucionesDepartamento'])->name('estadisticas-magistrado-departamentos');


//rutas de comparación de datos
Route::get('/obtener-elemento', [CompareController::class, 'obtenerElemento'])->name('obtener-elemento');
Route::get('/get-params', [CompareController::class, 'getParams'])->name('get-params');

