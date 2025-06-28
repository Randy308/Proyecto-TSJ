<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamentos;
use App\Models\Jurisprudencias;
use App\Models\Resolutions;
use App\Utils\NLP;
use Carbon\Carbon;
use Illuminate\Http\Request;
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


        $query = $request->input('search', '');

        $highlight[] = $request->input('highlight', 'contenido');

        // Parámetros de paginación
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);
        $offset = ($page - 1) * $perPage;
        $strategy = $request->input('strategy', 'last');

        if($strategy != 'all' || $strategy != 'last') {
            $strategy = 'last';
        }
        $search = Resolutions::search($query, function ($meilisearch, $query, $options) use ($highlight, $perPage, $offset, $strategy) {
            $options['attributesToHighlight'] = $highlight;
            $options['attributesToCrop'] = $highlight;
            $options['cropLength'] = 100;
            $options['highlightPreTag'] = '<b class="highlight">';
            $options['highlightPostTag'] = '</b>';
            $options['matchingStrategy'] = $strategy;

            $options['attributesToSearchOn'] = $highlight;
            $options['limit'] = $perPage;
            $options['offset'] = $offset;
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

            return $meilisearch->search($query, $options);
        })->raw();

        // Solo los _formatted
        $formattedResults = collect($search['hits'])->map(function ($hit) {
            return $hit['_formatted'] ?? [];
        });

        return response()->json([
            'data' => $formattedResults,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $search['estimatedTotalHits'] ?? 0,
                'last_page' => ceil(($search['estimatedTotalHits'] ?? 0) / $perPage),
            ]
        ]);


        $request->validate([
            'search' => 'required|string|max:100',
        ]);

        $query = $request->input('search');
        $query = preg_replace('/\s+/', ' ', $query);
        $query = trim($query);
        $query = strtolower($query);
        $stopwords = NLP::getStopWords();
        if (in_array($query, $stopwords)) {
            return response()->json([
                'message' => 'La palabra no puede ser una palabra de parada',
            ], 404);
        }

        $results = Resolutions::search($request->search)->where('sala_id', '1')->raw();

        return response()->json($results);

        $search = $request->input('search');
        $search = preg_replace('/\s+/', ' ', $search);
        $search = trim($search);
        $search = strtolower($search);
        $stopwords = NLP::getStopWords();
        if (in_array($search, $stopwords)) {
            return response()->json([
                'message' => 'La palabra no puede ser una palabra de parada',
            ], 404);
        }

        $query = Resolutions::whereHas('content', function ($query) use ($search) {
            $query->whereRaw('searchtext @@ plainto_tsquery(\'spanish\', ?)', [$search]);
        })
            ->with(['content' => function ($query) use ($search) {
                $query->selectRaw(
                    "resolution_id, ts_headline('spanish', contenido, plainto_tsquery('spanish', ?)) as contexto",
                    [$search]
                );
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(10)->toArray();

        return response()->json($query, 200);
    }
}
