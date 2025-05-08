<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Resolutions extends Model
{
    use HasFactory;

    protected $fillable = [
        'nro_resolucion',
        'nro_expediente',
        'fecha_emision',
        'fecha_publicacion',
        'tipo_resolucion_id',
        'departamento_id',
        'sala_id',
        'magistrado_id',
        'forma_resolucion_id',
        'proceso',
        'precedente',
        'demandante',
        'demandado',
        'tema_id',
        'maxima',
        'sintesis',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    // protected $appends = ['tipo_resolucion','sala','departamento','forma_resolucion','magistrado','tema','contenido'];

    // protected $hidden = [
    //     'tipo_resolucion_relacion',
    //     'departamento_relacion',
    //     'sala_relacion',
    //     'forma_resolucion_relacion',
    //     'magistrado_relacion',
    //     'tema_relacion',
    //     'contenido_relacion',
    // ];

    // public function getContenidoAttribute()
    // {
    //     return $this->contenido_relacion?->contenido ?? null;
    // }
    // public function contenido_relacion()
    // {
    //     return $this->hasOne(Contents::class, 'resolution_id', 'id');
    // }
    // public function getTipoResolucionAttribute()
    // {
    //     return $this->tipo_resolucion_relacion?->nombre ?? null;
    // }
    // public function tipo_resolucion_relacion()
    // {
    //     return $this->hasOne(TipoResolucions::class, 'id', 'tipo_resolucion_id');
    // }

    // public function getSalaAttribute()
    // {
    //     return $this->sala_relacion?->nombre ?? null;
    // }
    // public function sala_relacion()
    // {
    //     return $this->hasOne(Sala::class, 'id', 'sala_id');
    // }
    // public function getDepartamentoAttribute()
    // {
    //     return $this->departamento_relacion?->nombre ?? null;
    // }
    // public function departamento_relacion()
    // {
    //     return $this->hasOne(Departamentos::class, 'id', 'departamento_id');
    // }
    // public function getFormaResolucionAttribute()
    // {
    //     return $this->forma_resolucion_relacion?->nombre ?? null;
    // }
    // public function forma_resolucion_relacion()
    // {
    //     return $this->hasOne(FormaResolucions::class, 'id', 'forma_resolucion_id');
    // }
    // public function getMagistradoAttribute()
    // {
    //     return $this->magistrado_relacion?->nombre ?? null;
    // }
    // public function magistrado_relacion()
    // {
    //     return $this->hasOne(Magistrados::class, 'id', 'magistrado_id');
    // }
    // public function getTemaAttribute()
    // {
    //     return $this->tema_relacion?->nombre ?? null;
    // }
    // public function tema_relacion()
    // {
    //     return $this->hasOne(Tema::class, 'id', 'tema_id');
    // }

    public function sala()
    {
        return $this->belongsTo(Sala::class);
    }
    public function jurisprudencias()
    {
        return $this->belongsToMany(Jurisprudencias::class);
    }

    public function tema()
    {
        return $this->belongsTo(Tema::class);
    }
    public function magistrado()
    {
        return $this->belongsTo(Magistrados::class);
    }

    public function mapeo()
    {
        return $this->belongsTo(Mapeos::class);
    }

    public function forma_resolucion()
    {
        return $this->belongsTo(FormaResolucions::class);
    }
    public function departamento()
    {
        return $this->belongsTo(Departamentos::class);
    }
    public function tipo_resolucion()
    {
        return $this->belongsTo(TipoResolucions::class);
    }
    // En el modelo Resolution
    public function content()
    {
        return $this->hasOne(Contents::class, 'resolution_id', 'id');
    }
}
