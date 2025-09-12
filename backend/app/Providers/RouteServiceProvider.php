<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });

        RateLimiter::for('cronologias', function (Request $request) {
            if ($request->user()) {

                if ($request->user()->can('administrar_datos')) {
                    return Limit::perMinute(60)->by($request->user()->id);
                }
                return Limit::perDay(6)->by($request->user()->id)->response(function () {
                    Log::warning('Límite de tasa alcanzado para cronologías', ['ip' => request()->ip()]);
                    return response()->json(['rate' => true, 'message' => 'Has alcanzado el límite de solicitudes diarias para cronologías. Por favor, inténtalo de nuevo mañana o mejora '], 429);
                });
            }
            // Visitante
            return Limit::perDay(2)->by($request->ip())->response(function () {
                Log::warning('Límite de tasa alcanzado para cronologías', ['ip' => request()->ip()]);
                return response()->json(['rate' => true, 'message' => 'Has alcanzado el límite de solicitudes diarias para cronologías. Por favor, inténtalo de nuevo mañana o regístrate para obtener más acceso.'], 429);
            });
        });
    }
}
