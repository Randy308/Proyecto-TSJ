<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Documento</title>
    <style>
        @page {
            header: page-header;
            footer: page-footer;
        }

        .titulo {
            font-weight: bold;
        }

        .footer-pagination {
            color: gray;
            display: flex;
            justify-content: end;
            align-items: center;
        }

        img {
            height: 90px;
            width: 90px;
        }


        /* Nivel 0 */
        div.mpdf_toc_level_0 {
            /* Línea completa nivel 0 */
            line-height: 1.5;
            margin-left: 0;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_0 {
            /* Título nivel 0 */
            font-weight: bold;
        }

        span.mpdf_toc_p_level_0 {
            /* Número de página nivel 0 */
        }


        /* Nivel 1 */
        div.mpdf_toc_level_1 {
            /* Línea completa nivel 1 */
            margin-left: 2em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_1 {
            /* Título nivel 1 */
            font-style: italic;
            font-weight: bold;
        }

        span.mpdf_toc_p_level_1 {
            /* Número de página nivel 1 */
        }


        /* Nivel 2 */
        div.mpdf_toc_level_2 {
            /* Línea completa nivel 2 */
            margin-left: 4em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_2 {
            /* Título nivel 2 */
            font-style: italic;
        }

        span.mpdf_toc_p_level_2 {
            /* Número de página nivel 2 */
        }


        /* Nivel 3 */
        div.mpdf_toc_level_3 {
            /* Línea completa nivel 3 */
            margin-left: 6em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_3 {
            /* Título nivel 3 */
            font-style: italic;
            color: #555;
        }

        span.mpdf_toc_p_level_3 {
            /* Número de página nivel 3 */
        }


        /* Nivel 4 */
        div.mpdf_toc_level_4 {
            /* Línea completa nivel 4 */
            margin-left: 8em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_4 {
            /* Título nivel 4 */
            font-style: italic;
            color: #4c4c4c;
            font-weight: lighter;
        }

        span.mpdf_toc_p_level_4 {
            /* Número de página nivel 4 */
        }


        /* Nivel 5 */
        div.mpdf_toc_level_5 {
            /* Línea completa nivel 5 */
            margin-left: 10em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_5 {
            /* Título nivel 5 */
            font-style: italic;
            color: #666666;
            /* Color aún más claro */
            font-weight: lighter;
        }

        span.mpdf_toc_p_level_5 {
            /* Número de página nivel 5 */
        }


        /* Nivel 6 */
        div.mpdf_toc_level_6 {
            /* Línea completa nivel 6 */
            margin-left: 12em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_6 {
            /* Título nivel 6 */
            font-style: italic;
            color: #7f7f7f;
            /* Color muy claro */
            font-weight: lighter;
            font-size: 0.9em;
            /* Tamaño más pequeño */
        }

        span.mpdf_toc_p_level_6 {
            /* Número de página nivel 6 */
        }


        .titulo-portada {
            font-family: 'cambria', sans-serif;
        }
    </style>

</head>

<body>
    <htmlpageheader name="page-header">
        <div style="text-align: center; color: #999;">IIJP</div>
    </htmlpageheader>

    <table style="width: 100%; text-align: center; border-collapse: collapse;">
        <tr>
            <td style="width: 15%;">
                <img src="{{ public_path('/images/facultad.jpeg') }}" alt="Image"
                    style="max-width: 100px; height: auto;" />
            </td>
            <td style="width: 70%; padding: 10px;">
                <div>Observatorio del derecho y la política boliviana</div>
                <div>Serie Cronologías jurídicas y políticas</div>
            </td>
            <td style="width: 15%;">
                <img src="{{ public_path('/images/iijp.png') }}" alt="Image"
                    style="max-width: 100px; height: auto;" />
            </td>
        </tr>
    </table>

    <div style="background-color: #A40020; text-align: center; margin-top: 20%; color: white;">
        <p style="font-size: 24pt;" class="titulo-portada">CRONOLOGIAS JURÍDICAS</p>
    </div>


    @if (isset($fechaActual))
        <div style="margin-top: 20%;margin-left: 10%;" class="titulo-portada">
            <p style="font-size: 12pt;"><span style="font-weight: bold;">Fecha de publicación:</span>{{ $fechaActual }}
            </p>
        </div>
    @endif
    <pagebreak even-footer-value="-1" resetpagenum="1" />

    <tocpagebreak toc-entries="off" links="1" toc-preHTML="Tabla de Contenido" />




    @foreach ($results as $item)
        <div>
            <div>



                @if ($item->nro_resolucion)
                    <p class="tipo-jurisprudencia" style="text-align: center;">

                        <tocentry content=" {{ $item->nro_resolucion }}" level="0" />
                       <b>  {{ $item->nro_resolucion }}</b>
                    </p>
                @endif

            </div>

            <div>
                <p class="descriptor"><b>Descriptor: </b>{{ $item->descriptor }}</p>
                <p class="restrictor"><b>Restrictor: </b>{{ $item->restrictor }}</p>
            </div>
            <div class="contenido">
                <p class="resolution">
                    <b> Nro Resolución:</b>
                    <a href="https://jurisprudencia.tsj.bo/resoluciones/{{ $item->original }}/pdf/">
                        {{ $item->nro_resolucion }}
                    </a>
                </p>


                @if ($item->tipo_resolucion)
                    <p class="tipo-jurisprudencia">
                       <b>  Tipo de Resolución:</b>
                        {{ str_replace('_x000D_', "\n", $item->tipo_resolucion) }}
                    </p>
                @endif

                @if ($item->fecha_emision)
                    <p class="tipo-jurisprudencia">
                       <b>  fecha de Emision:</b>
                        {{ str_replace('_x000D_', "\n", $item->fecha_emision) }}
                    </p>
                @endif


                @if ($item->departamento)
                    <p class="tipo-jurisprudencia">
                       <b> Departamento:</b>
                        {{ str_replace('_x000D_', "\n", $item->departamento) }}
                    </p>
                @endif



                @if ($item->sala)
                    <p class="tipo-jurisprudencia">
                       <b>  Sala:</b>
                        {{ str_replace('_x000D_', "\n", $item->sala) }}
                    </p>
                @endif

                @if ($item->tipo_jurisprudencia)
                    <p class="tipo-jurisprudencia">
                       <b>  Tipo de jurisprudencia:</b>
                        {{ str_replace('_x000D_', "\n", $item->tipo_jurisprudencia) }}
                    </p>
                @endif

                @if ($item->forma_resolucion)
                    <p class="forma-resolucion">
                       <b>  Forma de Resolución:</b> {{ str_replace('_x000D_', "\n", $item->forma_resolucion) }}
                    </p>
                @endif

                @if ($item->proceso)
                    <p class="proceso">
                       <b>  Proceso:</b> {{ str_replace('_x000D_', "\n", $item->proceso) }}
                    </p>
                @endif

                @if ($item->ratio)
                    <p class="ratio">
                        <b> Ratio: </b>{!! preg_replace('/\b(competencia|jurisdicción)\b/i', '<b>$1</b>', nl2br(e(str_replace('_x000D_', "\n", $item->ratio)))) !!}

                    </p>
                @endif

                @if (isset($item->resumen))
                    <p class="resultado"><b> Resumen:</b> {{ str_replace(["\r\n\r\n", '_x000D_'], '', $item->resumen) }}
                    </p>
                @endif


                @if (isset($item->resultado))
                    <p class="resultado"><b> Por tanto:</b> {{ str_replace(["\r\n\r\n", '_x000D_'], '', $item->resultado) }}
                    </p>
                @endif


            </div>
        </div>
    @endforeach

    <htmlpagefooter name="page-footer">
        <div style="color: gray; text-align: right;">{PAGENO}</div>
    </htmlpagefooter>

</body>

</html>
