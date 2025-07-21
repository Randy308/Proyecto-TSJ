<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $tipo_decision
 * @property int|null $sala_id
 * @property string $nombre
 * @property string $slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Sala|null $sala
 * @mixin \Eloquent
 */
class ResuelveFondo extends Model
{
    //
    protected $table = "resuelve_fondos";
    protected $fillable = ['tipo_decision', 'sala_id', 'nombre', 'slug'];
    public function sala()
    {
        return $this->belongsTo(Sala::class);
    }
    public function resuelveDecisions()
    {
        return $this->hasMany(ResuelveDecision::class, 'resuelve_fondo_id', 'id');
    }
}
