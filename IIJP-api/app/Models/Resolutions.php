<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'magistrado',
        'forma_resolucion_id',
        'restrictor',
        'descriptor',
        'tipo_jurisprudencia',
        'proceso',
        'precedente',
        'ratio',
        'demandante',
        'demandado',
        'tema_id',
        'maxima',
        'sintesis',
    ];

    public function sala()
    {
        return $this->belongsTo(Salas::class);
    }
    public function temas_complementarios()
    {
        return $this->belongsToMany(TemasComplementarios::class);
    }

    public function tema()
    {
        return $this->belongsTo(Temas::class);
    }
    public function magistrado()
    {
        return $this->belongsTo(Magistrados::class);
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

    public function content()
    {
        return $this->belongsTo(Contents::class);
    }
}
