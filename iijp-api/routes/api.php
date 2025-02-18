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

    //rutas estadisticas basicas para magistrado
    Route::get('/obtener-historico', [ResolutionController::class, 'index']);
    Route::get('/magistrados', [MagistradosController::class, 'index']);
    Route::get('/obtener-datos-magistrado/{id}', [MagistradosController::class, 'obtenerDatos']);
    Route::get('/magistrado-estadisticas-departamentos/{id}', [MagistradosController::class, 'obtenerResolucionesDepartamento']);
    Route::get('/obtener-paramentros-magistrado', [MagistradosController::class, 'magistradosParamentros']);
    Route::get('/magistrado-estadisticas-xy', [MagistradosController::class, 'obtenerEstadisticasXY']);
    Route::get('/magistrado-estadisticas-x', [MagistradosController::class, 'obtenerEstadisticasX']);
    Route::get('/magistrado-serie-temporal/{id}', [MagistradosController::class, 'obtenerSerieTemporal'])->name('obtener-estadisticas-magistrado');


    //rutas estadisticas basicas para salas
    Route::get('/obtener-parametros-salas', [SalaController::class, 'getParamsSalas']);
    Route::get('/obtener-salas', [SalaController::class, 'getSalas']);
    Route::get('/estadisticas-x', [SalaController::class, 'obtenerEstadisticasX']);
    Route::get('/estadisticas-xy', [SalaController::class, 'obtenerEstadisticasXY']);
    Route::get('/obtener-datos-salas', [SalaController::class, 'getbyIDs']);


    #rutas no validadas


    Route::post('auth/login', [AuthController::class, 'login']);

    Route::post('auth/register', [AuthController::class, 'register']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::apiResource('admin/user', UserController::class);
        Route::apiResource('admin/roles', RoleController::class);
        Route::get('admin/permisos', [PermissionController::class, 'index']);

        Route::post('/excel/upload', [ExcelController::class, 'upload'])->name('excel.upload');
        Route::post('/excel/upload-jurisprudencia', [ExcelController::class, 'upload_jurisprudencia'])->name('excel.upload.jurisprudencia');



    });

    Route::get('/obtener-serie-temporal/{id}', [TimeSeriesController::class, 'obtenerSerieTemporal']);

    Route::get('/search-term-jurisprudencia', [JurisprudenciasController::class, 'busquedaTerminos']);
    Route::get('/actualizar-nodo', [JurisprudenciasController::class, 'actualizarNodo']);


    Route::get('/resoluciones-documento', [ResolutionController::class, 'obtenerDocumentoResoluciones']);


    Route::get('/estadisticas-xyz', [SalaController::class, 'obtenerEstadisticasXYZ']);
   

    Route::middleware('auth:api')->get('/user', function (Request $request) {
        return $request->user();
    });

    //salas


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






    Route::get('/obtener-resoluciones-magistrado', [MagistradosController::class, 'obtenerResoluciones'])->name('obtener-resoluciones-magistrado');


    Route::get('/obtener-filtradores', [ResolutionController::class, 'obtenerFiltradores'])->name('obtener-filtradores');

    Route::get('/obtener-estadisticas-res', [ResolutionController::class, 'obtenerEstadisticasRes']);

    Route::get('/obtener-coautores', [MagistradosController::class, 'obtenerCoAutores'])->name('obtener-coautores');



    #Route::get('/obtener-datos-sala/{id}', [SalaController::class, 'show'])->name('obtener-datos-sala');


    //rutas magistrados


    Route::get('/magistrado-estadisticas-salas/{id}', [MagistradosController::class, 'obtenerEstadisticaSalas'])->name('est-mag-salas');
    Route::get('/magistrado-estadisticas-juris/{id}', [MagistradosController::class, 'obtenerEstadisticaTipoJuris'])->name('est-mag-juris');






    //rutas de comparación de datos
    Route::get('/obtener-elemento', [CompareController::class, 'obtenerElemento'])->name('obtener-elemento');
    Route::get('/get-params', [CompareController::class, 'getParams'])->name('get-params');
    Route::get('/get-dates', [CompareController::class, 'getDates']);

    Route::get('/buscar-resoluciones', [CompareController::class, 'obtenerResoluciones']);





    Route::get('/get-time-series', [MagistradosController::class, 'generarSerieTemporal']);


    Route::get('/cronologias', [TemaController::class, 'obtenerCronologias'])->name('cronologias');


 

    Route::get('/test-arima', [ArimaController::class, 'test_arima']);
    Route::get('/realizar-prediccion', [ArimaController::class, 'realizar_prediccion']);


    Route::get('/obtencion-resoluciones', [ResolutionController::class, 'obtenerResolucionesTSJ']);
    Route::get('/filtrar-autos-supremos', [ResolutionController::class, 'filtrarResolucionesContenido']);

    Route::get('/obtener-serie-temporal', [ResolutionController::class, 'obtenerSerieTemporal']);
    Route::get('/obtener-terminos-avanzados', [ResolutionController::class, 'obtenerTerminos']);
    Route::get('/buscar-terminos', [ResolutionController::class, 'buscarTerminos']);
    Route::get('/obtener-estadistica-avanzada-x', [ResolutionController::class, 'getTerminosX']);
    Route::get('/obtener-estadistica-avanzada-xy', [ResolutionController::class, 'getTerminosXY']);


});


