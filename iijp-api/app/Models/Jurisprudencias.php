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

    public function tipo_descriptor()
    {
        return $this->belongsTo(Descriptor::class, 'descriptor_id');
    }

    public function materia()
    {
        return $this->belongsTo(Descriptor::class, 'root_id');
    }

    public function scoutIndexMigration(): array
    {
        return [
            'fields' => [
                // Campos requeridos
                'jurisprudencia_id' => ['type' => 'bigint'],

                // Campos de identificación
                'nro_expediente' => ['type' => 'text'],
                'resolution_id' => ['type' => 'bigint'],
                'nro_resolucion' => ['type' => 'text'],

                // Campos de categorización y filtrado
                'periodo' => ['type' => 'int'],
                'mes' => ['type' => 'int'],
                'materia' => ['type' => 'int'],
                'fecha_emision' => ['type' => 'int'],
                'descriptor_id' => ['type' => 'int'],
                'tipo_jurisprudencia' => ['type' => 'int'],
                'tipo_resolucion' => ['type' => 'int'],
                'magistrado' => ['type' => 'int'],
                'forma_resolucion' => ['type' => 'int'],
                'sala' => ['type' => 'int'],
                'departamento' => ['type' => 'int'],

                // Campos de texto completo para búsqueda
                'restrictor' => ['type' => 'text'],
                'descriptor' => ['type' => 'text'],
                'descriptor_facet' => ['type' => 'string'], // Para facetas
                'ratio' => ['type' => 'text'],
                'precedente' => ['type' => 'text'],
                'proceso' => ['type' => 'text'],
                'maxima' => ['type' => 'text'],
                'sintesis' => ['type' => 'text'],
            ],
            'settings' => [
                'min_prefix_len' => '3',
                'min_infix_len' => '3',
                'prefix_fields' => 'restrictor,descriptor,ratio,precedente,proceso,maxima,sintesis',
                'expand_keywords' => '1',
                'min_word_len' => '2',
                // 'engine' => 'columnar', // Descomenta si necesitas storage columnar
            ],
        ];
    }

    public function toSearchableArray()
    {
        $this->loadMissing('resolution'); // importante para evitar N+1

        return [
            'jurisprudencia_id' => (string) $this->id,
            'resolution_id' => $this->resolution->id ?? null,
            'periodo' => $this->resolution && $this->resolution->fecha_emision
                ? (int) \Carbon\Carbon::parse($this->resolution->fecha_emision)->format('Y')
                : null,

            'mes' => $this->resolution && $this->resolution->fecha_emision
                ? (int) \Carbon\Carbon::parse($this->resolution->fecha_emision)->format('m')
                : null,

            'fecha_emision' => $this->resolution && $this->resolution->fecha_emision
                ? \Carbon\Carbon::parse($this->resolution->fecha_emision)->timestamp
                : null,

            'materia' => (string) $this->root_id,
            'descriptor_id' => (string) $this->descriptor_id,
            'tipo_jurisprudencia' => (string) $this->tipo_jurisprudencia_id,
            'tipo_resolucion' => (string) $this->resolution->tipo_resolucion_id ?? null,
            'magistrado' => (string) $this->resolution->magistrado_id ?? null,
            'forma_resolucion' => (string) $this->resolution->forma_resolucion_id ?? null,
            'sala' => (string) $this->resolution->sala_id ?? null,
            'departamento' => $this->resolution->departamento_id ?? null,

            'restrictor' => (string) $this->restrictor,
            'descriptor' => (string) $this->descriptor,
            'descriptor_facet' => "{$this->root_id}||{$this->descriptor_id}||".($this->descriptor ? $this->descriptor : 'Desconocido'),
            'ratio' => (string) $this->ratio,
            'nro_resolucion' => (string) $this->resolution->nro_resolucion ?? null,
            'precedente' => (string) $this->resolution->precedente ?? null,
            'proceso' => (string) $this->resolution->proceso ?? null,
            'maxima' => (string) $this->resolution->maxima ?? null,
            'sintesis' => (string) $this->resolution->sintesis ?? null,
            'nro_expediente' => (string) $this->resolution->nro_expediente ?? null,
        ];
    }
}
