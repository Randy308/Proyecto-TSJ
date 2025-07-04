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
        'api/v2/obtener-cronologias-ids',
        'api/v2/obtener-cronologias',
        'api/v2/obtener-resoluciones-ids'
    ];
}
