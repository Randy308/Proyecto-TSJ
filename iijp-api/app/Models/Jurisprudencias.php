<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Jurisprudencias extends Model
{
    use HasFactory;

    use Searchable;

    protected $fillable = [
        'restrictor',
        'resolution_id',
        'descriptor_id',
        'descriptor',
        'tipo_jurisprudencia_id',
        'ratio',
        'root_id',
    ];


    protected $hidden = [
        'created_at',
        'updated_at',
    ];



    public function resolution()
    {
        return $this->belongsTo(Resolutions::class, 'resolution_id');
    }


    public function tipo_jurisprudencia()
    {
        return $this->belongsTo(TipoJurisprudencia::class, 'tipo_jurisprudencia_id');
    }

    public function descriptor()
    {
        return $this->belongsTo(Descriptor::class, 'descriptor_id');
    }

    public function toSearchableArray()
    {
        $this->loadMissing('resolution'); // importante para evitar N+1

        return [
            'materia' => $this->root_id,
            'restrictor' => $this->restrictor,
            'descriptor_id' => $this->descriptor_id,
            'descriptor' => $this->descriptor,
            'descriptor_facet' => "{$this->root_id}||{$this->descriptor_id}||" . ($this->descriptor ? $this->descriptor : 'Desconocido'),
            'tipo_jurisprudencia' => $this->tipo_jurisprudencia_id,
            'ratio' => $this->ratio,
            'id' => $this->id,
            'resolution_id' => $this->resolution->id ?? null,
            'periodo' => $this->resolution && $this->resolution->fecha_emision
                ? \Carbon\Carbon::parse($this->resolution->fecha_emision)->format('Y')
                : null,
            'nro_resolucion' => $this->resolution->nro_resolucion ?? null,
            'tipo_resolucion' => $this->resolution->tipo_resolucion_id ?? null,
            'sala' => $this->resolution->sala_id ?? null,
            'departamento' => $this->resolution->departamento_id ?? null,
            'precedente' => $this->resolution->precedente?? null,
            'proceso' => $this->resolution->proceso?? null,
            'maxima' => $this->resolution->maxima?? null,
            'sintesis' => $this->resolution->sintesis?? null,
            'nro_expediente' => $this->resolution->nro_expediente?? null,
            'magistrado' => $this->resolution->magistrado_id?? null,
            'forma_resolucion' => $this->resolution->forma_resolucion_id?? null,
        ];
    }
}
