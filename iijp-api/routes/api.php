<?php

use App\Http\Controllers\Api\Admin\NotificationController;
use App\Http\Controllers\Api\Admin\PermissionController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\ArimaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompareController;
use App\Http\Controllers\Api\DescriptorController;
use App\Http\Controllers\Api\ExcelController;
use App\Http\Controllers\Api\JurisprudenciasController;
use App\Http\Controllers\Api\MagistradosController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ResolutionController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\TemaController;
use App\Http\Controllers\Api\User\TimeSeriesController;
use App\Http\Controllers\Api\WebScrappingController;
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



    //rutas de cronología
    Route::post('/obtener-resoluciones-ids', [JurisprudenciasController::class, 'obtenerResolucionesIds']);
    Route::get('/buscar-termino-jurisprudencia', [JurisprudenciasController::class, 'busquedaTerminos']);
    Route::get('/obtener-serie-terminos', [JurisprudenciasController::class, 'buscarSerieTemporal']);
    Route::get('/obtener-descriptor/{id}', [JurisprudenciasController::class, 'buscarDescriptorById']);
    Route::get('/buscar-descriptor', [JurisprudenciasController::class, 'buscarDescriptor']);

    Route::get('/actualizar-nodo', [JurisprudenciasController::class, 'actualizarNodo']);
    Route::post('/obtener-cronologias', [TemaController::class, 'obtenerCronologias'])->name('cronologias');
    Route::post('/obtener-cronologias-ids', [TemaController::class, 'obtenerCronologiasbyIds']);

    Route::get('/obtener-parametros-cronologia', [TemaController::class, 'obtenerParametrosCronologia']);
    Route::get('/obtener-nodos', [TemaController::class, 'obtenerNodos'])->name('obtener-nodos');
    Route::get('/obtener-resoluciones-cronologia', [TemaController::class, 'obtenerResolucionesCronologia']);


    #rutas validadas

    Route::get('/obtener-variables', [ResolutionController::class, 'obtenerVariables']);

    Route::get('/obtener-estadisticas', [ResolutionController::class, 'obtenerEstadisticas']);
    Route::get('/obtener-estadisticas-xy', [ResolutionController::class, 'obtenerEstadisticasXY']);
    Route::get('/obtener-filtros-estadisticas', [ResolutionController::class, 'obtenerFiltros']);

    //rutas estadísticas resumen
    Route::get('/obtener-historico', [ResolutionController::class, 'index']);



    Route::get('/magistrado-serie-temporal/{id}', [MagistradosController::class, 'obtenerSerieTemporal']);


    //rutas estadísticas básicas para salas


    //rutas estadísticas avanzadas
    Route::get('/obtener-terminos-avanzados', [ResolutionController::class, 'obtenerTerminos']);
    Route::get('/buscar-terminos', [ResolutionController::class, 'buscarTerminos']);
    Route::get('/obtener-estadistica-avanzada-x', [ResolutionController::class, 'getTerminosX']);
    Route::get('/obtener-estadistica-avanzada-xy', [ResolutionController::class, 'getTerminosXY']);
    Route::get('/obtener-serie-temporal-x', [ResolutionController::class, 'obtenerSerieTemporalX']);
    Route::get('/obtener-mapa-x', [ResolutionController::class, 'obtenerMapaX']);
    Route::get('/buscar-resolutions-xy', [ResolutionController::class, 'buscarResolucionesXY']);

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


    //rutas admin

    Route::middleware(['web'])->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        //Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('auth/login', [AuthController::class, 'login']);
        Route::post('auth/register', [AuthController::class, 'register']);
    });

    Route::get('/auth-user', [AuthController::class, 'Authuser']);



    Route::group(['middleware' => 'auth:sanctum'], function () {
        //Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::apiResource('admin/user', UserController::class);
        Route::apiResource('admin/roles', RoleController::class);
        Route::apiResource('admin/post', PostController::class);

        Route::get('admin/permisos', [PermissionController::class, 'index']);

        Route::get('admin/resolutions', [ResolutionController::class, 'userResolutions']);
        Route::post('admin/magistrado/{id}', [MagistradosController::class, 'update']);


        Route::post('/subir-resoluciones', [ExcelController::class, 'upload'])->name('excel.upload');
        Route::post('/subir-jurisprudencia', [ExcelController::class, 'upload_jurisprudencia'])->name('excel.upload.jurisprudencia');

        Route::post('/buscar-nuevas-resoluciones', [WebScrappingController::class, 'buscarResolucionesTSJ']);
        Route::post('/obtener-resoluciones', [WebScrappingController::class, 'obtenerResolucionesTSJ']);


        Route::get('/obtener-no-leidas', [NotificationController::class, 'unread']);
        Route::get('/notificaciones', [NotificationController::class, 'index']);
        Route::put('/actualizar-notificacion/{id}', [NotificationController::class, 'update']);
    });


    Route::middleware('auth:api')->get('/user', function (Request $request) {
        return $request->user();
    });

    #rutas de prueba
    Route::get('/test-arima', [ArimaController::class, 'test_arima']);
    Route::get('/publicaciones-activas', [PostController::class, 'obtenerActivos']);



    Route::get('/obtener-serie-temporal', [ResolutionController::class, 'obtenerSerieTemporal']);



    #rutas de prueba
    Route::get('/obtener-filtros-resoluciones', [ResolutionController::class, 'obtenerOpciones']);
    ROute::get('/test', [DescriptorController::class, 'test']);









    #rutas no validadas

    Route::get('/obtener-serie-temporal/{id}', [TimeSeriesController::class, 'obtenerSerieTemporal']);
    Route::get('/obtener-parametros', [ResolutionController::class, 'obtenerParametros'])->name('obtener-parametros');
    Route::get('/filtrar-resoluciones', [ResolutionController::class, 'filtrarResoluciones'])->name('filtrar-resoluciones');
    #Route::get('/obtener-datos-sala/{id}', [SalaController::class, 'show'])->name('obtener-datos-sala');
    Route::get('/buscar-resoluciones', [CompareController::class, 'obtenerResoluciones']);
});
