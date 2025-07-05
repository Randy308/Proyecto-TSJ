<?php

namespace  App\Utils;

class Math
{

    public static function buildTree(array $elements, $parentId = 0)
    {
        $branch = array();

        foreach ($elements as $element) {
            if ($element['descriptor_id'] == $parentId) {
                $children = Math::buildTree($elements, $element['id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }

    public static function completarArray2D($data, $nombre = 'nombre', $cantidad = 'cantidad')
    {
        $resultado = [];

        $header = array_merge([$nombre, $cantidad]);
        $resultado[] = $header;
        // Rellenar los datos por (nombre)
        foreach ($data as $element) {
            $arrayElement = (array) $element;
            $resultado[] = [$arrayElement[$nombre], $arrayElement[$cantidad]];
        }


        return $resultado;
    }
    public static function completarArray($data, $columnaX = 'nombre', $columnaY = 'fecha')
    {

        $resultado = [];


        $filasPorNombre = [];
        $datosSet = [];

        foreach ($data as $element) {

            $row = (array) $element;

            $nombre = $row[$columnaX];
            $dato = $row[$columnaY];
            $cantidad = $row['cantidad'];

            $filasPorNombre[$nombre][$dato] = $cantidad;
            $datosSet[$dato] = true;
        }

        $datos = array_keys($datosSet);
        sort($datos);
        $datosStr = array_map('strval', $datos);
        $resultado = [];
        $header = array_merge([$columnaX], $datosStr);
        $resultado[] = $header;

        // Rellenar los datos por (nombre)
        foreach ($filasPorNombre as $nombre => $valoresPorDato) {
            $fila = [$nombre];
            foreach ($datos as $dato) {
                $fila[] = $valoresPorDato[$dato] ?? 0; // Si no hay dato, rellenar con 0
            }
            $resultado[] = $fila;
        }

        return $resultado;
    }

    public static function completarArrayMapa($data, $columnaX = 'nombre', $columnaY = 'fecha')
    {

        $resultado = [];


        $filasPorNombre = [];
        $datosSet = [];

        foreach ($data as $row) {
            $nombre = $row->$columnaX;
            $dato = $row->$columnaY;
            $cantidad = $row->cantidad;

            $filasPorNombre[$nombre][$dato] = $cantidad;
            $datosSet[$dato] = true;
        }

        $datos = array_keys($datosSet);
        sort($datos);
        $resultado = [];

        // Rellenar los datos por (nombre)
        foreach ($filasPorNombre as $nombre => $valoresPorDato) {
            $lista = [];
            foreach ($datos as $dato) {
                $lista[$dato] = $valoresPorDato[$dato] ?? 0; // Si no hay dato, rellenar con 0
            }

            $resultado[] = ['name' => $nombre, 'results' => $lista];
        }

        return $resultado;
    }
}
