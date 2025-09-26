<?php

namespace App\Jobs;

use App\Models\Estilo;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Mpdf\HTMLParserMode;
use Mpdf\Mpdf;


use Illuminate\Support\Facades\Storage;
use Mpdf\Output\Destination;
use App\Models\Notification;

class ProcessCronologia implements ShouldQueue
{
    use Queueable;

    protected int $tema_id;
    protected int $user_id;

    public function __construct($tema_id, $userId)
    {
        $this->tema_id = $tema_id;
        $this->user_id = $userId;
    }

    public function handle(): void
    {
        // Tu query y procesamiento
        $query = DB::table('jurisprudencias as j')
            ->join('resolutions as r', 'r.id', '=', 'j.resolution_id')
            ->join('contents as c', 'r.id', '=', 'c.resolution_id')
            ->join('forma_resolucions as fr', 'fr.id', '=', 'r.forma_resolucion_id')
            ->join('tipo_resolucions as tr', 'tr.id', '=', 'r.tipo_resolucion_id')
            ->join('tipo_jurisprudencias as tj', 'tj.id', '=', 'j.tipo_jurisprudencia_id')
            ->select('j.resolution_id', 'j.ratio', 'j.descriptor', 'j.restrictor', 'tj.nombre as tipo_jurisprudencia', 'r.nro_resolucion', 'tr.nombre as tipo_resolucion', 'r.proceso', 'fr.nombre as forma_resolucion')
            ->where('j.root_id', $this->tema_id)
            ->orderBy('j.descriptor');

        //$query->limit(100); // Limitar a 1000 resultados para evitar sobrecarga
        $results = $query->get();

        if ($results->isEmpty()) {
            // Manejo de error, opcionalmente puedes loguear
            return;
        }

        // Preparar datos
        $current = [];
        foreach ($results as $element) {
            $pieces = explode(' / ', $element->descriptor);
            $pieces[] = $element->restrictor;
            $indices = [];

            if (!empty($current)) {
                $newPieces = [];
                foreach ($pieces as $key => $piece) {
                    if (!isset($current[$piece])) {
                        $current[$piece] = true;
                        $indices[] = $key;
                        $newPieces[] = $piece;
                    }
                }
                $element->descriptor = array_values($newPieces);
            } else {
                $current = array_fill_keys($pieces, true);
                $indices = array_keys($pieces);
                $element->descriptor = $pieces;
            }
            $element->indices = $indices;
        }

        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $estilos = Estilo::where('tipo', 'Default')->get();
        $referencias = [];

        $pdf = new Mpdf([
            'format' => 'letter',
            'margin_left' => 25,
            'margin_right' => 25,
            'margin_top' => 25,
            'margin_bottom' => 25,
            'orientation' => 'P',
            'title' => 'Documento',
            'author' => 'IIJP',
            'fontDir' => public_path('fonts/'),
            'fontdata' => [
                'cambria' => ['R' => 'Cambriax.ttf', 'B' => 'Cambria-Bold.ttf', 'I' => 'Cambria-Italic.ttf', 'BI' => 'Cambria-Bold-Italic.ttf'],
                'trebuchet_ms' => ['R' => 'trebuc.ttf', 'B' => 'trebucbd.ttf', 'I' => 'trebucit.ttf'],
                'script_mt' => ['R' => 'script-mt.ttf'],
                'times_new_roman' => ['R' => 'times-new-roman.ttf', 'B' => 'times-new-roman-bold.ttf', 'I' => 'times-new-roman-italic.ttf', 'BI' => 'times-new-roman-bold-italic.ttf'],
            ],
        ]);

        // Cabecera
        $header = view('header', ['estilos' => $estilos])->render();
        $pdf->WriteHTML($header, HTMLParserMode::HEADER_CSS);

        // Portada
        $cover = view('cover', ['subtitulo' => '', 'fechaActual' => $fechaActual])->render();
        $pdf->WriteHTML($cover, HTMLParserMode::HTML_BODY);

        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2>Tabla de Contenido</h2>',
        ]);

        ini_set('max_execution_time', '300');
        foreach (array_chunk($results->toArray(), 50) as $chunk) {
            $body = view('contents', ['results' => $chunk])->render();
            $pdf->WriteHTML($body, HTMLParserMode::HTML_BODY);
        }

        // Footer
        $footer = view('footer', ['referencias' => $referencias])->render();
        $pdf->WriteHTML($footer, HTMLParserMode::HTML_BODY);

        // Guardar en storage
        $fileName = 'pdfs/cronologia_' . $this->tema_id . '_' . time() . '.pdf';
        Storage::disk('public')->put($fileName, $pdf->Output('', Destination::STRING_RETURN));


        // Notificación
        Notification::create([
            'user_id' => $this->user_id,
            'mensaje' => 'El documento ha sido generado exitosamente.',
            'enlace' => url(Storage::url($fileName)),
            'tipo' => 'documento',
        ]);
    }
}
