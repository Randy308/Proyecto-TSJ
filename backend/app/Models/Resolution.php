<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

/**
 * @property int $id
 * @property string|null $nro_resolucion
 * @property string|null $nro_expediente
 * @property string|null $fecha_emision
 * @property string|null $fecha_publicacion
 * @property int|null $tipo_resolucion_id
 * @property int|null $departamento_id
 * @property int|null $sala_id
 * @property int|null $magistrado_id
 * @property int|null $forma_resolucion_id
 * @property string|null $proceso
 * @property string|null $precedente
 * @property string|null $demandante
 * @property string|null $demandado
 * @property string|null $maxima
 * @property string|null $sintesis
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $categoria_resolucion_id
 * @property-read \App\Models\CategoriaResolucion|null $categoria_resolucion
 * @property-read \App\Models\Content|null $content
 * @property-read \App\Models\Departamento|null $departamento
 * @property-read \App\Models\FormaResolucion|null $forma_resolucion
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Jurisprudencia> $jurisprudencias
 * @property-read int|null $jurisprudencias_count
 * @property-read \App\Models\Magistrado|null $magistrado
 * @property-read \App\Models\Mapeo|null $mapeo
 * @property-read \App\Models\Sala|null $sala
 * @property-read \App\Models\Tema|null $tema
 * @property-read \App\Models\TipoResolucion|null $tipo_resolucion
 * @mixin \Eloquent
 */
class Resolution extends Model
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
        'categoria_resolucion_id',
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
        return $this->hasMany(Jurisprudencia::class, 'resolution_id', 'id');
    }

    public function tema()
    {
        return $this->belongsTo(Tema::class);
    }

    public function magistrado()
    {
        return $this->belongsTo(Magistrado::class);
    }

    public function mapeo()
    {
        return $this->belongsTo(Mapeo::class);
    }

    public function forma_resolucion()
    {
        return $this->belongsTo(FormaResolucion::class);
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    public function tipo_resolucion()
    {
        return $this->belongsTo(TipoResolucion::class);
    }

    // En el modelo Resolution
    public function content()
    {
        return $this->hasOne(Content::class, 'resolution_id', 'id');
    }

    public function resuelveDecision()
    {
        return $this->hasOne(ResuelveDecision::class, 'resolucion_id', 'id');
    }

    public function categoria_resolucion()
    {
        return $this->belongsTo(CategoriaResolucion::class, 'categoria_resolucion_id');
    }

    public function scoutIndexMigration(): array
    {
        return [
            'fields' => [
                // Campos requeridos
                'resolution_id' => ['type' => 'bigint'],
                // Campos de identificación
                'nro_expediente' => ['type' => 'text'],
                'nro_resolucion' => ['type' => 'text'],

                // Campos de categorización y filtrado
                'periodo' => ['type' => 'uint'],
                'mes' => ['type' => 'uint'],
                'materia' => ['type' => 'uint'],
                'fecha_emision' => ['type' => 'uint'],
                'tipo_resolucion' => ['type' => 'uint'],
                'magistrado' => ['type' => 'uint'],
                'forma_resolucion' => ['type' => 'uint'],
                'sala' => ['type' => 'uint'],
                'departamento' => ['type' => 'uint'],
                'categoria_resolucion' => ['type' => 'uint'],
                'tiene_jurisprudencias' => ['type' => 'uint'],

                // Campos de texto completo para búsqueda
                'contenido' => ['type' => 'text'],
                'sintesis' => ['type' => 'text'],
                'precedente' => ['type' => 'text'],
                'proceso' => ['type' => 'text'],
                'maxima' => ['type' => 'text']
            ],
            'settings' => [
                'min_prefix_len' => '3',
                'min_infix_len' => '3',
                'prefix_fields' => 'contenido,sintesis,precedente,proceso,maxima',
                'expand_keywords' => '1',
                'min_word_len' => '2'
                // 'engine' => 'columnar', // Descomenta si necesitas storage columnar
            ],
        ];
    }

    public function toSearchableArray()
    {
        // Evitar N+1 cargando relaciones necesarias
        $this->loadMissing(['content', 'jurisprudencias']);

        // Fecha segura
        $fechaEmision = $this->fecha_emision ?? null;
        $fechaCarbon = $fechaEmision ? \Carbon\Carbon::parse($fechaEmision) : null;

        return [
            'resolution_id' => $this->id,
            'nro_resolucion' => (string) ($this->nro_resolucion ?? ''),
            'nro_expediente' => (string) ($this->nro_expediente ?? ''),

            'departamento' => (int) ($this->departamento_id ?? 0),

            // Metadatos útiles
            'sala' => (int) ($this->sala_id ?? 0),
            'categoria_resolucion' => (int) ($this->categoria_resolucion_id ?? 0),
            'magistrado' => (int) ($this->magistrado_id ?? 0),

            'periodo' => $fechaCarbon?->year,
            'mes' => $fechaCarbon?->month,
            'fecha_emision' => $fechaCarbon?->timestamp,

            'tipo_resolucion' => (int) ($this->tipo_resolucion_id ?? 0),
            'forma_resolucion' => (int) ($this->forma_resolucion_id ?? 0),
            'tiene_jurisprudencias' => $this->jurisprudencias->isNotEmpty() ? 1 : 0,

            'sintesis' => (string) ($this->sintesis ?? ''),
            'precedente' => (string) ($this->precedente ?? ''),
            'proceso' => (string) ($this->proceso ?? ''),
            'maxima' => (string) ($this->maxima ?? ''),

            // Contenido limpio (evita errores de null)
            'contenido' => (string) ($this->content->contenido ?? ''),
        ];
    }
}
