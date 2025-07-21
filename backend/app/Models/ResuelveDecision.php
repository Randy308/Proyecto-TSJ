<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResuelveDecision extends Model
{
    //
    protected $table = "resuelve_decisiones";
    protected $fillable = [
        'resolution_id',
        'resuelve_fondo_id',
        'nombre',
        'tipo',
        'observaciones'
    ];

    public function resolution()
    {
        return $this->belongsTo(Resolution::class, 'resolution_id', 'id');
    }

    public function resuelveFondos()
    {
        return $this->belongsTo(ResuelveFondo::class);
    }
}
