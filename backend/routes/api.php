<?php

use App\Http\Controllers\Api\Admin\NotificationController;
use App\Http\Controllers\Api\Admin\PermissionController;
use App\Http\Controllers\Api\Admin\RoleController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\ArimaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompareController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\ExcelController;
use App\Http\Controllers\Api\FormaDecisionController;
use App\Http\Controllers\Api\JurisprudenciasController;
use App\Http\Controllers\Api\MagistradosController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ResolutionController;
use App\Http\Controllers\Api\ResuelveFondoController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\SearchController;
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

    // rutas de busqueda
    Route::get('/test', [SearchController::class, 'test']);
    Route::post('/resoluciones-ids', [SearchController::class, 'obtenerResolucionesIds']);
    Route::get('/filtrar-autos-supremos', [SearchController::class, 'filtrarAutosSupremos']);
    Route::get('/terminos-jurisprudencias', [SearchController::class, 'busquedaTerminos']);
    Route::get('/buscar-jurisprudencias', [SearchController::class, 'obtenerResolucionesCronologia']);
    Route::post('/buscar-resoluciones', [SearchController::class, 'buscarResolucionesAvanzado']);
    Route::get('/obtener-serie-terminos', [SearchController::class, 'buscarSerieTemporal']);

    // rutas de cronología
    Route::get('/descriptores/{id}', [JurisprudenciasController::class, 'buscarDescriptorById']);
    Route::get('/buscar-descriptores', [JurisprudenciasController::class, 'buscarDescriptor']);

    Route::get('/refrescar-nodos', [JurisprudenciasController::class, 'actualizarNodo']);
    Route::post('/cronologias', [TemaController::class, 'obtenerCronologias'])->name('cronologias');
    Route::post('/cronologias-ids', [TemaController::class, 'obtenerCronologiasbyIds']);
    Route::get('/nodos', [TemaController::class, 'obtenerNodos'])->name('obtener-nodos');

    // rutas validadas
    Route::post('/actualizar-filtros', [ResolutionController::class, 'actualizarFiltros']);
    Route::get('/variables', [ResolutionController::class, 'obtenerVariables']);
    Route::get('/estadisticas-por-sala', [ResolutionController::class, 'obtenerEstadisticasPorSala']);
    Route::get('/estadisticas', [ResolutionController::class, 'obtenerEstadisticas']);
    Route::post('/estadisticas-multivariables', [ResolutionController::class, 'obtenerEstadisticasMultivariable']);
    Route::post('/estadisticas-xy', [ResolutionController::class, 'obtenerEstadisticasMultivariableSala']);
    Route::get('/filtros-estadisticas', [ResolutionController::class, 'obtenerFiltros']);

    // rutas estadísticas resumen
    Route::get('/historicos', [ResolutionController::class, 'index']);

    Route::get('/serie-temporal-magistrados/{id}', [MagistradosController::class, 'obtenerSerieTemporal']);

    // rutas estadísticas básicas para salas

    // rutas estadísticas avanzadas
    Route::get('/terminos-avanzados', [ResolutionController::class, 'obtenerTerminos']);
    Route::get('/buscar-terminos', [ResolutionController::class, 'buscarTerminos']);
    Route::get('/estadisticas-avanzadas-x', [ResolutionController::class, 'getTerminosX']);
    Route::get('/estadisticas-avanzadas-xy', [ResolutionController::class, 'getTerminosXY']);
    Route::get('/series-temporales-x', [ResolutionController::class, 'obtenerSerieTemporalX']);
    Route::get('/mapas-x', [ResolutionController::class, 'obtenerMapaX']);
    Route::get('/buscar-resoluciones-xy', [ResolutionController::class, 'buscarResolucionesXY']);

    // rutas búsqueda
    Route::get('/busqueda-parametros', [CompareController::class, 'getParams'])->name('get-params');
    Route::get('/resoluciones/{id}', [ResolutionController::class, 'show']);
    // predicción
    Route::get('/predicciones', [ArimaController::class, 'realizarPrediction']);

    // Route::get('/descomponer-serie', [MagistradosController::class, 'descomponerSerie']);

    // rutas para comparar datos
    Route::get('/fechas', [CompareController::class, 'getDates']);
    Route::get('/elementos', [CompareController::class, 'obtenerElemento'])->name('obtener-elemento');

    // rutas admin

    Route::middleware(['web'])->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        // Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/auth/login', [AuthController::class, 'login']);
        Route::post('/auth/register', [AuthController::class, 'register']);
    });

    Route::group(['middleware' => 'auth:sanctum'], function () {
        // Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/auth-user', [AuthController::class, 'Authuser']);
        Route::put('/actualizar-perfil', [AuthController::class, 'updateUser']);
        Route::apiResource('/admin/users', UserController::class);
        Route::apiResource('/admin/roles', RoleController::class);
        Route::apiResource('/forma-decisiones', FormaDecisionController::class);
        Route::apiResource('/resuelve-fondos', ResuelveFondoController::class);

        Route::get('/admin/permisos', [PermissionController::class, 'index']);
        Route::put('/actualizar-todas-notificaciones', [NotificationController::class, 'updateAll']);

        Route::get('/admin/resoluciones', [ResolutionController::class, 'userResolutions']);
        Route::post('/admin/magistrados/{id}', [MagistradosController::class, 'update']);

        Route::post('/subir-resoluciones', [ExcelController::class, 'handleUpload'])->name('excel.upload');
        Route::post('/subir-jurisprudencia', [ExcelController::class, 'upload_jurisprudencia'])->name('excel.upload.jurisprudencia');
        Route::post('/subir-resuelve-fondo', [ExcelController::class, 'upload_resuelve_fondo'])->name('excel.upload_resuelve_fondo');
        Route::post('/buscar-nuevas-resoluciones', [WebScrappingController::class, 'buscarResolucionesTSJ']);
        Route::post('/obtener-resoluciones', [WebScrappingController::class, 'obtenerResolucionesTSJ']);

        Route::get('/obtener-no-leidas', [NotificationController::class, 'unread']);
        Route::get('/notificaciones', [NotificationController::class, 'index']);
        Route::put('/notificaciones/{id}', [NotificationController::class, 'update']);
        Route::post('/generar-terminos-claves', [ConfigController::class, 'generarTerminosClaveUnificados']);
        Route::post('/reparar-departamentos', [ConfigController::class, 'repararDepartamentos']);
        Route::post('/reparar-fechas-emisiones', [ConfigController::class, 'repararFechasEmision']);
        Route::post('/generar-nodos', [ConfigController::class, 'generarResumenJerarquico']);
    });

    Route::middleware('auth:api')->get('/user', function (Request $request) {
        return $request->user();
    });

    // rutas de prueba
    Route::get('/test-arima', [ArimaController::class, 'test_arima']);

    Route::get('/serie-temporales', [ResolutionController::class, 'obtenerSerieTemporal']);

    // rutas de prueba
    Route::get('/filtros-resoluciones', [ResolutionController::class, 'obtenerOpciones']);

    // rutas no validadas
    Route::get('/parametros', [ResolutionController::class, 'obtenerParametros'])->name('obtener-parametros');
    Route::get('/filtrar-resoluciones', [ResolutionController::class, 'filtrarResoluciones'])->name('filtrar-resoluciones');
    Route::get('/buscar-resoluciones', [CompareController::class, 'obtenerResoluciones']);
});
