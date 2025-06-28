<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Laravel\Scout\Searchable;

class Resolutions extends Model
{
    use HasFactory;
    use Searchable;

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
        'maxima',
        'user_id',
        'sintesis',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];


    public function sala()
    {
        return $this->belongsTo(Sala::class);
    }
    public function jurisprudencias()
    {
        return $this->hasMany(Jurisprudencias::class, 'resolution_id', 'id');
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


    public function toSearchableArray()
    {
        $this->loadMissing(['content', 'jurisprudencias']); // evitar N+1

        return [
            'id' => $this->id,
            'nro_resolucion' => $this->nro_resolucion,
            'nro_expediente' => $this->nro_expediente,
            'demandante' => $this->demandante,
            'demandado' => $this->demandado,
            'contenido' => $this->content->contenido ?? null,
            'departamento' => $this->departamento_id,
            // metadatos no buscables, pero útiles en resultados
            'sala' => $this->sala_id,
            'magistrado' => $this->magistrado_id,
            'periodo' => $this->fecha_emision
                ? \Carbon\Carbon::parse($this->fecha_emision)->format('Y')
                : null,
            'tipo_resolucion' => $this->tipo_resolucion_id,
            'forma_resolucion' => $this->forma_resolucion_id,
            'sintesis' => $this->sintesis,
            'precedente' => $this->precedente,
            'proceso' => $this->proceso,
            'maxima' => $this->maxima,
            
            // nuevo campo booleano
            'tiene_jurisprudencias' => $this->jurisprudencias->isNotEmpty(),
        ];
    }
}
