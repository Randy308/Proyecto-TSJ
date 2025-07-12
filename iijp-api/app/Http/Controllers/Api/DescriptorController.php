<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FacetsResource;
use App\Models\Departamentos;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Utils\Busqueda;
use App\Utils\NLP;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;

class DescriptorController extends Controller
{


    public function fixDepartamentos(Request $request)
    {
        $query = $request->input('search', '');

        $departamentos = Departamentos::all()->pluck('id', 'nombre')->toArray();

        //return response()->json($departamentos, 200);
        //$statement = "select * from obtener_departamentos_vacios(100);";
        $statement = "select * from obtener_fechas_limite(100);";


        $querys = DB::select($statement);
        $data = [];

        foreach ($querys as $query) {
            $resolution = Resolutions::find($query->r_id);

            $departamento = ucwords(strtolower($query->departamento));
            if ($departamento === 'Potosi' || $departamento === 'PotosÍ') {
                $departamento = 'Potosí'; // Normalizar el nombre de Potosí
            }
            if ($resolution && isset($departamentos[$departamento])) {
                $resolution->departamento_id = $departamentos[$departamento];
                $resolution->save();
            }
            $query->new_departamento = $departamento; // Normalizar el nombre del departamento

        }
        return response()->json($querys, 200);
    }

    public function fixResoluciones(Request $request)
    {
        $statement = "select * from obtener_fechas_limite(10);";

        $months = [
            'enero' => 'January',
            'febrero' => 'February',
            'marzo' => 'March',
            'abril' => 'April',
            'mayo' => 'May',
            'junio' => 'June',
            'julio' => 'July',
            'agosto' => 'August',
            'septiembre' => 'September',
            'octubre' => 'October',
            'noviembre' => 'November',
            'diciembre' => 'December',
        ];
        $querys = DB::select($statement);
        //$data = [];
        foreach ($querys as $query) {
            if (!empty($query->fecha)) {
                $dateString = preg_replace('/[{}"]/', '', strtolower($query->fecha));
                $dateString = strtr($dateString, $months); // traducir mes
                $carbonDate = Carbon::createFromFormat('d \d\e F \d\e Y', $dateString);

                $resolution = Resolutions::find($query->r_id);
                if ($resolution) {
                    $resolution->fecha_emision = $carbonDate->format('Y-m-d');
                }
                //$data[] = $resolution;
                $resolution->save();
            }
        }

        return response()->json(['message' => 'Fechas actualizadas correctamente'], 200);
    }
    public function test(Request $request)
    {

        $strategy = $request->input('strategy', false);
        $query = $request->input('search', '');
        $highlight = 'ratio'; // o lo que necesites
        $strategy = 'all'; // o 'last'
        $perPage = $request->input('per_page', 10);
        $offset = $request->input('offset', 0);



        $highlightArray = [
            'ratio',
        ];

        $extraFields = [
            'id',
            'sala',
            'nro_expediente',
            'nro_resolucion',
            'magistrado',
            'tipo_resolucion',
            'forma_resolucion',
            'periodo',
            "_highlight",
        ];

        // unir ambos arrays sin duplicados
        $allFields = array_unique(array_merge($highlightArray, $extraFields));


        $options = [

            'query_by' => $highlight,
            'highlight_full_fields' => $highlight, // más preciso que attributesToHighlight
            'highlight_start_tag' => '<b class="highlight">',
            'highlight_end_tag' => '</b>',
            'highlight_affix_num_tokens' => 9,
            'snippet_threshold' => 100,
            'matching_strategy' => $strategy,
            'facet_by' => 'materia,periodo,sala,departamento,tipo_jurisprudencia',
            'limit' => $perPage,
            'offset' => $offset,
            'include_fields' => implode(',', $allFields),
        ];



        $result = Jurisprudencias::search($query)->options($options);

        $result->whereIn('materia', ['19', '321']); // Filtrar por sala, si es necesario
        $result = $result->raw();
        $hits = Busqueda::generarResultado($result);

        $facetas = $result['facet_counts'] ?? [];

        $facets = Busqueda::obtenerFacetas($facetas);


        return response()->json([
            'message' => 'Búsqueda exitosa',
            'query' => $query,
            'facets' => $facets,
            'results' => $hits ?? [],
            'total' => $result['found'] ?? 0,
        ], 200);
    }
}
