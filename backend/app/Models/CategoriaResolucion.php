<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriaResolucion extends Model
{
    protected $table = 'categoria_resoluciones';

    protected $fillable = [
        'nombre',
        'slug',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function resolutions()
    {
        return $this->hasMany(Resolutions::class, 'categoria_resolucion_id');
    }
}
