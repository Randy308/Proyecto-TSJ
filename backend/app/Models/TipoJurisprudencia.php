<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nombre
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Jurisprudencia> $jurisprudencias
 * @property-read int|null $jurisprudencias_count
 * @mixin \Eloquent
 */
class TipoJurisprudencia extends Model
{
    use HasFactory;

    protected $table = 'tipo_jurisprudencias';

    protected $fillable = [
        'nombre',
    ];

    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencia::class);
    }
}
