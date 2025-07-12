<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
            'nro_resolucion'    => $this->nro_resolucion,
            'nro_expediente'    => $this->nro_expediente,
            'fecha_emision'     => $this->fecha_emision,
            'tipo_resolucion'   => $this->tipo_resolucion?->nombre,
            'departamento'      => $this->departamento?->nombre,
            'sala'              => $this->sala?->nombre,
            'magistrado'        => $this->magistrado?->nombre,
            'forma_resolucion'  => $this->forma_resolucion?->nombre,
            'proceso'           => $this->proceso,
            'demandante'        => $this->demandante,
            'demandado'         => $this->demandado,
            'maxima'            => $this->maxima,
            'sintesis'          => $this->sintesis,
            'precedente'        => $this->precedente,
            'contenido'         => $this->content?->contenido,
        ], fn($value) => !is_null($value));
    }
}
