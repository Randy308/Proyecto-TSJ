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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ResuelveFondo> $resuelveFondos
 * @property-read int|null $resuelve_fondos_count
 * @mixin \Eloquent
 */
class Sala extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'grupo_sala_id',
    ];

    public function resolutions()
    {
        return $this->hasMany(Resolution::class);
    }
    public function resuelveFondos()
    {
        return $this->hasMany(ResuelveFondo::class);
    }

    public function grupoSala()
    {
        return $this->belongsTo(GrupoSala::class, 'grupo_sala_id');
    }
}
