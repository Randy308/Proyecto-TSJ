<?php

use App\Http\Controllers\Api\Admin\PermissionController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\ArimaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompareController;
use App\Http\Controllers\Api\ExcelController;
use App\Http\Controllers\Api\JurisprudenciasController;
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

Route::prefix('v2')->group(function () {


    #rutas validadas

    //rutas estadísticas básicas para magistrado
    Route::get('/obtener-historico', [ResolutionController::class, 'index']);
    Route::get('/magistrados', [MagistradosController::class, 'index']);
    Route::get('/obtener-datos-magistrado/{id}', [MagistradosController::class, 'obtenerDatos']);
    Route::get('/magistrado-estadisticas-departamentos/{id}', [MagistradosController::class, 'obtenerResolucionesDepartamento']);
    Route::get('/obtener-paramentros-magistrado', [MagistradosController::class, 'magistradosParamentros']);
    Route::get('/magistrado-estadisticas-xy', [MagistradosController::class, 'obtenerEstadisticasXY']);
    Route::get('/magistrado-estadisticas-x', [MagistradosController::class, 'obtenerEstadisticasX']);
    Route::get('/magistrado-serie-temporal/{id}', [MagistradosController::class, 'obtenerSerieTemporal']);


    //rutas estadísticas básicas para salas
    Route::get('/obtener-parametros-salas', [SalaController::class, 'getParamsSalas']);
    Route::get('/obtener-salas', [SalaController::class, 'getSalas']);
    Route::get('/estadisticas-x', [SalaController::class, 'obtenerEstadisticasX']);
    Route::get('/estadisticas-xy', [SalaController::class, 'obtenerEstadisticasXY']);
    Route::get('/obtener-datos-salas', [SalaController::class, 'getByIDs']);

    //rutas estadísticas avanzadas
    Route::get('/obtener-terminos-avanzados', [ResolutionController::class, 'obtenerTerminos']);
    Route::get('/buscar-terminos', [ResolutionController::class, 'buscarTerminos']);
    Route::get('/obtener-estadistica-avanzada-x', [ResolutionController::class, 'getTerminosX']);
    Route::get('/obtener-estadistica-avanzada-xy', [ResolutionController::class, 'getTerminosXY']);
    //rutas búsqueda
    Route::get('/obtener-parametros-busqueda', [CompareController::class, 'getParams'])->name('get-params');
    Route::get('/filtrar-autos-supremos', [ResolutionController::class, 'filtrarResolucionesContenido']);
    Route::get('/resolucion/{id}', [ResolutionController::class, 'show']);
    //predicción
    Route::get('/realizar-prediction', [ArimaController::class, 'realizarPrediction']);

    #Route::get('/descomponer-serie', [MagistradosController::class, 'descomponerSerie']);


    //rutas para comparar datos
    Route::get('/obtener-fechas', [CompareController::class, 'getDates']);
    Route::get('/obtener-elemento', [CompareController::class, 'obtenerElemento'])->name('obtener-elemento');

    //rutas de cronología
    Route::get('/buscar-termino-jurisprudencia', [JurisprudenciasController::class, 'busquedaTerminos']);
    Route::get('/actualizar-nodo', [JurisprudenciasController::class, 'actualizarNodo']);
    Route::get('/obtener-cronologias', [TemaController::class, 'obtenerCronologias'])->name('cronologias');
    Route::get('/obtener-parametros-cronologia', [TemaController::class, 'obtenerParametrosCronologia']);
    Route::get('/obtener-nodos', [TemaController::class, 'obtenerNodos'])->name('obtener-nodos');



    //rutas admin
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::post('auth/register', [AuthController::class, 'register']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::apiResource('admin/user', UserController::class);
        Route::apiResource('admin/roles', RoleController::class);
        Route::get('admin/permisos', [PermissionController::class, 'index']);

        Route::post('/subir-resoluciones', [ExcelController::class, 'upload'])->name('excel.upload');
        Route::post('/subir-jurisprudencia', [ExcelController::class, 'upload_jurisprudencia'])->name('excel.upload.jurisprudencia');
    });

    Route::middleware('auth:api')->get('/user', function (Request $request) {
        return $request->user();
    });

    #rutas de prueba
    Route::get('/test-arima', [ArimaController::class, 'test_arima']);
    Route::get('/obtencion-resoluciones', [ResolutionController::class, 'obtenerResolucionesTSJ']);
    Route::get('/obtener-serie-temporal', [ResolutionController::class, 'obtenerSerieTemporal']);












    #rutas no validadas

    Route::get('/obtener-serie-temporal/{id}', [TimeSeriesController::class, 'obtenerSerieTemporal']);
    Route::get('/obtener-parametros', [ResolutionController::class, 'obtenerParametros'])->name('obtener-parametros');
    Route::get('/filtrar-resoluciones', [ResolutionController::class, 'filtrarResoluciones'])->name('filtrar-resoluciones');
    #Route::get('/obtener-datos-sala/{id}', [SalaController::class, 'show'])->name('obtener-datos-sala');
    Route::get('/buscar-resoluciones', [CompareController::class, 'obtenerResoluciones']);
});
