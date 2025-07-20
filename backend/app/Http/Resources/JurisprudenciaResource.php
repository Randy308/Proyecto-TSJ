<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property string $restrictor
 * @property string $descriptor
 * @property \App\Models\TipoJurisprudencia|null $tipo_jurisprudencia
 * @property string $ratio
 * @property \App\Models\Descriptor|null $tipo_descriptor
 * @property \App\Models\Descriptor|null $materia
 */
class JurisprudenciaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_filter([
            'restrictor' => $this->restrictor,
            'descriptor' => $this->descriptor,
            'tipo_jurisprudencia' => $this->tipo_jurisprudencia?->nombre,
            'ratio' => $this->ratio,
            'last' => $this->tipo_descriptor?->nombre,
            'materia' => $this->materia?->nombre,
        ], fn($value) => !is_null($value));
    }
}
