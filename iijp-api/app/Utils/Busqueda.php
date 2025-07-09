<?php

namespace  App\Utils;

use Illuminate\Support\Str;

class Busqueda
{

    public static function obtenerFacetasOld(array $facetas): array
    {
        $facets = collect($facetas)->map(function ($facet) {
            return [
                'field_name' => $facet['field_name'],
                'values' => array_map('intval', array_column($facet['counts'], 'value'))
            ];
        });

        return $facets->toArray();
    }


    public static function obtenerFacetas(array $facetas): array
    {
        $filtros = [];
        foreach ($facetas as $facet) {
            $fieldName = $facet['field_name'];

            $numericalKeys = array_map('intval', array_column($facet['counts'], 'value'));

            $filtered = array_filter($numericalKeys, function ($item) {
                return $item !== 0;
            });

            $filtros[$fieldName] = array_values($filtered); // Reindexa
        }

        return $filtros;
    }


    public static function generarResultado($result): array
    {

        $hits = collect($result['hits'] ?? [])->map(function ($hit) {
            $doc = $hit['document'] ?? [];

            // Extraer y aplicar los highlights si existen
            $highlights = collect($hit['highlights'] ?? [])
                ->mapWithKeys(fn($item) => [$item['field'] => $item['snippet'] ?? '']);

            foreach ($highlights as $field => $snippet) {
                if (array_key_exists($field, $doc) && !empty($snippet)) {
                    // En caso de que el campo sea un array, lo convertimos en string limpio
                    $original = is_array($doc[$field]) ? implode(', ', $doc[$field]) : $doc[$field];

                    // Sustituye el contenido con el snippet resaltado
                    $doc[$field] = Str::of($snippet)->trim();
                }
            }

            return $doc;
        });

        return $hits->toArray();

    }
}
