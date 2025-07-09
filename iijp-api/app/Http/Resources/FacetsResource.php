<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacetsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        return [
            'campo' => $this->field_name,
            'valor' => $this->counts['value'] ?? null,
            'cantidad' => $this->counts['count'] ?? null,
        ];
    }
}
