<?php

use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\ArimaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompareController;
use App\Http\Controllers\Api\MagistradosController;
use App\Http\Controllers\Api\ResolutionController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\TemaController;
use App\Http\Controllers\Api\User\TimeSeriesController;
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

Route::prefix('v1')->group(function () {

    Route::post('auth/login', [AuthController::class, 'login']);

    Route::post('auth/register', [AuthController::class, 'register']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::apiResource('admin/user', UserController::class);
    });

    Route::get('/obtener-serie-temporal/{id}', [TimeSeriesController::class, 'obtenerSerieTemporal']);
});

Route::get('/estadisticas-xy', [SalaController::class, 'obtenerEstadisticasXY']);
Route::get('/estadisticas-xyz', [SalaController::class, 'obtenerEstadisticasXYZ']);
Route::get('/estadisticas-x', [SalaController::class, 'obtenerEstadisticasX']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//salas
Route::get('/obtener-parametros-salas', [SalaController::class, 'getParamsSalas']);

//rutas cronologias

Route::get('/nodos-principales', [TemaController::class, 'verTemasGenerales'])->name('temas-generales');
Route::get('/nodos-hijos/{id}', [TemaController::class, 'obtenerHijos'])->name('hijos-salas');

Route::get('/obtener-nodos', [TemaController::class, 'obtenerNodos'])->name('obtener-nodos');




Route::get('/resoluciones', [ResolutionController::class, 'obtenerAvg'])->name('resoluciones');

Route::get('/resolucion/{id}', [ResolutionController::class, 'show'])->name('show-resolucion');
Route::get('/salas', [SalaController::class, 'index'])->name('index-salas');




Route::get('/obtener-parametros', [ResolutionController::class, 'obtenerParametros'])->name('obtener-parametros');
Route::get('/filtrar-resoluciones', [ResolutionController::class, 'filtrarResoluciones'])->name('filtrar-resoluciones');
Route::get('/obtener-parametros-cronologia', [TemaController::class, 'obtenerParametrosCronologia'])->name('obtener-parametros-cronologia');

Route::get('/magistrados', [MagistradosController::class, 'index'])->name('obtener-magistrados');

Route::get('/magistrado-estadisticas/{id}', [MagistradosController::class, 'obtenerEstadisticas'])->name('obtener-estadisticas-magistrado');


Route::get('/all-resoluciones', [ResolutionController::class, 'index'])->name('all-resolutions');

Route::get('/obtener-resoluciones-magistrado', [MagistradosController::class, 'obtenerResoluciones'])->name('obtener-resoluciones-magistrado');


Route::get('/obtener-filtradores', [ResolutionController::class, 'obtenerFiltradores'])->name('obtener-filtradores');

Route::get('/obtener-estadisticas-res', [ResolutionController::class, 'obtenerEstadisticasRes']);

Route::get('/obtener-coautores', [MagistradosController::class, 'obtenerCoAutores'])->name('obtener-coautores');


//rutas de salas

Route::get('/all-salas', [SalaController::class, 'getSalas'])->name('all-salas');
Route::get('/obtener-datos-sala/{id}', [SalaController::class, 'show'])->name('obtener-datos-sala');


//rutas magistrados

Route::get('/magistrado-estadisticas-departamentos/{id}', [MagistradosController::class, 'obtenerResolucionesDepartamento'])->name('est-mag-dep');
Route::get('/magistrado-estadisticas-v2/{id}', [MagistradosController::class, 'obtenerEstadistica'])->name('est-mag-v2');
Route::get('/magistrado-estadisticas-salas/{id}', [MagistradosController::class, 'obtenerEstadisticaSalas'])->name('est-mag-salas');
Route::get('/magistrado-estadisticas-juris/{id}', [MagistradosController::class, 'obtenerEstadisticaTipoJuris'])->name('est-mag-juris');

Route::get('/obtener-datos-magistrado/{id}', [MagistradosController::class, 'obtenerDatos'])->name('obtener-datos-magistrado');

Route::get('/obtener-paramentros-magistrado', [MagistradosController::class, 'magistradosParamentros']);


Route::get('/magistrado-estadisticas-xy' , [MagistradosController::class , 'obtenerEstadisticasXY']);
Route::get('/magistrado-estadisticas-x' , [MagistradosController::class , 'obtenerEstadisticasX']);

//rutas de comparación de datos
Route::get('/obtener-elemento', [CompareController::class, 'obtenerElemento'])->name('obtener-elemento');
Route::get('/get-params', [CompareController::class, 'getParams'])->name('get-params');
Route::get('/get-dates', [CompareController::class, 'getDates']);





Route::get('/get-time-series', [MagistradosController::class, 'generarSerieTemporal']);


Route::get('/cronologias', [TemaController::class, 'obtenerCronologias'])->name('cronologias');


Route::get('/obtener-datos-salas', [SalaController::class, 'getbyIDs']);



Route::get('/test-arima', [ArimaController::class, 'test_arima']);
