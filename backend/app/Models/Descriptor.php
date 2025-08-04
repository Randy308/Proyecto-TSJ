<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nombre
 * @property int|null $descriptor_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Jurisprudencia> $jurisprudencias
 * @property-read int|null $jurisprudencias_count
 * @mixin \Eloquent
 */
class Descriptor extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'id',
        'nombre',
        'descriptor_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencia::class, 'descriptor_id');
    }
}
