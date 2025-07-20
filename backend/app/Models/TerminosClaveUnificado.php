<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $campo
 * @property string $nombre
 * @property int $cantidad
 * @mixin \Eloquent
 */
class TerminosClaveUnificado extends Model
{
    use HasFactory;

    protected $table = 'terminos_clave_unificados';

    protected $fillable = [
        'nombre',
        'cantidad',
        'campo',
    ];
}
