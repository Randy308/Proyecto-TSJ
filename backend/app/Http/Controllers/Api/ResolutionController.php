<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurisprudenciaResource;
use App\Http\Resources\ResolutionResource;
use App\Models\Departamento;
use App\Models\Descriptor;
use App\Models\FormaResolucion;
use App\Models\Jurisprudencia;
use App\Models\Magistrado;
use App\Models\Resolution;
use App\Models\ResuelveDecision;
use App\Models\ResuelveFondo;
use App\Models\Sala;
use App\Models\TerminosClaveUnificado;
use App\Models\TipoJurisprudencia;
use App\Models\TipoResolucion;
use App\Utils\Busqueda;
use App\Utils\Listas;
use App\Utils\Math;
use App\Utils\NLP;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

class ResolutionController extends Controller
{
    public function buscarResolucionesXY(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'nameX' => 'required|string',
            'valueX' => 'required|string',
            'nameY' => 'required|string',
            'valueY' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $nameX = $request->input('nameX');
        $valueX = $request->input('valueX');
        $nameY = $request->input('nameY');
        $valueY = $request->input('valueY');

        $campos = Listas::obtenerLista();
        if (!array_key_exists($nameX, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        if (!array_key_exists($nameY, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroX = $campos[$nameX];
        $filtroY = $campos[$nameY];

        $lista = ['maxima', 'sintesis', 'restrictor', 'ratio', 'precedente', 'proceso', 'demandante', 'demandado'];

        if (!in_array($filtroX['nombre'], $lista) && !in_array($filtroY['nombre'], $lista)) {
            return $this->obtenerEstadisticasXY($request);
        }

        if (!in_array($filtroX['nombre'], $lista) || !in_array($filtroY['nombre'], $lista)) {
            return $this->obtenerXYSimple($request);
        }

        // Aquí puedes implementar la lógica para buscar las resoluciones en función de los parámetros recibidos

        return response()->json(['message' => 'Búsqueda realizada con éxito']);
    }

    public function userResolutions(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $resolutions = Resolution::select('id', 'fecha_emision', 'nro_expediente', 'nro_resolucion')->where('user_id', $user->id)->paginate(20);

        return response()->json($resolutions);
    }


    public function obtenerEstadisticasMultivariableSala(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filtros' => 'required|array',
            'filtros.*.name' => 'required|string',
            'filtros.*.ids' => 'required|array|min:1',
            'filtros.*.ids.*' => 'required|integer|min:1',
            'serie' => 'nullable|string',
            'sala' => 'required|exists:salas,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $campos = [
            'tipo_resolucion'     => ['tabla' => 'tipo_resolucions as tr',     'fk' => 'r.tipo_resolucion_id',     'id' => 'tr.id',  'nombre' => 'tr.nombre as tipo_resolucion'],
            'departamento'        => ['tabla' => 'departamentos as d',         'fk' => 'r.departamento_id',        'id' => 'd.id',   'nombre' => 'd.nombre as departamento'],
            'sala'                => ['tabla' => 'salas as s',                 'fk' => 'r.sala_id',                'id' => 's.id',   'nombre' => 's.nombre as sala'],
            'magistrado'          => ['tabla' => 'magistrados as m',           'fk' => 'r.magistrado_id',          'id' => 'm.id',   'nombre' => 'm.nombre as magistrado'],
            'forma_resolucion'    => ['tabla' => 'forma_resolucions as fr',    'fk' => 'r.forma_resolucion_id',    'id' => 'fr.id',  'nombre' => 'fr.nombre as forma_resolucion'],
            'tipo_jurisprudencia' => ['tabla' => 'tipo_jurisprudencias as tj', 'fk' => 'j.tipo_jurisprudencia_id', 'id' => 'tj.id',  'nombre' => 'tj.nombre as tipo_jurisprudencia'],
            'materia'             => ['tabla' => 'descriptors as dc',          'fk' => 'j.root_id',                'id' => 'dc.id',  'nombre' => 'dc.nombre as materia'],
            'decision'            => ['tabla' => 'resuelve_decisiones as rd',  'fk' => 'rd.resolution_id',         'id' => 'r.id',   'nombre' => 'rd.nombre as decision'],
            'resuelve_fondo'      => ['tabla' => 'resuelve_fondos as rf',      'fk' => 'rd.resuelve_fondo_id',     'id' => 'rf.id',  'nombre' => 'rf.nombre as resuelve_fondo'],
        ];

        $selects = [];
        $groupByCampos = [];
        $datos = DB::table('resolutions as r');

        $yaSeUnio = [
            'jurisprudencias' => false,
            'resuelve_decisiones' => false,
            'resuelve_fondos' => false,
        ];
        $lista_nombres = [];
        foreach ($request->filtros as $config) {
            $name = $config['name'];
            if (!isset($campos[$name])) {
                continue;
            }

            $lista_nombres[] = $name;

            $filtro = $campos[$name];
            $valores = $config['ids'];

            // Jurisprudencias
            if (in_array($name, ['materia', 'tipo_jurisprudencia']) && !$yaSeUnio['jurisprudencias']) {
                $datos->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
                $yaSeUnio['jurisprudencias'] = true;
            }

            // resuelve_decisiones
            if (in_array($name, ['decision', 'resuelve_fondo']) && !$yaSeUnio['resuelve_decisiones']) {
                $datos->join('resuelve_decisiones as rd', 'rd.resolution_id', '=', 'r.id');
                $yaSeUnio['resuelve_decisiones'] = true;
            }

            // resuelve_fondos (solo si se usa el filtro)
            if ($name === 'resuelve_fondo' && !$yaSeUnio['resuelve_fondos']) {
                $datos->join('resuelve_fondos as rf', 'rd.resuelve_fondo_id', '=', 'rf.id');
                $yaSeUnio['resuelve_fondos'] = true;
            }

            // Evita volver a unir tablas ya manejadas
            if (!in_array($name, ['decision', 'resuelve_fondo'])) {
                $datos->join($filtro['tabla'], $filtro['fk'], '=', $filtro['id']);
            }

            // Alias y group by
            if (preg_match('/as\s+(\w+)$/i', $filtro['nombre'], $aliasMatch)) {
                $alias = $aliasMatch[1];
                $selects[] = $filtro['nombre'];
                $groupByCampos[] = $alias;
            } else {
                $selects[] = $filtro['nombre'];
            }

            // Filtro especial para decision
            if ($name === 'decision') {
                $datos->whereIn('rd.tipo', $valores);
            } else {
                $datos->whereIn($filtro['fk'], $valores);
            }
        }

        // Serie temporal
        if ($request->filled('serie')) {
            $lista_nombres[] = 'fecha';
            $selects[] = DB::raw("EXTRACT(YEAR FROM r.fecha_emision) as fecha");
            $groupByCampos[] = 'fecha';
        }

        $selects[] = DB::raw('COUNT(DISTINCT r.id) as cantidad');

        $datos->select($selects);
        $datos->where('r.sala_id', $request->sala);

        if (!empty($groupByCampos)) {
            $datos->groupBy($groupByCampos);
        }

        $resultados = $datos->get();
        $total = $resultados->sum('cantidad');

        $chart = $resultados;
        $multiVariable = true;
        if (count($lista_nombres) === 1) {

            $chart = Math::completarArray2D($resultados, $lista_nombres[0], 'cantidad');
            $multiVariable = false;
        } else if (count($lista_nombres) === 2) {

            $chart = Math::completarArray($resultados, $lista_nombres[0], $lista_nombres[1], 'cantidad');
        }

        return response()->json([
            'total' => $total,
            'data' => $resultados,
            'chart' => $chart,
            'names' => $lista_nombres,
            'multiVariable' => $multiVariable,
        ]);
    }


    public function obtenerEstadisticasMultivariable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filtros' => 'required|array',
            'filtros.*.name' => 'required|string',
            'filtros.*.ids' => 'required|array|min:1',
            'filtros.*.ids.*' => 'required|integer|min:1',
            'serie' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación de los filtros.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $campos = [
            'tipo_resolucion'     => ['tabla' => 'tipo_resolucions as tr',     'fk' => 'r.tipo_resolucion_id',     'id' => 'tr.id',  'nombre' => 'tr.nombre as tipo_resolucion'],
            'departamento'        => ['tabla' => 'departamentos as d',         'fk' => 'r.departamento_id',        'id' => 'd.id',   'nombre' => 'd.nombre as departamento'],
            'sala'                => ['tabla' => 'salas as s',                 'fk' => 'r.sala_id',                'id' => 's.id',   'nombre' => 's.nombre as sala'],
            'magistrado'          => ['tabla' => 'magistrados as m',           'fk' => 'r.magistrado_id',          'id' => 'm.id',   'nombre' => 'm.nombre as magistrado'],
            'forma_resolucion'    => ['tabla' => 'forma_resolucions as fr',    'fk' => 'r.forma_resolucion_id',    'id' => 'fr.id',  'nombre' => 'fr.nombre as forma_resolucion'],
            'tipo_jurisprudencia' => ['tabla' => 'tipo_jurisprudencias as tj', 'fk' => 'j.tipo_jurisprudencia_id', 'id' => 'tj.id',  'nombre' => 'tj.nombre as tipo_jurisprudencia'],
            'materia'             => ['tabla' => 'descriptors as dc',          'fk' => 'j.root_id',                'id' => 'dc.id',  'nombre' => 'dc.nombre as materia'],
            'decision'            => ['tabla' => 'resuelve_decisiones as rd',  'fk' => 'rd.resolution_id',         'id' => 'r.id',   'nombre' => 'rd.nombre as decision'],
            'resuelve_fondo'      => ['tabla' => 'resuelve_fondos as rf',      'fk' => 'rd.resuelve_fondo_id',     'id' => 'rf.id',  'nombre' => 'rf.nombre as resuelve_fondo'],
        ];

        $selects = [];
        $groupByCampos = [];
        $datos = DB::table('resolutions as r');

        $yaSeUnio = [
            'jurisprudencias' => false,
            'resuelve_decisiones' => false,
            'resuelve_fondos' => false,
        ];
        $lista_nombres = [];
        foreach ($request->filtros as $config) {
            $name = $config['name'];
            if (!isset($campos[$name])) {
                continue;
            }

            $lista_nombres[] = $name;

            $filtro = $campos[$name];
            $valores = $config['ids'];

            // Jurisprudencias
            if (in_array($name, ['materia', 'tipo_jurisprudencia']) && !$yaSeUnio['jurisprudencias']) {
                $datos->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
                $yaSeUnio['jurisprudencias'] = true;
            }

            // resuelve_decisiones
            if (in_array($name, ['decision', 'resuelve_fondo']) && !$yaSeUnio['resuelve_decisiones']) {
                $datos->join('resuelve_decisiones as rd', 'rd.resolution_id', '=', 'r.id');
                $yaSeUnio['resuelve_decisiones'] = true;
            }

            // resuelve_fondos (solo si se usa el filtro)
            if ($name === 'resuelve_fondo' && !$yaSeUnio['resuelve_fondos']) {
                $datos->join('resuelve_fondos as rf', 'rd.resuelve_fondo_id', '=', 'rf.id');
                $yaSeUnio['resuelve_fondos'] = true;
            }

            // Evita volver a unir tablas ya manejadas
            if (!in_array($name, ['decision', 'resuelve_fondo'])) {
                $datos->join($filtro['tabla'], $filtro['fk'], '=', $filtro['id']);
            }

            // Alias y group by
            if (preg_match('/as\s+(\w+)$/i', $filtro['nombre'], $aliasMatch)) {
                $alias = $aliasMatch[1];
                $selects[] = $filtro['nombre'];
                $groupByCampos[] = $alias;
            } else {
                $selects[] = $filtro['nombre'];
            }

            // Filtro especial para decision
            if ($name === 'decision') {
                $datos->whereIn('rd.tipo', $valores);
            } else {
                $datos->whereIn($filtro['fk'], $valores);
            }
        }

        // Serie temporal
        if ($request->filled('serie')) {
            $lista_nombres[] = 'fecha';
            $selects[] = DB::raw("EXTRACT(YEAR FROM r.fecha_emision) as fecha");
            $groupByCampos[] = 'fecha';
        }

        $selects[] = DB::raw('COUNT(DISTINCT r.id) as cantidad');

        $datos->select($selects);

        if (!empty($groupByCampos)) {
            $datos->groupBy($groupByCampos);
        }

        $resultados = $datos->get();
        $total = $resultados->sum('cantidad');

        $chart = $resultados;
        $multiVariable = true;
        if (count($lista_nombres) === 1) {

            $chart = Math::completarArray2D($resultados, $lista_nombres[0], 'cantidad');
            $multiVariable = false;
        } else if (count($lista_nombres) === 2) {

            $chart = Math::completarArray($resultados, $lista_nombres[0], $lista_nombres[1], 'cantidad');
        }
        return response()->json([
            'total' => $total,
            'data' => $resultados,
            'chart' => $chart,
            'names' => $lista_nombres,
            'multiVariable' => $multiVariable,
        ]);
    }

    public function obtenerEstadisticasPorSala(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'sala' => 'required|integer',
            'periodos' => 'nullable|array',
            'periodos,*' => 'required|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $sala = Sala::findOrFail($request->sala);


        $query = DB::table('resolutions as r')->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id');

        $query->selectRaw("s.nombre as sala , Count(r.id) as cantidad")
            ->where('s.id', $sala->id)->groupBy('s.nombre');


        if ($request->has('periodos')) {
            $years = $request->periodos;
            $placeholders = implode(',', array_fill(0, count($years), '?'));
            $query->whereRaw("EXTRACT(YEAR FROM fecha_emision) IN ($placeholders)", $years);
        }

        if ($request->has('departamento')) {
            $departamentos = Departamento::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
            $query->whereIn('departamento_id', $departamentos);
        }
        $data = $query->get();



        $resultado = Math::completarArray2D($data, 'sala', 'cantidad');


        return response()->json([

            'data' => $data,
            'chart' => $resultado,
            'tabla' => $sala->nombre,
            'multiVariable' => false,
        ]);
    }

    public function obtenerEstadisticas(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'sala' => 'required|exists:salas,id',
            'variable' => 'required|array',
            'variable.*' => 'required|integer',
            'nombre' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);

        $campos = [
            'tipo_resolucion' => ['tabla' => 'tipo_resolucions as tr', 'foreign_key' => 'tipo_resolucion_id', 'join' => false, 'tabla_join' => 'tipo_resolucion', 'select' => 'tr.nombre as tipo_resolucion', 'id' => 'tr.id', 'value' => 'tr.id'],
            'departamento' => ['tabla' => 'departamentos as d', 'foreign_key' => 'departamento_id', 'join' => false, 'tabla_join' => 'departamento', 'select' => 'd.nombre as departamento', 'id' => 'd.id', 'value' => 'd.id'],
            'sala' => ['tabla' => 'salas as s', 'foreign_key' => 'sala_id', 'join' => false, 'tabla_join' => 'sala', 'select' => 's.nombre as sala', 'id' => 's.id', 'value' => 's.id'],
            'magistrado' => ['tabla' => 'magistrados as m', 'foreign_key' => 'magistrado_id', 'join' => false, 'tabla_join' => 'magistrado', 'select' => 'm.nombre as magistrado', 'id' => 'm.id', 'value' => 'm.id'],
            'forma_resolucion' => ['tabla' => 'forma_resolucions as fr', 'foreign_key' => 'forma_resolucion_id', 'join' => false, 'tabla_join' => 'forma_resolucion', 'select' => 'fr.nombre as forma_resolucion', 'id' => 'fr.id', 'value' => 'fr.id'],
            'tipo_jurisprudencia' => ['tabla' => 'tipo_jurisprudencias as tj', 'foreign_key' => 'tipo_jurisprudencia_id', 'join' => true, 'tabla_join' => 'tipo_jurisprudencia', 'select' => 'tj.nombre as tipo_jurisprudencia', 'id' => 'tj.id', 'value' => 'tj.id'],
            'materia' => ['tabla' => 'descriptors as dt', 'foreign_key' => 'root_id', 'join' => true, 'tabla_join' => 'materia', 'select' => 'dt.nombre as materia', 'id' => 'dt.id', 'value' => 'dt.id'],
            'decision' => ['tabla' => 'resuelve_decisiones as rd', 'foreign_key' => 'r.id', 'join' => true, 'tabla_join' => 'decision', 'select' => 'rd.nombre as decision', 'id' => 'rd.resolution_id', 'value' => 'rd.tipo'],
            'resuelve_fondo' => ['tabla' => 'resuelve_fondos as rf', 'foreign_key' => 'rd.resuelve_fondo_id', 'join' => true,  'tabla_join' => 'resuelve_fondo', 'select' => 'rf.nombre as resuelve_fondo', 'id' => 'rf.id', 'value' => 'rf.id'],

        ];


        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroPrincipal = $campos[$nombre];

        $query = DB::table('resolutions as r');
        if ($filtroPrincipal['join'] && $filtroPrincipal['tabla_join'] === 'materia') {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }

        if ($filtroPrincipal['join'] && $filtroPrincipal['tabla_join'] === 'tipo_jurisprudencia') {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }

        if ($filtroPrincipal['join'] && $filtroPrincipal['tabla_join'] === 'resuelve_fondo') {
            $query->join('resuelve_decisiones as rd', 'rd.resolution_id', '=', 'r.id');
        }

        $query->selectRaw($filtroPrincipal['select'] . ' ,Count(r.id) as cantidad');

        $query->join($filtroPrincipal['tabla'], $filtroPrincipal['id'], $filtroPrincipal['foreign_key']);

        $query->whereIn($filtroPrincipal['value'], $request->variable)->groupBy($filtroPrincipal['tabla_join']);

        $query->where('r.sala_id', $request->sala);
        if ($request->has('periodo')) {
            $query->whereYear('fecha_emision', $request->periodo);
        }
        if ($request->has('departamento')) {
            $departamentos = Departamento::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
            $query->whereIn('departamento_id', $departamentos);
        }
        $data = $query->get();
        $total = array_sum($data->pluck('cantidad')->toArray());

        $resultado = Math::completarArray2D($data, $filtroPrincipal['tabla_join'], 'cantidad');

        return response()->json([

            'data' => $data,
            'chart' => $resultado,
            'multiVariable' => false,
        ]);
    }

    public function obtenerEstadisticasXY(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'variable' => 'required|array',
            'variable.*' => 'required|integer',
            'nombre' => 'required|string',
            'variableY' => 'required|array',
            'variableY.*' => 'required|integer',
            'nombreY' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);
        $nombreY = strtolower($request->nombreY);
        $campos = Listas::obtenerLista();

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }
        if (!array_key_exists($nombreY, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroX = $campos[$nombre];
        $filtroY = $campos[$nombreY];

        $arrayX = DB::table($filtroX['tabla'])
            ->whereIn('id', $request->variable)
            ->pluck('nombre')
            ->toArray();

        $arrayY = DB::table($filtroY['tabla'])
            ->whereIn('id', $request->variableY)
            ->pluck('nombre')
            ->toArray();

        $combinations = [];

        foreach ($arrayX as $sala) {
            foreach ($arrayY as $row) {
                $combinations[] = [
                    'x' => $sala,
                    'nombre' => $row,
                    'cantidad' => 0,
                ];
            }
        }

        $query = DB::table('resolutions as r');
        if ($filtroX['join'] || $filtroY['join']) {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }

        $query->join("{$filtroX['tabla']} as x", 'x.id', '=', "{$filtroX['foreign_key']}")
            ->join("{$filtroY['tabla']} as y", 'y.id', '=', "{$filtroY['foreign_key']}")
            ->whereIn("{$filtroX['foreign_key']}", $request->variable)
            ->whereIn("{$filtroY['foreign_key']}", $request->variableY);

        if ($request->has('periodo')) {
            $query->whereYear('fecha_emision', $request->periodo);
        }
        if ($request->has('departamento')) {
            $departamentos = Departamento::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
            $query->whereIn('departamento_id', $departamentos);
        }
        // Selección y agrupamiento
        $query->selectRaw('x.nombre as x, y.nombre as nombre, COUNT(r.id) as cantidad')
            ->groupBy('x.nombre', 'y.nombre');

        $data = $query->get();

        $total = array_sum($data->pluck('cantidad')->toArray());

        $datoLookup = [];
        foreach ($data as $dato) {
            $datoLookup[$dato->x][$dato->nombre] = $dato->cantidad;
        }

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['x']][$item['nombre']] ?? 0;
        }

