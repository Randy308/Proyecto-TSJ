<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\Descriptor;
use App\Models\Resolutions;
use App\Utils\NLP;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use NlpTools\Utils\StopWords;

class DescriptorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function test(Request $request)
    {

        $request->validate([
            'search' => 'required|string|max:100',
        ]);

        $search = $request->input('search');
        $search = preg_replace('/\s+/', ' ', $search); 
        $search = trim($search); 
        $search = strtolower($search); 
        $stopwords = NLP::getStopWords();
        if(in_array($search, $stopwords)) {
            return response()->json([
                'message' => 'La palabra no puede ser una palabra de parada',
            ], 404);
        }
       

        // return Contents::keyword($search)
        //     ->with(['resolution' => function ($query) {
        //         $query->select('id', 'nro_resolucion', 'nro_expediente');
        //     }])
        //     ->orderBy('created_at', 'desc')
        //     ->paginate(10);

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
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Descriptor $descriptor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Descriptor $descriptor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Descriptor $descriptor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Descriptor $descriptor)
    {
        //
    }
}
