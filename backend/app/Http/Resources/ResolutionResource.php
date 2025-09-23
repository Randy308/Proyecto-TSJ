<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property number $id
 * @property string $nro_resolucion
 * @property string $nro_expediente
 * @property string $fecha_emision
 * @property string $proceso
 * @property string $demandante
 * @property string $demandado
 * @property string $maxima
 * @property string $sintesis
 * @property string $precedente
 * @property \App\Models\Sala|null $sala
 * @property \App\Models\Magistrado|null $magistrado
 * @property \App\Models\Departamento|null $departamento
 * @property \App\Models\FormaResolucion|null $forma_resolucion
 * @property \App\Models\Content|null $content
 * @property \App\Models\TipoResolucion|null $tipo_resolucion
 */
class ResolutionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return array_filter([
            'id' => $this->id,
            'nro_resolucion' => $this->nro_resolucion,
            'nro_expediente' => $this->nro_expediente,
            'fecha_emision' => $this->fecha_emision,
            'tipo_resolucion' => $this->tipo_resolucion?->nombre,
            'departamento' => $this->departamento?->nombre,
            'sala' => $this->sala?->nombre,
            'magistrado' => $this->magistrado?->nombre,
            'forma_resolucion' => $this->forma_resolucion?->nombre,
            'proceso' => $this->proceso,
            'demandante' => $this->demandante,
            'demandado' => $this->demandado,
            'maxima' => $this->maxima,
            'sintesis' => $this->sintesis,
            'precedente' => $this->precedente,
            'contenido' =>  str_replace('_x0007_', "\x07", $this->content?->contenido),
        ], fn($value) => ! is_null($value));
    }
}
