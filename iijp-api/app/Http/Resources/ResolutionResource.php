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
        return [

            "id" => $this->id,
            "name" => $this->name,
            "email" => $this->email,
            "role" => $this->content,

            "id" => 80495,
            "nro_resolucion" => "AS/0670/2024",
            "nro_expediente" => "20-2024",
            "fecha_emision" => "2024-08-22",
            "fecha_publicacion" => null,
            "tipo_resolucion_id" => 1,
            "departamento_id" => 6,
            "sala_id" => 5,
            "magistrado_id" => 36,
            "forma_resolucion_id" => 1,
            "proceso" => "Compulsa",
            "precedente" => null,
            "demandante" => "Gobierno Autónomo Municipal de La Asunta",
            "demandado" => "Sala Social y Administrativa, Contenciosa y Contenciosa Administrativa Segunda del Tribunal Departamental de Justicia de La Paz",
            "tema_id" => null,
            "maxima" => null,
            "sintesis" => null,
            "user_id" => null,
            "content" => [
                "resolution_id" => 80495,
                "contexto" => "<b>Casación</b>” , en el caso de autos la entidad demandada ahora compulsante, sin mayor motivación pretende"
            ],

        ];
    }
}
