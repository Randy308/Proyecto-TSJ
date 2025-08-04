<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Jurisprudencia> $jurisprudencias
 * @property-read int|null $jurisprudencias_count
 * @mixin \Eloquent
 */
class Restrictor extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];

    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencia::class, 'descriptor_id');
    }
}