        $resultado = array_map(function ($tag) use ($filtroX, $filtroY) {
            return array(
                $filtroX['nombre'] => $tag['x'],
                $filtroY['nombre'] => $tag['nombre'],
                'cantidad' => $tag['cantidad']
            );
        }, $combinations);

        return response()->json([
            'total' => $total,
            'data' => $resultado,
            'chart' => Math::completarArray($resultado, $filtroX['nombre'], $filtroY['nombre']),
            'multiVariable' => true,
        ]);
    }

    public function obtenerFiltros(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'sala' => 'required|integer',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $campos = [
            'tipo_resolucion' => ['tabla' => 'tipo_resolucions', 'foreign_key' => 'tipo_resolucion_id', 'join' => false,  'columna' => 'id', 'nombre' => 'tipo_resolucion'],
            // 'departamento' => ['tabla' => 'departamentos', 'foreign_key' => 'departamento_id', 'join' => false, 'columna' => 'id', 'nombre' => 'departamento'],
            'sala' => ['tabla' => 'salas', 'foreign_key' => 'sala_id', 'join' => false,  'columna' => 'id', 'nombre' => 'sala'],
            'magistrado' => ['tabla' => 'magistrados', 'foreign_key' => 'magistrado_id', 'join' => false,  'columna' => 'id', 'nombre' => 'magistrado'],
            'forma_resolucion' => ['tabla' => 'forma_resolucions', 'foreign_key' => 'forma_resolucion_id', 'join' => false,  'columna' => 'id', 'nombre' => 'forma_resolucion'],
            'tipo_jurisprudencia' => ['tabla' => 'jurisprudencias', 'foreign_key' => 'tipo_jurisprudencia_id', 'join' => true,  'columna' => 'id', 'nombre' => 'tipo_jurisprudencia'],
            'materia' => ['tabla' => 'jurisprudencias', 'foreign_key' => 'root_id', 'join' => true,  'columna' => 'id', 'nombre' => 'materia'],
            'resuelve_decision' => ['tabla' => 'resuelve_decisiones', 'foreign_key' => 'rd.tipo', 'join' => true,  'columna' => 'id', 'nombre' => 'decision'],
            'resuelve_fondo' => ['tabla' => 'resuelve_fondos', 'foreign_key' => 'rf.id', 'join' => true, 'columna' => 'id', 'nombre' => 'resuelve_fondo'],

        ];

        $nombre = strtolower("sala");

        if (!array_key_exists($nombre, $campos)) {
            return response()->json(['error' => 'Filtro inválido.'], 400);
        }

        // Extraemos el campo actual y lo quitamos del array general
        $filtroPrincipal = $campos[$nombre];
        unset($campos[$nombre]);

        if ($request->has('departamento')) {
            unset($campos['departamento']);
        }

        $resultado = [];

        // Recorremos el resto de filtros normalmente
        foreach ($campos as $value) {
            $query = Resolution::query()->from('resolutions as r');

            if ($value['join'] && $value['tabla'] === "jurisprudencias") {
                $query->join('jurisprudencias as x', 'x.resolution_id', '=', 'r.id');
            }

            if ($value['join'] && $value['tabla'] === "resuelve_decisiones") {
                $query->join('resuelve_decisiones as rd', 'rd.resolution_id', '=', 'r.id');
            }
            if ($value['join'] && $value['tabla'] === "resuelve_fondos") {
                $query->join('resuelve_fondos as rf', 'rf.sala_id', '=', 'r.sala_id');
            }

            $query->where("r.sala_id", $request->sala);

            if ($request->has('periodo')) {
                $query->whereYear('fecha_emision', $request->periodo);
            }

            if ($request->has('departamento')) {
                $departamentos = Departamento::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
                $query->whereIn('departamento_id', $departamentos);
            }


            $resultado[$value['nombre']] = $query->distinct()->pluck($value['foreign_key'])->toArray();
        }

        return response()->json($resultado);
    }

    public function obtenerOpciones(Request $request)
    {

        $filtros = $request->input('filtros', []);
        $campos = ['tipo_resolucion_id', 'departamento_id', 'sala_id', 'magistrado_id', 'forma_resolucion_id'];
        foreach ($campos as $campo) {

            $query = Resolution::query();

            foreach ($filtros as $key => $value) {
                if ($key !== $campo && !empty($value)) {
                    $query->where($key, $value);
                }
            }
            $resultado[$campo] = $query->distinct()->pluck($campo)->toArray();
        }

        return response()->json([
            'data' => $resultado,
        ]);
    }

    public function obtenerVariables()
    {

        $departamentos = Departamento::select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        //$salas = Sala::select('id', 'nombre')->orderBy('nombre', 'desc')->get();
        $tipo_jurisprudencias = TipoJurisprudencia::select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        $tipo_resolucions = TipoResolucion::select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        $forma_resolucions = FormaResolucion::select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        $magistrados = Magistrado::select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        $resuelve_fondos = ResuelveFondo::select('id', 'nombre')->orderBy('nombre', 'asc')->get();
        $decisiones = ResuelveDecision::selectRaw('tipo as id, CONCAT(\'Tipo \', tipo) as nombre')
            ->groupBy('tipo')
            ->get();


        $salas = DB::table('salas as m')
            ->selectRaw('
                m.id,
                m.nombre,
                EXTRACT(YEAR FROM MAX(r.fecha_emision)) AS fecha_max,
                EXTRACT(YEAR FROM MIN(r.fecha_emision)) AS fecha_min
            ')
            ->join('resolutions as r', 'r.sala_id', '=', 'm.id')
            ->groupBy('m.id', 'm.nombre')
            ->orderBy('nombre', 'asc')
            ->get();

        $materia = Descriptor::select('id', 'nombre')->whereNull('descriptor_id')->orderBy('nombre', 'asc')->get();

        $periodo = DB::table('resolutions')
            ->selectRaw("CAST(coalesce(EXTRACT(YEAR FROM fecha_emision) , '0') AS integer) as id,EXTRACT(YEAR FROM fecha_emision) AS nombre")
            ->groupBy('nombre')
            ->orderBy('nombre', 'desc')
            ->get();
        $datos = [
            'departamento' => $departamentos->toArray(),
            'sala' => $salas->toArray(),
            'tipo_jurisprudencia' => $tipo_jurisprudencias->toArray(),
            'tipo_resolucion' => $tipo_resolucions->toArray(),
            'forma_resolucion' => $forma_resolucions->toArray(),
            'magistrado' => $magistrados->toArray(),
            'materia' => $materia->toArray(),
            'periodo' => $periodo->toArray(),
            'resuelve_fondo' => $resuelve_fondos->toArray(),
            'decision' => $decisiones->toArray(),
        ];
        $datos = array_filter($datos);

        return response()->json($datos);
    }

    public function filtrarResolucionesContenidoOld(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|integer',
            'sala' => 'nullable|array',
            'sala.*' => 'required|integer',
            'magistrado' => 'nullable|array',
            'magistrado.*' => 'required|integer',
            'forma_resolucion' => 'nullable|array',
            'forma_resolucion.*' => 'required|integer',
            'tipo_jurisprudencia' => 'nullable|array',
            'tipo_jurisprudencia.*' => 'required|integer',
            'materia' => 'nullable|array',
            'materia.*' => 'required|integer',
            'tipo_resolucion' => 'nullable|array',
            'tipo_resolucion.*' => 'required|integer',
            'periodo' => 'nullable|array',
            'periodo.*' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
            'highlight' => 'nullable|array',
            'highlight.*' => 'string|in:contenido,demandante,demandado,sintesis,maxima,precedente,proceso',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = $request->input('term', '');
        $highlight = $request->input('highlight', ['contenido']);
        $strategy = $request->input('strategy', false);
        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        // $highlight = $request->input('highlight', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        // $highlight = ['descriptor'];
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo', 'magistrado', 'forma_resolucion'];
        $strategy = 'all';

        $extraFields = [
            'id',
            'resolution_id',
            'tipo_resolucion',
            'nro_resolucion',
            'periodo',
        ];

        // unir ambos arrays sin duplicados
        $allFields = array_unique(array_merge($highlight, $extraFields));

        $options = [
            'query_by' => implode(',', $highlight),
            'highlight_full_fields' => implode(',', $highlight),
            'highlight_start_tag' => '<b class="highlight">',
            'highlight_end_tag' => '</b>',
            'highlight_affix_num_tokens' => 9,
            'snippet_threshold' => 100,
            'matching_strategy' => $strategy,
            'facet_by' => implode(',', $facetas),
            'per_page' => $perPage,
            'offset' => $offset,
            'page' => $page,
            'include_fields' => implode(',', $allFields),
        ];

        $search = Resolution::search($query)->options($options);

        if ($request->has('materia')) {
            $materia = $request->input('materia');
            $search->where('materia', $materia[0]);
        }

        if ($request->has('descriptor')) {
            $descriptor = $request->input('descriptor');
            $search->where('descriptor_id', $descriptor);
        }
        if ($request->has('periodo')) {
            $search->where('periodo', $request->periodo[0]);
        }

        if ($request->has('tipo_resolucion')) {
            $search->whereIn('tipo_resolucion', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $search->whereIn('sala', $request->sala);
        }
        if ($request->has('departamento')) {
            $search->whereIn('departamento', $request->departamento);
        }

        $search = $search->raw();

        $hits = Busqueda::generarResultado($search);

        $facetas = $search['facet_counts'] ?? [];

        $facets = Busqueda::obtenerFacetas($facetas);

        return response()->json([
            'data' => $hits,
            'facets' => $facets,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['found'] ?? 0,
            'last_page' => ceil(($search['found'] ?? 0) / $perPage),

        ]);

        return response()->json($resultados);

        $variable = $request['variable'];
        $orden = $request['orden'];

        $columnasPermitidas = ['nro_resolucion', 'fecha_emision', 'tipo_resolucion', 'departamento', 'sala'];
        $variable = in_array($variable, $columnasPermitidas) ? $variable : 'fecha_emision';
        $orden = in_array(strtolower($orden), ['asc', 'desc']) ? $orden : 'asc';

        $query = DB::table('resolutions as r')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->select('r.id', 'r.nro_resolucion', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala');

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipoJurisprudencia = $request->tipo_jurisprudencia;
            $materia = $request->materia;

            $subquery = DB::table('jurisprudencias')
                ->select('resolution_id');

            if ($request->has('tipo_jurisprudencia')) {
                $subquery->whereIn('tipo_jurisprudencia_id', $tipoJurisprudencia);
            }

            if ($request->has('materia')) {
                $subquery->whereIn('root_id', $materia);
            }

            $query->joinSub($subquery, 'j', function ($join) {
                $join->on('j.resolution_id', '=', 'r.id');
            });
        }

        if ($request->has('periodo')) {
            $query->whereYear('r.fecha_emision', $request->periodo);
        }

        if ($request->has('magistrado')) {
            $query->whereIn('r.magistrado_id', $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->whereIn('r.forma_resolucion_id', $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->whereIn('r.tipo_resolucion_id', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->whereIn('r.sala_id', $request->sala);
        }
        if ($request->has('departamento')) {
            $query->whereIn('r.departamento_id', $request->departamento);
        }

        $search = $request->input('term');
        $search = preg_replace('/\s+/', ' ', $search);
        $search = trim($search);
        $search = strtolower($search);
        $stopwords = NLP::getStopWords();

        if ($request->has('term') && in_array($search, $stopwords) === false) {

            $searchSanitized = addslashes($search);

            $query->join('contents as c', 'c.resolution_id', '=', 'r.id')
                ->addSelect(DB::raw("
                    resolution_id,
                    ts_headline('spanish', contenido, plainto_tsquery('spanish', '{$searchSanitized}')) as contexto
                "))->whereRaw('searchtext @@ plainto_tsquery(\'spanish\', ?)', [$search]);
        }

        $results = $query->orderBy($variable, $orden)->paginate(20);

        return response()->json($results);
    }

    public function index()
    {

        $all_res = DB::table('resolutions as r')
            ->selectRaw("DATE_TRUNC('year', r.fecha_emision)::date as periodo, COALESCE(COUNT(r.id), 0) AS cantidad")
            ->groupBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)"))
            ->orderBy('periodo')
            ->get();

        $all_jurisprudencia = DB::table('resolutions as r')
            ->join('jurisprudencias as j', 'r.id', '=', 'j.resolution_id')
            ->selectRaw("DATE_TRUNC('year', r.fecha_emision)::date as periodo, COALESCE(COUNT(DISTINCT r.id), 0) AS cantidad")
            ->groupBy(DB::raw("DATE_TRUNC('year', r.fecha_emision)"))
            ->orderBy('periodo')
            ->get();

        $max_res = max($all_res->pluck('cantidad')->toArray() ?: [0]) ?: 0;
        $max_juris = max($all_jurisprudencia->pluck('cantidad')->toArray() ?: [0]) ?: 0;
        $result_res = $all_res->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();
        $result_juris = $all_jurisprudencia->map(function ($item) {
            return [$item->periodo, $item->cantidad];
        })->toArray();

        return response()->json([
            'max_res' => $max_res,
            'max_juris' => $max_juris,
            'resoluciones' => $result_res,
            'jurisprudencia' => $result_juris,
        ]);
    }

    public function show($id): JsonResponse
    {

        try {

            // @phpstan-ignore larastan.relationExistence
            $resolution = Resolution::with('content', 'forma_resolucion', 'sala', 'departamento', 'magistrado')->findOrFail($id);
            // @phpstan-ignore larastan.relationExistence
            $jurisprudencias = Jurisprudencia::with('materia', 'tipo_descriptor')->where('resolution_id', $id)->get();

            return response()->json([
                'resolucion' => new ResolutionResource($resolution),
                'jurisprudencias' => JurisprudenciaResource::collection($jurisprudencias),
            ], 200);
        } catch (ModelNotFoundException $e) {

            return response()->json([
                'error' => 'Resolución no encontrada',
            ], 404);
        } catch (\Exception $e) {
            // Manejar otras excepciones posibles
            return response()->json([
                'error' => 'Ocurrió un error al intentar obtener la resolución' . $e,
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }

    public function obtenerParametros()
    {
        $departamentos = Departamento::all();
        $salas = Sala::all();

        if (!$salas || !$departamentos) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        $data = [
            'departamentos' => $departamentos->toArray(),
            'salas' => $salas->toArray(),
        ];

        return response()->json($data);
    }

    public function filtrarResoluciones(Request $request)
    {
        $texto = $request['texto'];
        $departamento = $request['departamento'];
        $sala = $request['selectedSala'];
        $mi_sala = null;
        $orden = $request['orden'];
        $mi_departamento = null;
        $fecha_exacta = $request['fecha_exacta'];
        $fecha_desde = $request['fecha_desde'];
        $fecha_hasta = $request['fecha_hasta'];

        if ($sala && $sala !== 'todas') {
            $mi_sala = Sala::where('nombre', $sala)->first();
            if (!$mi_sala) {
                return response()->json(['error' => 'Sala no encontrada'], 404);
            }
        } elseif (!$sala) {
            return response()->json(['error' => 'Campo sala no encontrado'], 404);
        }

        if ($departamento && $departamento !== 'todos') {
            $mi_departamento = Departamento::where('nombre', $departamento)->first();
            if (!$mi_departamento) {
                return response()->json(['error' => 'Departamento no encontrado'], 404);
            }
        } elseif (!$departamento) {
            return response()->json(['error' => 'Campo departamento no encontrado'], 404);
        }

        $query = DB::table('resolutions as r')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->select('r.nro_resolucion', 'r.id', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala')
            ->where('c.contenido', 'like', '%' . $texto . '%');

        if ($mi_sala) {
            $query->where('r.sala_id', $mi_sala->id);
        }

        if ($mi_departamento) {
            $query->where('r.departamento_id', $mi_departamento->id);
        }

        if ($fecha_exacta) {
            $query->where('r.fecha_emision', $fecha_exacta);
        }
        if ($fecha_desde && $fecha_hasta) {
            $query->whereBetween('r.fecha_emision', [$fecha_desde, $fecha_hasta]);
        }
        if ($orden == 'Recientes') {
            $query->orderByDesc('r.fecha_emision');
        } else {
            $query->orderBy('r.fecha_emision');
        }
        $paginatedData = $query->orderBy('tipo_resolucion')->paginate(10);

        return response()->json($paginatedData);
    }

    public function obtenerSerieTemporal(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'materia' => 'nullable|string',
            'tipo_jurisprudencia' => 'nullable|string',
            'tipo_resolucion' => [
                'nullable',
                'integer',
            ],
            'sala' => [
                'nullable',
                'integer',
            ],
            'departamento' => [
                'nullable',
                'integer',
            ],
            'magistrado' => [
                'nullable',
                'integer',
            ],
            'forma_resolucion' => [
                'nullable',
                'integer',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $fecha_final = $request->input('fecha_final');
        $fecha_inicial = $request->input('fecha_inicial');
        $intervalo = $request->input('intervalo');

        $intervalo = 'quarter';
        $validIntervals = ['day', 'month', 'year', 'week', 'quarter'];
        if (!in_array($intervalo, $validIntervals)) {
            throw new InvalidArgumentException('Invalid interval specified.');
        }

        $query = DB::table('resolutions AS r')
            ->selectRaw('COUNT(r.id) AS cantidad');

        switch ($intervalo) {
            case 'day':
                $query->selectRaw('DATE(r.fecha_emision) AS periodo');
                $query->groupBy(DB::raw('DATE(r.fecha_emision)'));
                $query->orderBy(DB::raw('DATE(r.fecha_emision)'));
                break;
            case 'week':
                $query->selectRaw('DATE_TRUNC(\'week\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'week\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'week\', r.fecha_emision)::date'));
                break;
            case 'month':
                $query->selectRaw('DATE_TRUNC(\'month\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'month\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'month\', r.fecha_emision)::date'));
                break;
            case 'quarter':

                $query->selectRaw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'quarter\', r.fecha_emision)::date'));
                break;
            case 'year':

                $query->selectRaw('DATE_TRUNC(\'year\', r.fecha_emision)::date AS periodo');
                $query->groupBy(DB::raw('DATE_TRUNC(\'year\', r.fecha_emision)::date'));
                $query->orderBy(DB::raw('DATE_TRUNC(\'year\', r.fecha_emision)::date'));
                break;
        }

        if ($request->has('limite')) {
            $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 2005');
        }
        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) > 1999');
        $query->whereRaw('EXTRACT(YEAR FROM r.fecha_emision) < 2025');
        if ($request->has('magistrado')) {
            $query->where('r.magistrado_id', $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->where('r.forma_resolucion_id', $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->where('r.tipo_resolucion_id', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->where('r.sala_id', $request->sala);
        }
        if ($request->has('departamento')) {
            $query->where('r.departamento_id', $request->departamento);
        }

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipo_jurisprudencia = $request->tipo_jurisprudencia ?? 'all';
            $materia = $request->materia ?? 'all';

            $query->join(DB::raw("(SELECT resolution_id FROM jurisprudencias
            WHERE ('{$tipo_jurisprudencia}' = 'all' OR tipo_jurisprudencia = '{$tipo_jurisprudencia}')
            AND ('{$materia}' = 'all' OR descriptor LIKE '{$materia}%')) AS j"), 'j.resolution_id', '=', 'r.id');
        }

        $resolutions = $query->get();

        return response()->json([

            'resolutions' => $resolutions,
        ]);
    }

    public function obtenerSerieSimple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'variable' => 'required|array',
            'variable.*' => 'required|integer',
            'nombre' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);

        $campos = [
            'tipo_resolucion' => ['tabla' => 'tipo_resolucions', 'foreign_key' => 'tipo_resolucion_id', 'join' => false, 'columna' => 'id', 'nombre' => 'tipo_resolucion'],
            'departamento' => ['tabla' => 'departamentos', 'foreign_key' => 'departamento_id', 'join' => false, 'columna' => 'id', 'nombre' => 'departamento'],
            'sala' => ['tabla' => 'salas', 'foreign_key' => 'sala_id', 'join' => false, 'columna' => 'id', 'nombre' => 'sala'],
            'magistrado' => ['tabla' => 'magistrados', 'foreign_key' => 'magistrado_id', 'join' => false, 'columna' => 'id', 'nombre' => 'magistrado'],
            'forma_resolucion' => ['tabla' => 'forma_resolucions', 'foreign_key' => 'forma_resolucion_id', 'join' => false, 'columna' => 'id', 'nombre' => 'forma_resolucion'],
            'tipo_jurisprudencia' => ['tabla' => 'tipo_jurisprudencias', 'foreign_key' => 'tipo_jurisprudencia_id', 'join' => true, 'columna' => 'id', 'nombre' => 'tipo_jurisprudencia'],
            'materia' => ['tabla' => 'descriptors', 'foreign_key' => 'root_id', 'join' => true, 'columna' => 'id', 'nombre' => 'materia'],
        ];

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroPrincipal = $campos[$nombre];

        $query = DB::table('resolutions as r');
        if ($filtroPrincipal['join']) {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }
        $query->selectRaw(" x.nombre as nombre ,Count(r.id) as cantidad,   TO_CHAR(fecha_emision, 'YYYY-MM') AS fecha")
            ->join($filtroPrincipal['tabla'] . ' as x', 'x.id', $filtroPrincipal['foreign_key'])
            ->whereIn($filtroPrincipal['foreign_key'], $request->variable)
            ->groupBy('fecha', 'nombre');

        $data = $query->get();
        $total = array_sum($data->pluck('cantidad')->toArray());
        $resultado = Math::completarArray($data);

        return response()->json([

            'data' => $resultado,
            'tabla' => $request->nombre,
            'total' => $total,
            'columna' => $request->nombre,
            'nombre' => 'nombre',
            'multiVariable' => false,
        ]);
    }

    public function obtenerMapaSimple(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'variable' => 'required|array|min:1',
            'variable.*' => 'required',
            'nombre' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $nombre = strtolower($request->nombre);
        $terminos = $request->variable;

        $campos = [
            'tipo_resolucion' => ['tabla' => 'tipo_resolucions', 'foreign_key' => 'tipo_resolucion_id', 'join' => false, 'columna' => 'id', 'nombre' => 'tipo_resolucion'],
            'departamento' => ['tabla' => 'departamentos', 'foreign_key' => 'departamento_id', 'join' => false, 'columna' => 'id', 'nombre' => 'departamento'],
            'sala' => ['tabla' => 'salas', 'foreign_key' => 'sala_id', 'join' => false, 'columna' => 'id', 'nombre' => 'sala'],
            'magistrado' => ['tabla' => 'magistrados', 'foreign_key' => 'magistrado_id', 'join' => false, 'columna' => 'id', 'nombre' => 'magistrado'],
            'forma_resolucion' => ['tabla' => 'forma_resolucions', 'foreign_key' => 'forma_resolucion_id', 'join' => false, 'columna' => 'id', 'nombre' => 'forma_resolucion'],
            'tipo_jurisprudencia' => ['tabla' => 'tipo_jurisprudencias', 'foreign_key' => 'tipo_jurisprudencia_id', 'join' => true, 'columna' => 'id', 'nombre' => 'tipo_jurisprudencia'],
            'materia' => ['tabla' => 'descriptors', 'foreign_key' => 'root_id', 'join' => true, 'columna' => 'id', 'nombre' => 'materia'],
        ];

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroPrincipal = $campos[$nombre];

        $query = DB::table('resolutions as r');
        if ($filtroPrincipal['join']) {
            $query->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');
        }

        if ($filtroPrincipal['tabla'] != 'departamentos') {
            $query->selectRaw(' x.nombre as name ,Count(r.id) as cantidad, d.nombre as departamento');
            $query->join('departamentos as d', 'd.id', '=', 'r.departamento_id')->join($filtroPrincipal['tabla'] . ' as x', 'x.id', $filtroPrincipal['foreign_key'])->whereIn($filtroPrincipal['foreign_key'], $request->variable)->groupBy('x.nombre', 'd.nombre');
        } else {
            return response()->json([
                'error' => 'No se puede realizar un mapa de departamentos',
            ], 422);
        }

        $data = $query->get();
        $total = array_sum($data->pluck('cantidad')->toArray());

        $resultado = Math::completarArrayMapa($data, 'departamento', 'name');

        return response()->json([

            'data' => $resultado,
            'tabla' => $request->nombre,
            'total' => $total,
            'columna' => $request->nombre,
            'nombre' => 'nombre',
            'multiVariable' => false,
        ]);
    }

    public function obtenerMapaX(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'variable' => 'required|array|min:1',
            'variable.*' => 'required',
            'nombre' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }
        $nombre = strtolower($request->nombre);
        $terminos = $request->variable;

        $lista = ['maxima', 'sintesis', 'restrictor', 'ratio', 'precedente', 'proceso', 'demandante', 'demandado'];

        if (!in_array($nombre, $lista)) {
            return $this->obtenerMapaSimple($request);
        }

        $elemento = Listas::obtenerItem($nombre);
        if ($elemento == null) {
            return response()->json([
                'error' => 'No existe la variable solicitada',
            ], 422);
        }
        $tabla = $elemento['tabla'];
        $columna = $elemento['nombre'];

        if (!preg_match('/^[a-z0-9_]+$/', $tabla) || !preg_match('/^[a-z0-9_]+$/', $columna)) {
            return response()->json(['error' => 'Parámetros inválidos'], 400);
        }

        $terminosSQL = implode(',', array_map(function ($t) {
            return "'" . addslashes(strtolower($t)) . "'";
        }, $terminos));

        $query = DB::table(DB::raw("(SELECT unnest(ARRAY[$terminosSQL]) AS nombre) AS t"))
            ->join(DB::raw("$tabla AS x"), function ($join) use ($columna) {
                $join->whereRaw("LOWER(x.$columna) ~* ('\\m' || t.nombre || '\\M')");
            });

        if ($elemento['join']) {
            $query->join('resolutions as r', 'r.id', '=', 'x.resolution_id')->join('departamentos as d', 'd.id', '=', 'r.departamento_id');
            $query->select('t.nombre as name', DB::raw('COUNT(DISTINCT r.id) as cantidad'), 'd.nombre as departamento');
            $query->groupBy('t.nombre', 'd.nombre');
        } else {
            $query->join('departamentos as d', 'd.id', '=', 'x.departamento_id');
            $query->select('t.nombre as name', DB::raw('COUNT(DISTINCT x.id) as cantidad'), 'd.nombre as departamento');
            $query->groupBy('t.nombre', 'd.nombre');
        }

        $data = $query->get();
        $total = array_sum($data->pluck('cantidad')->toArray());

        $resultado = Math::completarArrayMapa($data, 'departamento', 'name');

        return response()->json([

            'data' => $resultado,
            'tabla' => $request->nombre,
            'total' => $total,
            'columna' => $request->nombre,
            'nombre' => 'nombre',
            'multiVariable' => false,
        ]);
    }

    public function obtenerSerieTemporalX(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'variable' => 'required|array|min:1',
            'variable.*' => 'required',
            'nombre' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);
        $terminos = $request->variable;

        $lista = ['maxima', 'sintesis', 'restrictor', 'ratio', 'precedente', 'proceso', 'demandante', 'demandado'];

        if (!in_array($nombre, $lista)) {
            return $this->obtenerSerieSimple($request);
        }

        $elemento = Listas::obtenerItem($nombre);
        if ($elemento == null) {
            return response()->json([
                'error' => 'No existe la variable solicitada',
            ], 422);
        }
        $tabla = $elemento['tabla'];
        $columna = $elemento['nombre'];

        // Validación de seguridad para tabla y columna
        if (!preg_match('/^[a-z0-9_]+$/', $tabla) || !preg_match('/^[a-z0-9_]+$/', $columna)) {
            return response()->json(['error' => 'Parámetros inválidos'], 400);
        }

        $terminosSQL = implode(',', array_map(function ($t) {
            return "'" . addslashes(strtolower($t)) . "'";
        }, $terminos));

        $query = DB::table(DB::raw("(SELECT unnest(ARRAY[$terminosSQL]) AS nombre) AS t"))
            ->join(DB::raw("$tabla AS x"), function ($join) use ($columna) {
                $join->whereRaw("LOWER(x.$columna) ~* ('\\m' || t.nombre || '\\M')");
            });

        if ($elemento['join']) {
            $query->join('resolutions as r', 'r.id', '=', 'x.resolution_id');
            $query->select('nombre', DB::raw('COUNT(DISTINCT r.id) as cantidad'), DB::raw('EXTRACT(YEAR FROM fecha_emision) as fecha'));
            $query->groupBy('fecha', 'nombre');
        } else {
            $query->select('nombre', DB::raw('COUNT(*) as cantidad'), DB::raw('EXTRACT(YEAR FROM fecha_emision) as fecha'));
            $query->groupBy('fecha', 'nombre');
        }

        $data = $query->get();
        $total = array_sum($data->pluck('cantidad')->toArray());
        $resultado = Math::completarArray($data);

        return response()->json([

            'data' => $resultado,
            'tabla' => $request->nombre,
            'total' => $total,
            'columna' => $request->nombre,
            'nombre' => 'nombre',
            'multiVariable' => false,
        ]);
    }

    public function getTerminosX(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'variable' => 'required|array|min:1',
            'variable.*' => 'required',
            'nombre' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);
        $terminos = $request->variable;

        $lista = ['maxima', 'sintesis', 'restrictor', 'ratio', 'precedente', 'proceso', 'demandante', 'demandado'];

        if (!in_array($nombre, $lista)) {
            return $this->obtenerEstadisticas($request);
        }

        $elemento = Listas::obtenerItem($nombre);
        if ($elemento == null) {
            return response()->json([
                'error' => 'No existe la variable solicitada',
            ], 422);
        }
        $tabla = $elemento['tabla'];
        $columna = $elemento['nombre'];

        // Validación de seguridad para tabla y columna
        if (!preg_match('/^[a-z0-9_]+$/', $tabla) || !preg_match('/^[a-z0-9_]+$/', $columna)) {
            return response()->json(['error' => 'Parámetros inválidos'], 400);
        }

        $terminosSQL = implode(',', array_map(function ($t) {
            return "'" . addslashes(strtolower($t)) . "'";
        }, $terminos));

        $resultados = [];

        foreach ($terminos as $termino) {
            $query = DB::table("$tabla AS x")
                ->whereRaw("LOWER(x.$columna) ~* ('\\m' || ? || '\\M')", [strtolower($termino)]);

            if ($elemento['join']) {
                $query->join('resolutions as r', 'r.id', '=', 'x.resolution_id');
                $count = $query->distinct('r.id')->count();
            } else {
                $count = $query->count();
            }

            $resultados[] = [
                'nombre' => $termino,
                'cantidad' => $count,
            ];
        }

        $resultado = Math::completarArray2D($resultados, 'nombre', 'cantidad');


        return response()->json([

            'data' => $resultados,
            'tabla' => $request->nombre,
            'columna' => $request->nombre,
            'chart' => $resultado,
            'nombre' => 'nombre',
            'multiVariable' => false,
        ]);
    }

    public function obtenerXYSimple(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'variable' => 'required|array',
            'variable.*' => 'required',
            'nombre' => 'required|string',
            'variableY' => 'required|array',
            'variableY.*' => 'required',
            'nombreY' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);
        $nombreY = strtolower($request->nombreY);
        $campos = Listas::obtenerLista();

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }
        if (!array_key_exists($nombreY, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroX = $campos[$nombre];
        $filtroY = $campos[$nombreY];
        unset($campos[$nombre]);
        unset($campos[$nombreY]);

        $lista = ['maxima', 'sintesis', 'restrictor', 'ratio', 'precedente', 'proceso', 'demandante', 'demandado'];

        if (in_array($nombre, $lista)) {
            $elemento = $filtroX;
            $filtroY = $filtroY;
            $terminos = $request->variable;
            $ids = $request->variableY;
        } else {
            $elemento = $filtroY;
            $filtroY = $filtroX;
            $terminos = $request->variableY;
            $ids = $request->variable;
        }

        $arrayX = $terminos;

        $arrayY = DB::table($filtroY['tabla'])
            ->select('nombre as y')->whereIn('id', $ids)->pluck('y')->toArray();

        $combinations = [];

        foreach ($arrayX as $sala) {
            foreach ($arrayY as $row) {
                $combinations[] = [
                    'termino' => $sala,
                    'nombre' => $row,
                    'cantidad' => 0,
                ];
            }
        }

        $tabla = $elemento['tabla'];
        $columna = $elemento['nombre'];

        // Validación de seguridad para tabla y columna
        if (!preg_match('/^[a-z0-9_]+$/', $tabla) || !preg_match('/^[a-z0-9_]+$/', $columna)) {
            return response()->json(['error' => 'Parámetros inválidos'], 400);
        }

        $terminosSQL = implode(',', array_map(function ($t) {
            return "'" . addslashes(strtolower($t)) . "'";
        }, $terminos));

        $query = DB::table(DB::raw("(SELECT unnest(ARRAY[$terminosSQL]) AS termino) AS t"))
            ->join(DB::raw("$tabla AS x"), function ($join) use ($columna) {
                $join->whereRaw("LOWER(x.$columna) ~* ('\\m' || t.termino || '\\M')");
            });

        if ($elemento['join'] && $filtroY['join']) {
            $query->join('resolutions as r', 'r.id', '=', 'x.resolution_id')->join("{$filtroY['tabla']} as y", 'y.id', '=', "x.{$filtroY['foreign_key']}")->whereIn("x.{$filtroY['foreign_key']}", $ids);
            $query->selectRaw('termino, y.nombre as nombre, COUNT(Distinct(x.id)) as cantidad')
                ->groupBy('termino', 'y.nombre');
        } elseif ($elemento['join'] || $filtroY['join']) {

            if ($elemento['join']) {
                $query->join('resolutions as r', 'r.id', '=', 'x.resolution_id')->join("{$filtroY['tabla']} as y", 'y.id', '=', "r.{$filtroY['foreign_key']}")->whereIn("r.{$filtroY['foreign_key']}", $ids);
                $query->selectRaw('termino, y.nombre as nombre,  COUNT(Distinct(x.id)) as cantidad')
                    ->groupBy('termino', 'y.nombre');
            } else {
                $query->join('jurisprudencias as r', 'x.id', '=', 'r.resolution_id')->join("{$filtroY['tabla']} as y", 'y.id', '=', "r.{$filtroY['foreign_key']}")->whereIn("r.{$filtroY['foreign_key']}", $ids);
                $query->selectRaw('termino, y.nombre as nombre,  COUNT(Distinct(x.id)) as cantidad')
                    ->groupBy('termino', 'y.nombre');
            }
        } else {

            $query->join("{$filtroY['tabla']} as y", 'y.id', '=', "x.{$filtroY['foreign_key']}")->whereIn("x.{$filtroY['foreign_key']}", $ids);
            $query->selectRaw('termino, y.nombre as nombre,  COUNT(Distinct(x.id)) as cantidad')
                ->groupBy('termino', 'y.nombre');
        }

        if ($request->has('periodo')) {
            $query->whereYear('fecha_emision', $request->periodo);
        }
        if ($request->has('departamento')) {
            $departamentos = Departamento::whereIn('nombre', $request->departamento)->pluck('id')->toArray();
            $query->whereIn('departamento_id', $departamentos);
        }

        $data = $query->orderByDesc('cantidad')
            ->get();

        $total = array_sum($data->pluck('cantidad')->toArray());

        $datoLookup = [];
        foreach ($data as $dato) {
            $datoLookup[$dato->termino][$dato->nombre] = $dato->cantidad;
        }

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item['termino']][$item['nombre']] ?? 0;
        }

        $resultado = array_map(function ($tag) use ($filtroX, $filtroY) {
            return array(
                $filtroX['nombre'] => $tag['termino'],
                $filtroY['nombre'] => $tag['nombre'],
                'cantidad' => $tag['cantidad']
            );
        }, $combinations);

        return response()->json([
            'total' => $total,
            'data' => $resultado,
            'chart' => Math::completarArray($resultado, $filtroX['nombre'], $filtroY['nombre']),
            'multiVariable' => true,
        ]);
    }

    public function filtrarResolucionesContenido(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|integer',
            'sala' => 'nullable|array',
            'sala.*' => 'required|integer',
            'magistrado' => 'nullable|array',
            'magistrado.*' => 'required|integer',
            'forma_resolucion' => 'nullable|array',
            'forma_resolucion.*' => 'required|integer',
            'tipo_jurisprudencia' => 'nullable|array',
            'tipo_jurisprudencia.*' => 'required|integer',
            'materia' => 'nullable|array',
            'materia.*' => 'required|integer',
            'tipo_resolucion' => 'nullable|array',
            'tipo_resolucion.*' => 'required|integer',
            'periodo' => 'nullable|array',
            'periodo.*' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = $request->input('term', '');
        $highlight = $request->input('highlight', ['sintesis']);

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        // $highlight = ['descriptor', 'ratio', 'restrictor'];
        // $highlight = ['descriptor'];
        $facetas = ['sala', 'departamento', 'tipo_resolucion', 'periodo'];

        $search = Resolution::search($query, function ($meilisearch, $query, $options) use ($highlight, $perPage, $offset, $facetas) {
            $options['attributesToHighlight'] = $highlight;
            $options['attributesToCrop'] = $highlight;
            $options['cropLength'] = 50;
            $options['highlightPreTag'] = '<b class="highlight">';
            $options['highlightPostTag'] = '</b>';
            $options['limit'] = $perPage;
            $options['offset'] = $offset;
            $options['attributesToSearchOn'] = $highlight;
            $options['attributesToRetrieve'] = [
                'id',
                'sala',
                'nro_expediente',
                'nro_resolucion',
                'magistrado',
                'tipo_resolucion',
                'forma_resolucion',
                'periodo',
                '_formatted',
            ];
            $options['facets'] = $facetas;

            return $meilisearch->search($query, $options);
        });
        if ($request->has('materia')) {
            $materia = $request->input('materia');
            $search->where('materia', $materia[0]);
        }

        if ($request->has('descriptor')) {
            $descriptor = $request->input('descriptor');
            $search->where('descriptor_id', $descriptor);
        }
        if ($request->has('periodo')) {
            $search->where('periodo', $request->periodo[0]);
        }

        if ($request->has('tipo_resolucion')) {
            $search->whereIn('tipo_resolucion', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $search->whereIn('sala', $request->sala);
        }
        if ($request->has('departamento')) {
            $search->whereIn('departamento', $request->departamento);
        }

        $search = $search->raw();

        // Solo los _formatted
        $formattedResults = collect($search['hits'])->map(function ($hit) {
            return $hit['_formatted'] ?? [];
        });

        $facets = $search['facetDistribution'] ?? [];

        $filtros = [];

        foreach ($facetas as $value) {
            if (!isset($facets[$value])) {
                continue;
            }

            $numericalKeys = array_map('intval', array_keys($facets[$value]));

            $filtered = array_filter($numericalKeys, function ($item) {
                return $item !== 0;
            });

            $filtros[$value] = array_values($filtered); // Reindexa
        }

        return response()->json([
            'data' => $formattedResults,
            'facets' => $filtros,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $search['estimatedTotalHits'] ?? 0,
            'last_page' => ceil(($search['estimatedTotalHits'] ?? 0) / $perPage),

        ]);

        return response()->json($resultados);

        $variable = $request['variable'];
        $orden = $request['orden'];

        $columnasPermitidas = ['nro_resolucion', 'fecha_emision', 'tipo_resolucion', 'departamento', 'sala'];
        $variable = in_array($variable, $columnasPermitidas) ? $variable : 'fecha_emision';
        $orden = in_array(strtolower($orden), ['asc', 'desc']) ? $orden : 'asc';

        $query = DB::table('resolutions as r')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('salas as s', 's.id', '=', 'r.sala_id')
            ->join('departamentos as d', 'd.id', '=', 'r.departamento_id')
            ->select('r.id', 'r.nro_resolucion', 'r.fecha_emision', 'tr.nombre as tipo_resolucion', 'd.nombre as departamento', 's.nombre as sala');

        if ($request->has('tipo_jurisprudencia') || $request->has('materia')) {
            $tipoJurisprudencia = $request->tipo_jurisprudencia;
            $materia = $request->materia;

            $subquery = DB::table('jurisprudencias')
                ->select('resolution_id');

            if ($request->has('tipo_jurisprudencia')) {
                $subquery->whereIn('tipo_jurisprudencia_id', $tipoJurisprudencia);
            }

            if ($request->has('materia')) {
                $subquery->whereIn('root_id', $materia);
            }

            $query->joinSub($subquery, 'j', function ($join) {
                $join->on('j.resolution_id', '=', 'r.id');
            });
        }

        if ($request->has('periodo')) {
            $query->whereYear('r.fecha_emision', $request->periodo);
        }

        if ($request->has('magistrado')) {
            $query->whereIn('r.magistrado_id', $request->magistrado);
        }
        if ($request->has('forma_resolucion')) {
            $query->whereIn('r.forma_resolucion_id', $request->forma_resolucion);
        }
        if ($request->has('tipo_resolucion')) {
            $query->whereIn('r.tipo_resolucion_id', $request->tipo_resolucion);
        }
        if ($request->has('sala')) {
            $query->whereIn('r.sala_id', $request->sala);
        }
        if ($request->has('departamento')) {
            $query->whereIn('r.departamento_id', $request->departamento);
        }

        $search = $request->input('term');
        $search = preg_replace('/\s+/', ' ', $search);
        $search = trim($search);
        $search = strtolower($search);
        $stopwords = NLP::getStopWords();

        if ($request->has('term') && in_array($search, $stopwords) === false) {

            $searchSanitized = addslashes($search);

            $query->join('contents as c', 'c.resolution_id', '=', 'r.id')
                ->addSelect(DB::raw("
                    resolution_id,
                    ts_headline('spanish', contenido, plainto_tsquery('spanish', '{$searchSanitized}')) as contexto
                "))->whereRaw('searchtext @@ plainto_tsquery(\'spanish\', ?)', [$search]);
        }

        $results = $query->orderBy($variable, $orden)->paginate(20);

        return response()->json($results);
    }

    public function getTerminosXYy(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'terminosX' => 'required|array',
            'terminosX.*' => 'required|string',
            'terminosY' => 'required|array',
            'terminosY.*' => 'required|string',
            'columnaX' => 'required|string',
            'tablaX' => 'required|string',
            'columnaY' => 'required|string',
            'tablaY' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $salasArray = $request['terminosX'];
        $tableArray = $request['terminosY'];
        $columnaX = $request['columnaX'];
        $columnaY = $request['columnaY'];
        $combinations = [];

        foreach ($salasArray as $sala) {
            foreach ($tableArray as $row) {
                $combinations[] = [
                    $columnaX => $sala,
                    $columnaY => $row,
                    'cantidad' => 0,
                ];
            }
        }

        // return response()->json($combinations);
        $datos = $this->generarConsulta([
            (object) [
                'nombre' => $request->columnaX,
                'tabla' => $request->tablaX,
                'ids' => $request->terminosX,
            ],
            (object) [
                'nombre' => $request->columnaY,
                'tabla' => $request->tablaY,
                'ids' => $request->terminosY,
            ],
        ]);

        $datoLookup = [];
        foreach ($datos as $dato) {
            $datoLookup[$dato->$columnaX][$dato->$columnaY] = $dato->cantidad;
        }

        foreach ($combinations as &$item) {
            $item['cantidad'] = $datoLookup[$item[$columnaX]][$item[$columnaY]] ?? 0;
        }

        return response()->json([

            'data' => Math::completarArray($combinations, $columnaX, $columnaY),
            'tabla' => $request->tablaX,
            'columna' => $request->columnaX,
            'nombre' => $request->columnaY,
            'terminos' => $request->terminosX,
            'multiVariable' => true,
        ]);
    }

    public function getTerminosXY(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'departamento' => 'nullable|array',
            'departamento.*' => 'required|string',
            'variable' => 'required|array',
            'variable.*' => 'required',
            'nombre' => 'required|string',
            'variableY' => 'required|array',
            'variableY.*' => 'required',
            'nombreY' => 'required|string',
            'periodo' => 'nullable|digits:4|integer|min:1900|max:' . (date('Y') + 1),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = strtolower($request->nombre);
        $nombreY = strtolower($request->nombreY);
        $campos = Listas::obtenerLista();

        if (!array_key_exists($nombre, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }
        if (!array_key_exists($nombreY, $campos)) {
            return response()->json([
                'No existe la variable solicitada',
            ], 422);
        }

        $filtroX = $campos[$nombre];
        $filtroY = $campos[$nombreY];
        unset($campos[$nombre]);
        unset($campos[$nombreY]);

        $lista = ['maxima', 'sintesis', 'restrictor', 'ratio', 'precedente', 'proceso', 'demandante', 'demandado'];

        if (!in_array($nombre, $lista) && !in_array($nombreY, $lista)) {
            return $this->obtenerEstadisticasXY($request);
        }

        if (!in_array($nombre, $lista) || !in_array($nombreY, $lista)) {
            return $this->obtenerXYSimple($request);
        }
        $terminos = NLP::cleanArray($request->variable);
        $terminosY = NLP::cleanArray($request->variableY);

        if (empty($terminos) || empty($terminosY)) {
            return response()->json([
                'mensaje' => 'Las variables escogidas no pueden ser stopwords',
            ], 422);
        }
        // return $combinations;

        $tabla = $filtroX['tabla'];
        $columna = $filtroX['nombre'];
        $tablaY = $filtroY['tabla'];
        $columnaY = $filtroY['nombre'];
        // Validación de seguridad para tabla y columna
        if (!preg_match('/^[a-z0-9_]+$/', $tabla) || !preg_match('/^[a-z0-9_]+$/', $columna)) {
            return response()->json(['error' => 'Parámetros inválidos'], 400);
        }

        if (!preg_match('/^[a-z0-9_]+$/', $tablaY) || !preg_match('/^[a-z0-9_]+$/', $columnaY)) {
            return response()->json(['error' => 'Parámetros inválidos'], 400);
        }

        $sqlX = implode(',', array_map(function ($t) {
            return "'" . addslashes(strtolower($t)) . "'";
        }, $terminos));

        $sqlY = implode(',', array_map(function ($t) {
            return "'" . addslashes(strtolower($t)) . "'";
        }, $terminosY));

        if ($filtroX['join'] && $filtroY['join']) {

            // ambas estan en jurisprudencia
            $query = DB::table(DB::raw("(SELECT unnest(ARRAY[$sqlX]) AS termino_x) AS tx"))
                ->crossJoin(DB::raw("(SELECT unnest(ARRAY[$sqlY]) AS termino_y) AS ty"))
                ->join(DB::raw("$tabla AS t"), function ($join) use ($columna, $columnaY) {
                    $join->whereRaw("LOWER(t.$columna) ~* ('\\m' || tx.termino_x || '\\M')")
                        ->whereRaw("LOWER(t.$columnaY) ~* ('\\m' || ty.termino_y || '\\M')");
                });
            $query->selectRaw('termino_x, termino_y as nombre, COUNT(Distinct(t.resolution_id)) as cantidad')
                ->groupBy('termino_x', 'termino_y');
            $data = $query->orderByDesc('cantidad')
                ->get();
            $total = array_sum($data->pluck('cantidad')->toArray());
        } elseif ($filtroX['join'] || $filtroY['join']) {

            // se necesita join jurisprudencias j on j.resolution_id = r.id
            if ($filtroX['tabla'] === 'jurisprudencias') {
                $t_columna = $filtroX['nombre'];
                $t_sqlX = $sqlX;
                $t_terminos = $terminos;
                $columna = $columnaY;
                $sqlX = $sqlY;
                $columnaY = $t_columna;
                $sqlY = $t_sqlX;
                $terminos = $terminosY;
                $terminosY = $t_terminos;
            }

            $sql = "
                SELECT t1.termino AS termino_x, t2.termino AS nombre, COUNT(*) AS cantidad
                FROM resolutions r
                CROSS JOIN (
                    SELECT unnest(ARRAY[$sqlX]) AS termino
                ) t1
                CROSS JOIN (
                    SELECT unnest(ARRAY[$sqlY]) AS termino
                ) t2
                JOIN jurisprudencias j ON j.resolution_id = r.id
                WHERE LOWER(r.$columna) ~* ('\\m' || t1.termino || '\\M')
                AND LOWER(j.$columnaY) ~* ('\\m' || t2.termino || '\\M')
                GROUP BY t1.termino, t2.termino
                ORDER BY cantidad DESC
            ";

            $data = DB::select($sql);
            $total = array_sum(array_column($data, 'cantidad'));
        } else {
            // ambas estan en resolutions
            $query = DB::table(DB::raw("(SELECT unnest(ARRAY[$sqlX]) AS termino_x) AS tx"))
                ->crossJoin(DB::raw("(SELECT unnest(ARRAY[$sqlY]) AS termino_y) AS ty"))
                ->join(DB::raw("$tabla AS t"), function ($join) use ($columna, $columnaY) {
                    $join->whereRaw("LOWER(t.$columna) ~* ('\\m' || tx.termino_x || '\\M')")
                        ->whereRaw("LOWER(t.$columnaY) ~* ('\\m' || ty.termino_y || '\\M')");
                });
            $query->selectRaw('termino_x, termino_y as nombre, COUNT(Distinct(t.id)) as cantidad')
                ->groupBy('termino_x', 'termino_y');
            $data = $query->orderByDesc('cantidad')
                ->get();
            $total = array_sum($data->pluck('cantidad')->toArray());
        }

        $arrayX = $terminos;
        $arrayY = $terminosY;

        $combinations = [];

        foreach ($arrayX as $sala) {
            foreach ($arrayY as $row) {
                $combinations[] = [
                    'termino_x' => $sala,
                    'nombre' => $row,
                    'cantidad' => 0,
                ];
            }
        }

        $datoLookup = [];
        foreach ($data as $dato) {
            $datoLookup[$dato->termino_x][$dato->nombre] = $dato->cantidad;
        }

        foreach ($combinations as &$dato) {
            $dato['cantidad'] = $datoLookup[$dato['termino_x']][$dato['nombre']] ?? 0;
        }
        $resultado = array_map(function ($tag) use ($filtroX, $filtroY) {
            return array(
                $filtroX['nombre'] => $tag['termino_x'],
                $filtroY['nombre'] => $tag['nombre'],
                'cantidad' => $tag['cantidad']
            );
        }, $combinations);

        return response()->json([
            'total' => $total,
            'data' => $resultado,
            'chart' => Math::completarArray($resultado, $filtroX['nombre'], $filtroY['nombre']),
            'multiVariable' => true,
        ]);
    }

    public function obtenerTerminos(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|in:maxima,sintesis,restrictor,ratio,precedente,proceso,demandante,demandado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $nombre = $request->input('nombre');

        $elemento = Listas::obtenerItem($nombre);
        if ($elemento == null) {
            return response()->json([
                'error' => 'No existe la variable solicitada',
            ], 422);
        }

        $query = TerminosClaveUnificado::select('nombre', 'cantidad')
            ->where('campo', $elemento['nombre'])
            ->whereRaw('LENGTH(nombre) > 2')
            ->orderByDesc('cantidad');

        $datos = $query->paginate(10);

        return response()->json($datos);
    }

    public function buscarTerminos(Request $request)
    {
        // Validación de parámetros
        $validator = Validator::make($request->all(), [
            'tabla' => 'required|string|in:jurisprudencias,resolutions',
            'columna' => 'required|string',
            'termino' => 'required|string',
            'pagina' => 'required|integer|min:1',  // Agregar validación de página
        ]);

        // Si la validación falla, retornar un error
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        $tableName = $request->input('tabla');
        $columnName = $request->input('columna');
        $termino = $request->input('termino');
        $pagina = $request->input('pagina', 1);

        $results = DB::table($tableName . ' as t')
            ->selectRaw('count(id) as cantidad')
            ->whereRaw("LOWER(t.$columnName) ~* ?", [mb_strtolower($termino, 'UTF-8')])
            ->pluck('cantidad');

        $total = array_sum($results->toArray());

        return response()->json([
            'total' => $total,
        ]);
    }

    public function generarConsulta($tablas)
    {
        // Base query
        $query = DB::table('resolutions as r')
            ->join('jurisprudencias as j', 'j.resolution_id', '=', 'r.id');

        $selects = ['COALESCE(COUNT(r.id), 0) AS cantidad'];
        $group_by = [];
        $having = [];

        foreach ($tablas as $tabla) {
            $tableName = $tabla->tabla;
            $values = $tabla->ids;
            $columnName = $tabla->nombre;

            if ($tableName && $values) {
                $lista = ['tipo_resolucion', 'departamento', 'sala', 'magistrado'];

                if (in_array($columnName, $lista)) {
                    $table = $columnName . 's';
                    $column = $columnName . '_id';

                    // Join with the related table
                    $query->join("$table as t_$columnName", "t_$columnName.id", '=', "r.$column");

                    // Add to select and group by
                    $selects[] = "t_$columnName.nombre AS $columnName";
                    $group_by[] = "t_$columnName.nombre";

                    // Add where condition for filtering by values
                    $query->whereIn("t_$columnName.nombre", $values);
                } else {
                    // Dynamically handle CASE statements based on the table
                    $caseConditions = array_map(function ($termino) use ($columnName, $tableName) {
                        $columnTable = $tableName === 'resolutions' ? 'r' : 'j';  // Check if the table is 'resolutions' or 'jurisprudencias'

                        return "WHEN $columnTable.$columnName ~* '^" . preg_quote($termino, '/') . "' THEN '$termino'";
                    }, $values);

                    // Join the conditions directly in the CASE statement
                    $caseStatement = implode("\n", $caseConditions);

                    // Add to select
                    $selects[] = "CASE $caseStatement END AS $columnName";

                    // In the group by, use the CASE expression itself instead of the column
                    $group_by[] = "CASE $caseStatement END";

                    // If no match exists, exclude it from the results
                    $having[] = "CASE $caseStatement END IS NOT NULL";
                }
            }
        }

        // Finalize the query with selects, group by, and having
        $query->selectRaw(implode(', ', $selects))
            ->groupByRaw(implode(', ', $group_by));

        if (count($having) > 0) {
            $query->havingRaw(implode(' AND ', $having));
        }

        $query->orderByDesc('cantidad');

        // Return the results
        return $query->get();
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

        // Paso 1: Filtrar filas que tienen todos los valores numéricos en 0 (excepto "nombre")
        $filteredRows = array_filter($resultado, function ($item) {
            foreach ($item as $key => $value) {
                if ($key !== 'nombre' && (int) $value !== 0) {
                    return true;
                }
            }

            return false;
        });

        // Paso 2: Detectar claves que son 0 en todos los ítems restantes
        $allKeys = array_keys(reset($filteredRows));
        $keysToRemove = [];

        foreach ($allKeys as $key) {
            if ($key === 'nombre') {
                continue;
            } // No evaluar 'nombre'

            $allZeros = true;
            foreach ($filteredRows as $row) {
                if ((int) $row[$key] !== 0) {
                    $allZeros = false;
                    break;
                }
            }

            if ($allZeros) {
                $keysToRemove[] = $key;
            }
        }

        // Paso 3: Eliminar esas claves de cada fila
        $finalData = array_map(function ($item) use ($keysToRemove) {
            foreach ($keysToRemove as $key) {
                unset($item[$key]);
            }

            return $item;
        }, $filteredRows);

        $finalData = array_values($finalData);

        return $finalData;
    }
}
