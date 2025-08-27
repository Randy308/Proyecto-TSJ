<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        "api/v2/estadisticas-multivariables",
        'api/v2/resoluciones-ids',
        'api/v2/buscar-resoluciones',
        'api/v2/cronologias',
        'api/v2/cronologias-ids',
        'api/v2/estadisticas-xy',
        'api/v2/actualizar-filtros',
        'api/v2/buscar-jurisprudencia-avanzado',
    ];
}
