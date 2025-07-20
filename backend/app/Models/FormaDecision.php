<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $resuelve_fondo_id
 * @property int|null $forma_resolucion_id
 * @property string $grupo_decision
 * @property string|null $tipo_decision
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FormaResolucion|null $formaResolucion
 * @property-read \App\Models\ResuelveFondo|null $resuelveFondo
 * @mixin \Eloquent
 */
class FormaDecision extends Model
{
    //
    protected $table = "forma_decisiones";
    protected $fillable = ['resuelve_fondo_id', 'forma_resolucion_id', 'grupo_decision', 'tipo_decision'];

    public function resuelveFondo()
    {
        return $this->belongsTo(ResuelveFondo::class);
    }
    public function formaResolucion()
    {
        return $this->belongsTo(FormaResolucion::class);
    }
    
}
