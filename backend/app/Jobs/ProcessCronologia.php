<?php

namespace App\Jobs;

use App\Models\Descriptor;
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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProcessCronologia implements ShouldQueue
{
    use Queueable;

    protected int $tema_id;
    protected int $subtema_id;
    protected int $user_id;

    public function __construct($tema_id, $subtema_id, $userId)
    {
        $this->tema_id = $tema_id;
        $this->subtema_id = $subtema_id;
        $this->user_id = $userId;
    }

    function getInitials(string $inputString): string
    {
        $words = explode(' ', $inputString);
        $initials = '';
        foreach ($words as $word) {
            if (!empty($word)) { // Ensure the word is not empty (e.g., from multiple spaces)
                $initials .= mb_substr($word, 0, 3, 'UTF-8'); // Use mb_substr for multi-byte support
            }
        }
        return $initials;
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
            ->select('j.resolution_id', 'j.descriptor', 'j.descriptor_id', 'j.ratio', 'j.restrictor', 'tj.nombre as tipo_jurisprudencia', 'r.nro_resolucion', 'tr.nombre as tipo_resolucion', 'r.proceso', 'fr.nombre as forma_resolucion')

            ->orderBy('j.descriptor')->orderBy('j.restrictor');

        if ($this->subtema_id > 0) {
            $query->where('j.sub_tema', $this->subtema_id);
        } else {
            $query->where('j.root_id', $this->tema_id);
        }
        //$query->limit(100); // Limitar a 1000 resultados para evitar sobrecarga
        $results = $query->get();

        if ($results->isEmpty()) {
            // Manejo de error, opcionalmente puedes loguear
            return;
        }

        // Preparar datos
        $current = [];
        $current_restrictor = null;

        foreach ($results as $element) {
            $pieces = explode(' / ', $element->descriptor);
            //$pieces[] =  $element->restrictor;
            $temp_restrictor = $element->restrictor;

            // Evita repetir restrictor
            if ($current_restrictor === $temp_restrictor) {
                $element->restrictor = "";
            }
            $current_restrictor = $temp_restrictor;

            $indices = [];

            if (!empty($current)) {
                $newPieces = [];
                $parentPath = "";

                foreach ($pieces as $key => $piece) {
                    // Generar path único
                    $path = $parentPath . "/" . $this->getInitials($piece);

                    // Solo si el path no existe aún, se guarda
                    if (!isset($current[$path])) {
                        $current[$path] = true; // ahora guardamos como set
                        $indices[] = $key;
                        $newPieces[] = $piece;
                    }

                    $parentPath = $path;
                }

                $element->descriptor = array_values($newPieces);
            } else {
                // Primer elemento
                $parentPath = "";
                foreach ($pieces as $key => $piece) {
                    $path = $parentPath . "/" . $this->getInitials($piece);
                    $current[$path] = true;
                    $parentPath = $path;
                }

                $indices = array_keys($pieces);
                $element->descriptor = $pieces;
            }

            $element->indices = $indices;
        }

        $fechaActual = Carbon::now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');
        $estilos = Estilo::where('tipo', 'Default')->get();
        $referencias = [];

        $pdf = new Mpdf([
            'tempDir' => storage_path('app/mpdf'),
            'format' => 'letter',
            'margin_left' => 25,
            'margin_right' => 25,
            'margin_top' => 25,
            'margin_bottom' => 25,
            'margin_header' => 10,
            'margin_footer' => 10,
            'orientation' => 'P',
            'title' => 'Documento',
            'author' => 'IIJP',
            'fontDir' => public_path('fonts/'),
            'fontdata' => [
                'cambria' => [
                    'R' => 'Cambriax.ttf',
                    'B' => 'Cambria-Bold.ttf',
                    'I' => 'Cambria-Italic.ttf',
                    'BI' => 'Cambria-Bold-Italic.ttf',
                ],
                'Arno_Pro' => [
                    'R' => 'ArnoPro-Regular.ttf',
                ],
                'bodoni_antiqua' => [
                    'R' => 'Bodoni-Antiqua.ttf',
                ],
                'chaparral' => [
                    'R' => 'Chaparral.ttf',
                ],
                'garamond' => [
                    'R' => 'Garamond.ttf',
                    'I' => 'Garamond-Italic.ttf',
                ],
                'myriad' => [
                    'R' => 'Myriad.ttf',
                ],
                'bauer' => [
                    'R' => 'bauer.ttf',
                ],
                'script_mt' => [
                    'R' => 'script-mt.ttf',
                ],
                'trebuchet_ms' => [
                    'R' => 'trebuc.ttf',
                    'B' => 'trebucbd.ttf',
                    'I' => 'trebucit.ttf',
                ],
                'times_new_roman' => [
                    'R' => 'times-new-roman.ttf',
                    'B' => 'times-new-roman-bold.ttf',
                    'I' => 'times-new-roman-italic.ttf',
                    'BI' => 'times-new-roman-bold-italic.ttf',
                ],
            ],
        ]);

        // Cabecera
        $header = view('style', ['estilos' => $estilos])->render();
        $pdf->WriteHTML($header, HTMLParserMode::HEADER_CSS);


        $tema = Descriptor::find($this->tema_id);

        if ($this->subtema_id > 0) {
            $subtema = Descriptor::find($this->subtema_id);
            $tema->nombre = $subtema->nombre;
        }
        // Portada
        $cover = view('cover', ['titulo' => $tema->nombre, 'subtitulo' => '', 'fechaActual' => $fechaActual])->render();
        $pdf->WriteHTML($cover, HTMLParserMode::HTML_BODY);

        //ini_set('max_execution_time', '500');

        $pdf->SetHTMLFooter('<table style="width:168mm;border: none; border-collapse: collapse; margin-left: -1.5mm;">
        <tr>
            <td style="width: 8mm;" align="center">1</td>
            <td style="width: 8mm;" align="center">2</td>
            <td style="width: 8mm;" align="center">3</td>
            <td style="width: 8mm;" align="center">4</td>
            <td style="width: 8mm;" align="center">5</td>
            <td style="width: 8mm;" align="center">6</td>
            <td style="width: 8mm;" align="center">7</td>
            <td style="width: 112mm;" align="right"></td>
        </tr>
        <tr>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="right" class="footer-pagination">{PAGENO}</td>
        </tr>
    </table>
');


        $pdf->SetHTMLHeader('<table style="width:168mm;border: none; border-collapse: collapse; margin-left: -1.5mm;">
        <tr>
            <td style="width: 8mm;" align="center">1</td>
            <td style="width: 8mm;" align="center">2</td>
            <td style="width: 8mm;" align="center">3</td>
            <td style="width: 8mm;" align="center">4</td>
            <td style="width: 8mm;" align="center">5</td>
            <td style="width: 8mm;" align="center">6</td>
            <td style="width: 8mm;" align="center">7</td>
            <td style="width: 112mm;" align="right">IIJP</td>
        </tr>
        <tr>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
            <td align="center">|</td>
        </tr>
    </table>
    ');



        foreach (array_chunk($results->toArray(), 50) as $chunk) {
            $body = view('contents', ['results' => $chunk])->render();
            $pdf->WriteHTML($body, HTMLParserMode::HTML_BODY);
            usleep(50000);
        }

        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Tabla de Contenido</h2>',
            'toc-bookmarkText' => 'Tabla de contenido',
            'toc-suppress' => 'on',
            'toc-resetpagenum' => 1,
            'toc-odd-header-value' => "off", // This is the key setting
            'toc-odd-footer-value' => "off", // You can keep the footer if needed
            'resetpagenum' => 1,
            'name' => "descriptor",
        ]);

        $pdf->TOCpagebreakByArray([
            'links' => true,
            'toc-preHTML' => '<h2 class="titulo-tabla">Tabla de contenido detallado</h2>',
            'toc-bookmarkText' => 'Tabla de contenido detallado',
            'toc-show-pagenumbers' => true,
            'toc-resetpagenum' => 0,
            'name' => 'restrictor', // 🔸 Solo entradas con este toc-id
        ]);

        // $pdf->TOCpagebreakByArray([
        //     'toc-preHTML' => '<h2 class="titulo-tabla">Indice de autos supremos,resoluciones y
        // sentencias constitucionales</h2>',
        //     'toc-bookmarkText' => 'Indice de autos supremos',
        //     'toc-show-pagenumbers' => true,
        //     'toc-resetpagenum' => 0,
        //     'name' => 'autos', // 🔸 Solo entradas con este toc-id
        // ]);

        $slug = Str::slug($tema->nombre);
        $fileName = "pdfs/cronologia_{$slug}.pdf";
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
