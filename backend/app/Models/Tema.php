<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Resolution> $resolutions
 * @property-read int|null $resolutions_count
 * @property-read Tema|null $tema
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Tema> $temas
 * @property-read int|null $temas_count
 * @mixin \Eloquent
 */
class Tema extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'tema_id',
    ];

    public function tema()
    {
        return $this->belongsTo(Tema::class, 'tema_id');
    }

    public function temas()
    {
        return $this->hasMany(Tema::class, 'tema_id');
    }

    public function resolutions()
    {
        return $this->hasMany(Resolution::class);
    }
}
