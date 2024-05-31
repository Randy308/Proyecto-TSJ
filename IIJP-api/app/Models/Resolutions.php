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
        'tipo_resolucion',
        'departamento',
        'sala_id',
        'magistrado',
        'forma_resolucion',
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

    public function salas()
    {
        return $this->belongsToMany(Salas::class);
    }

    public function temas()
    {
        return $this->belongsToMany(Temas::class);
    }
}
