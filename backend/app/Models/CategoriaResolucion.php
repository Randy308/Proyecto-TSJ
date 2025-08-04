<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string|null $nombre
 * @property string|null $slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Resolution> $resolutions
 * @property-read int|null $resolutions_count
 * @mixin \Eloquent
 */
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
        return $this->hasMany(Resolution::class, 'categoria_resolucion_id');
    }
}
