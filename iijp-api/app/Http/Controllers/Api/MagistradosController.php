<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Jurisprudencias;
use App\Models\Magistrados;
use App\Models\Resolutions;
use App\Models\Sala;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MagistradosController extends Controller
{







    public function reemplazarPatron($array, $pattern)
    {
        $array = array_map(function ($value) use ($pattern) {
            return preg_replace($pattern, '', $value);
        }, $array);
        return $array;
    }


    public function update($id, Request $request)
    {
        $request->validate([
            'nombre' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $magistrado = Magistrados::findOrFail($id);


        if ($request->hasFile('image')) {
            if ($magistrado->ruta_imagen && Storage::exists(str_replace('storage/', 'public/', $magistrado->ruta_imagen))) {
                Storage::delete(str_replace('storage/', 'public/', $magistrado->ruta_imagen));
            }

            $image = $request->file('image');
            $fileName = time() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('public/magistrados', $fileName);
            $magistrado->ruta_imagen = str_replace('public/', 'storage/', $path);
        }

        if ($request->filled('nombre')) {
            $magistrado->nombre = $request->nombre;
        }

        $magistrado->save();

        return response()->json(['message' => 'Información actualizada con éxito', 'magistrado' => $magistrado], 200);
    }

    public function obtenerSerieTemporal($id, Request $request)
    {


        $magistrado = Magistrados::where('id', $id)->first();
        $actual = $request['actual'];
        $fecha_inicial = $request['dato'];
        $resolutions = [];
        if ($fecha_inicial && $actual != "year") {
            switch ($actual) {
                case 'month':
                    $timestamp = strtotime($fecha_inicial);
                    $year = date('Y', $timestamp);
                    $fecha_inicial = "$year-01-01";
                    $query = "
                        SELECT
                            TO_CHAR(series::date, 'TMMonth') AS fecha,
                            series::date AS fecha_inicio,
                            COALESCE(COUNT(r.id), 0) AS cantidad
                        FROM
                            generate_series(:fechaInicial::date, :fechaFinal::date, '1 month'::INTERVAL) AS series
                        LEFT JOIN resolutions r
                            ON date_trunc('month', r.fecha_emision) = series::date
                            AND r.magistrado_id = :magistradoId
                        GROUP BY
                            TO_CHAR(series::date, 'TMMonth'), series::date
                        ORDER BY
                            series::date;
                    ";
                    $fecha_final = date('Y-m-d', strtotime("+11 months", strtotime($fecha_inicial)));
                    break;
                case 'day':
                    $query = "
                        SELECT
                            series::date AS fecha,
                            series::date AS fecha_inicio,
                            COALESCE(COUNT(r.id), 0) AS cantidad
                        FROM
                            generate_series(:fechaInicial::date, :fechaFinal::date, '1 day'::INTERVAL) AS series
                        LEFT JOIN resolutions r
                            ON r.fecha_emision = series::date
                            AND r.magistrado_id = :magistradoId
                        GROUP BY
                            series::date
                        ORDER BY
                            series::date;
                    ";
                    $fecha_final = date("Y-m-t", strtotime($fecha_inicial));
                    break;
                default:
                    break;
            }

            if ($query && $fecha_inicial && $fecha_final) {
                $resolutions = DB::select($query, [
                    'fechaInicial' => $fecha_inicial,
                    'fechaFinal' => $fecha_final,
                    'magistradoId' => $magistrado->id,
                ]);
            }
        } else {
            $resolutions = Resolutions::where('magistrado_id', $magistrado->id)
                ->select(
                    DB::raw('EXTRACT(YEAR FROM fecha_emision) as fecha'),
                    DB::raw('COUNT(*) as cantidad')
                )
                ->whereNotNull("fecha_emision")
                ->groupBy(DB::raw('EXTRACT(YEAR FROM fecha_emision)'))
                ->orderBy('fecha')
                ->get();


            foreach ($resolutions as &$item) {
                $year = $item->fecha;
                $item->fecha_final = ($year . '-12-31');
                $item->fecha_inicio = ($year . '-01-01');
            }
        }
        $data = [
            'magistrado' => $magistrado->nombre,
            'data' => $resolutions,

        ];

        return response()->json($data);
    }


    public function descomponerSerie(Request $request)
    {

        $magistrado = Magistrados::where('id', $request->id)->firstOrFail();
        $salas = DB::table('resolutions as r')
            ->join('magistrados as m', 'm.id', '=', 'r.magistrado_id')
            ->select(
                DB::raw('MAX(r.fecha_emision) as fecha_max'),
                DB::raw('MIN(r.fecha_emision) as fecha_min')
            )
            ->where('r.magistrado_id', '=', $magistrado->id)
            ->get();

        $fecha_final = Carbon::parse(max($salas->pluck('fecha_max')->toArray()))->endOfMonth();
        $fecha_inicial = Carbon::parse(min($salas->pluck('fecha_min')->toArray()))->startOfMonth();
        $query = "
            SELECT
                series::date AS periodo,
                COALESCE(COUNT(r.id), 0) AS cantidad
            FROM
                generate_series(:fechaInicial::date, :fechaFinal::date, '1 MONTH'::INTERVAL) AS series
            LEFT JOIN resolutions r
                ON EXTRACT(YEAR FROM r.fecha_emision) = EXTRACT(YEAR FROM series::date)
                AND EXTRACT(MONTH FROM r.fecha_emision) = EXTRACT(MONTH FROM series::date)
                AND r.magistrado_id = :magistradoId
            GROUP BY
                periodo
            ORDER BY
                periodo;
        ";

        $resolutions = DB::select($query, [
            'fechaInicial' => $fecha_inicial,
            'fechaFinal' => $fecha_final,
            'magistradoId' => $magistrado->id,
        ]);

        // Preparar los datos en JSON
        $data = [
            'id' => $magistrado->id,
            'resolutions' => $resolutions
        ];
        //return $resolutions;
        // Enviar datos a Flask
        $response = Http::post('http://127.0.0.1:5000/predicciones/', [
            'data' => json_encode($data)
        ]);

        // Opcional: Manejar la respuesta
        if ($response->successful()) {
            return $response->json();
        } else {
            return response()->json(['error' => 'Error al enviar datos a Flask' . $response], 500);
        }
    }







    public function obtenerModelo($name, $values)
    {
        $allowedTables = [
            'tipo_resolucion' => 'tipo_resolucions',
            'departamento' => 'departamentos',
            'sala' => 'salas',
            'magistrado' => 'magistrados',
            'forma_resolucion' => 'forma_resolucions',
            'tipo_jurisprudencia' => 'tipo_jurisprudencias'
        ];

        if (!array_key_exists($name, $allowedTables)) {
            throw new ModelNotFoundException("No se encontró el modelo '$name'.");
        }

        $table = $allowedTables[$name];

        return DB::table("$table as x")
            ->select("x.nombre as $name")
            ->whereIn('x.id', $values)
            ->get();
    }


    public function generarConsulta($formaId, $salas, $tablas)
    {
        // Initial select and group by
        $select = "COALESCE(COUNT(r.id), 0) AS cantidad, salas.nombre AS sala";
        $group_by = "salas.nombre";

        // Base query
        $query = Magistrados::selectRaw($select)
            ->join('resolutions as r', 'r.magistrado_id', '=', 'magistrados.id')
            ->join('salas', 'r.sala_id', '=', 'salas.id')
            ->whereIn('r.sala_id', $salas)
            ->where('magistrados.id', $formaId);

        // Loop to add dynamic joins and selects based on tables array
        foreach ($tablas as $tabla) {
            $table_name = $tabla->nombre;
            $values = $tabla->ids;
            $full_name = $table_name . "s";
            if ($table_name && $values) {
                if ($table_name == "tipo_jurisprudencia") {

                    //$jurisprudencia_nombres  = Jurisprudencias::whereIn('jurisprudencias.id', $values)->get("tipo_jurisprudencia")->pluck("tipo_jurisprudencia");
                    $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id')
                        ->join('tipo_jurisprudencias as tj', 'j.tipo_jurisprudencia_id', '=', 'tj.id')
                        ->whereIn('j.tipo_jurisprudencia_id', $values);
                    $select .= ", tj.nombre AS " . $table_name;
                    $group_by .= ", " . $table_name;
                } else {
                    $query->join($full_name, $full_name . '.id', '=', 'r.' . $table_name . '_id')
                        ->whereIn($full_name . '.id', $values);
                    $select .= ", " . $full_name . ".nombre AS " . $table_name;
                    $group_by .= ", " . $full_name . ".nombre";
                }
            }
        }

        // Finalize select and group by, then get the results
        return $query->selectRaw($select)->groupByRaw($group_by)->get();
    }



    public function ordenarArrayXY($combinations, $nombreX, $nombreY)
    {
        $variableX = $nombreX;
        $variableY = $nombreY;

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


       
        $filtrado = array_filter($resultado, function ($item) use ($variableY) {
            foreach ($item as $key => $value) {
                if ($key !== $variableY && $value !== 0) {
                    return true;
                }
            }
            return false; 
        });
        
        
        $filtrado = array_values($filtrado);

        return $resultado;
    }

}
