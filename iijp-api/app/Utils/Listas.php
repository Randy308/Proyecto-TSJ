<?php

namespace  App\Utils;

class Listas
{
    protected static $lista =  [
        "tipo_resolucion" => ["tabla" => "tipo_resolucions", "foreign_key" => "tipo_resolucion_id", "join" => false, "columna" => "id", "nombre" => "tipo_resolucion"],
        "departamento" => ["tabla" => "departamentos", "foreign_key" => "departamento_id", "join" => false, "columna" => "id", "nombre" => "departamento"],
        "sala" => ["tabla" => "salas", "foreign_key" => "sala_id", "join" => false, "columna" => "id", "nombre" => "sala"],
        "magistrado" => ["tabla" => "magistrados", "foreign_key" => "magistrado_id", "join" => false, "columna" => "id", "nombre" => "magistrado"],
        "forma_resolucion" => ["tabla" => "forma_resolucions", "foreign_key" => "forma_resolucion_id", "join" => false, "columna" => "id", "nombre" => "forma_resolucion"],
        "tipo_jurisprudencia" => ["tabla" => "tipo_jurisprudencias", "foreign_key" => "tipo_jurisprudencia_id", "join" => true, "columna" => "id", "nombre" => "tipo_jurisprudencia"],
        "materia" => ["tabla" => "descriptors", "foreign_key" => "root_id", "join" => true, "columna" => "id", "nombre" => "materia"],
        "maxima" => ["tabla" => "resolutions",  "foreign_key" => "root_id", "join" => false, "columna" => "maxima", "nombre" => "maxima"],
        "sintesis" => ["tabla" => "resolutions",  "foreign_key" => "root_id", "join" => false, "columna" => "sintesis", "nombre" => "sintesis"],
        "restrictor" => ["tabla" => "jurisprudencias", "foreign_key" => "resolution_id", "join" => true, "columna" => "id", "nombre" => "restrictor"],
        "ratio" => ["tabla" => "jurisprudencias", "foreign_key" => "resolution_id", "join" => true, "columna" => "id", "nombre" => "ratio"],
        "precedente" => ["tabla" => "resolutions", "foreign_key" => "root_id", "join" => false, "columna" => "precedente", "nombre" => "precedente"],
        "proceso" => ["tabla" => "resolutions",  "foreign_key" => "root_id", "join" => false, "columna" => "proceso", "nombre" => "proceso"],
        "demandante" => ["tabla" => "resolutions",  "foreign_key" => "root_id", "join" => false, "columna" => "demandante", "nombre" => "demandante"],
        "demandado" => ["tabla" => "resolutions",  "foreign_key" => "root_id", "join" => false, "columna" => "demandado", "nombre" => "demandado"],
    ];
    public static function obtenerLista()
    {
        return self::$lista;
    }
    public static function obtenerItem($nombre)
    {

        $nombre = strtolower($nombre);;

        if (!array_key_exists($nombre, self::$lista)) {
            return null;
        }


        return self::$lista[$nombre];
    }

    public function ordenarArrayXYZ($combinations, $nombre_y, $nombre_z, $nombre_x)
    {
        $variableY = $nombre_y;
        $variableZ = $nombre_x;
        $variableX = $nombre_z;

        $uniqueColumns = collect($combinations)->map(function ($item) use ($variableX, $variableY) {
            return $item[$variableX] . '_' . $item[$variableY];
        })->unique()->sort()->values()->all();

        $resultado = [];
        $uniqueItems = collect($combinations)->pluck($variableZ)->unique();

        $combinations = collect($combinations);

        foreach ($uniqueItems as $mainValue) {
            $row = [$variableZ => $mainValue];

            foreach ($uniqueColumns as $column) {
                $lastSpaceIndex = strrpos($column, '_');
                $colValueX = substr($column, 0, $lastSpaceIndex);
                $colValueY = substr($column, $lastSpaceIndex + 1);


                $entry = $combinations->first(function ($element) use ($mainValue, $variableX, $variableY, $variableZ, $colValueX, $colValueY) {
                    return $element[$variableZ] === $mainValue
                        && $element[$variableX] === $colValueX
                        && $element[$variableY] === $colValueY;
                });

                $row[$column] = $entry ? $entry['cantidad'] : 0;

                if ($entry) {
                    $combinations = $combinations->reject(function ($element) use ($entry) {
                        return $element === $entry;
                    });
                }
            }

            $resultado[] = $row;
        }

        return $resultado;
    }

    public function ordenarArrayXY($combinations, $name, $nombre_y)
    {
        $variableX = $name;
        $variableY = $nombre_y;

        $uniqueColumns = collect($combinations)->map(function ($item) use ($variableX) {
            return $item[$variableX];
        })->unique()->values()->all();

        $resultado = [];
        $uniqueItems = collect($combinations)->pluck($variableY)->unique();

        $combinations = collect($combinations);

        foreach ($uniqueItems as $mainValue) {

            $row = [$variableY => $mainValue];

            foreach ($uniqueColumns as $column) {

                $colValue = $column;

                $entry = $combinations->first(function ($element) use ($mainValue, $variableX, $variableY, $colValue) {
                    return $element[$variableY] === $mainValue
                        && $element[$variableX] === $colValue;
                });

                $row[$column] = $entry ? $entry['cantidad'] : 0;

                if ($entry) {
                    $combinations = $combinations->reject(function ($element) use ($entry) {
                        return $element === $entry;
                    });
                }
            }

            $resultado[] = $row;
        }

        return $resultado;
    }
}
