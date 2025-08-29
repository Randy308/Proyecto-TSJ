<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

/**
 * @property int $id
 * @property int $resolution_id
 * @property int|null $tipo_jurisprudencia_id
 * @property string|null $restrictor
 * @property string|null $ratio
 * @property string|null $descriptor
 * @property int|null $descriptor_id
 * @property int|null $root_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Descriptor|null $materia
 * @property-read \App\Models\Resolution $resolution
 * @property-read \App\Models\Descriptor|null $tipo_descriptor
 * @property-read \App\Models\TipoJurisprudencia|null $tipo_jurisprudencia
 * @mixin \Eloquent
 */
class Jurisprudencia extends Model
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
        return $this->belongsTo(Resolution::class, 'resolution_id');
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
                'tipo_decision' => ['type' => 'int'],
                'proceso_facet' => ['type' => 'string'],
                'restrictor_facet' => ['type' => 'string'],
                'materia_facet' => ['type' => 'string'], // Para facetas


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
        $this->loadMissing('tipo_descriptor', 'resolution.resuelveDecision');

        $fechaEmision = $this->resolution?->fecha_emision;
        $fechaCarbon = $fechaEmision ? \Carbon\Carbon::parse($fechaEmision) : null;

        return [
            'jurisprudencia_id' => (string) $this->id,
            'resolution_id' => $this->resolution->id ?? '',
            'periodo' => $fechaCarbon?->year,
            'mes' => $fechaCarbon?->month,
            'fecha_emision' => $fechaCarbon?->timestamp,
            'materia' => (string) $this->root_id,
            'descriptor_id' => (string) $this->descriptor_id,
            'tipo_jurisprudencia' => (string) $this->tipo_jurisprudencia_id,
            'tipo_resolucion' => (string) $this->resolution?->tipo_resolucion_id ?? '',
            'magistrado' => (string) $this->resolution?->magistrado_id ?? '',
            'forma_resolucion' => (string) $this->resolution?->forma_resolucion_id ?? '',
            'sala' => (string) $this->resolution?->sala_id ?? '',
            'departamento' => $this->resolution?->departamento_id ?? '',
            'restrictor' => (string) $this->restrictor,
            'descriptor' => (string) $this->descriptor,
            'descriptor_facet' => "{$this->root_id}||{$this->descriptor_id}||" . ($this->descriptor ?: 'Desconocido'),
            'ratio' => (string) $this->ratio,
            'nro_resolucion' => (string) $this->resolution?->nro_resolucion ?? '',
            'precedente' => (string) $this->resolution?->precedente ?? '',
            'proceso' => (string) $this->resolution?->proceso ?? '',
            'maxima' => (string) $this->resolution?->maxima ?? '',
            'sintesis' => (string) $this->resolution?->sintesis ?? '',
            'nro_expediente' => (string) $this->resolution?->nro_expediente ?? '',
            'proceso_facet' => (string) ($this->resolution?->proceso ?? ''),
            'restrictor_facet' => (string) ($this->restrictor ?? ''),
            'materia_facet' => ($this->tipo_descriptor?->nombre ?? 'Desconocido'), // Para facetas
            'tipo_decision' => (int) ($this->resolution?->resuelveDecision?->resuelve_fondo_id ?? 0),
        ];
    }
}
