<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nombre
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Resolution> $resolutions
 * @property-read int|null $resolutions_count
 * @mixin \Eloquent
 */
class TipoResolucion extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];

    public function resolutions()
    {
        return $this->hasMany(Resolution::class);
    }
}
