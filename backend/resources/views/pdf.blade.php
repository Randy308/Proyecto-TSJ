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

        /* Nivel 6 */
        div.mpdf_toc_level_7 {
            /* Línea completa nivel 6 */
            margin-left: 13em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_7 {
            /* Título nivel 6 */
            font-style: italic;
            color: #7f7f7f;
            /* Color muy claro */
            font-weight: lighter;
            font-size: 0.9em;
            /* Tamaño más pequeño */
        }

        span.mpdf_toc_p_level_7 {
            /* Número de página nivel 6 */
        }

        /* Nivel 6 */
        div.mpdf_toc_level_8 {
            /* Línea completa nivel 6 */
            margin-left: 14em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_8 {
            /* Título nivel 6 */
            font-style: italic;
            color: #7f7f7f;
            /* Color muy claro */
            font-weight: lighter;
            font-size: 0.9em;
            /* Tamaño más pequeño */
        }

        span.mpdf_toc_p_level_8 {
            /* Número de página nivel 6 */
        }

        /* Nivel 6 */
        div.mpdf_toc_level_9 {
            /* Línea completa nivel 6 */
            margin-left: 15em;
            text-indent: -2em;
            padding-right: 0em;
        }

        span.mpdf_toc_t_level_9 {
            /* Título nivel 6 */
            font-style: italic;
            color: #7f7f7f;
            /* Color muy claro */
            font-weight: lighter;
            font-size: 0.9em;
            /* Tamaño más pequeño */
        }

        span.mpdf_toc_p_level_9 {
            /* Número de página nivel 6 */
        }

        .titulo-portada {
            font-family: 'bauer', sans-serif;
            text-align: right;
            padding: 0 10%;
        }

        .titulo-referencias {
            font-family: 'cambria', sans-serif;
            font-style: italic;
            text-align: center;
            padding: 0 10%;
        }


        table.header-table td {
            width: 25px;
            text-align: center;
            background-color: red;
        }

        .restrictor {
            font-size: 12pt;
            text-align: left;
            font-weight: normal;
            margin-left: 34mm;
            margin-top: 6px;
            margin-bottom: 3px;
            font-family: 'arno', sans-serif;
        }

        .descriptor0 {
            font-size: 26pt;
            font-weight: normal;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 10px;
            font-family: 'bodoni_antiqua', sans-serif;
        }

        .descriptor1 {
            font-size: 20pt;
            font-weight: normal;
            text-align: center;
            margin-top: 18px;
            margin-bottom: 9px;
            font-family: 'bodoni_antiqua', sans-serif;
        }

        .descriptor2 {
            font-size: 15pt;
            font-weight: bold;
            margin-left: 2mm;
            text-align: left;
            margin-top: 16px;
            margin-bottom: 8px;
            font-family: 'myriad', sans-serif;
        }

        .descriptor3 {
            font-size: 14pt;
            font-weight: bold;
            text-align: left;
            margin-left: 10mm;
            margin-top: 14px;
            margin-bottom: 7px;
            font-family: 'garamond', sans-serif;
        }

        .descriptor4 {
            font-size: 14pt;
            font-style: italic;
            font-weight: lighter;
            text-align: left;
            margin-left: 18mm;
            margin-top: 12px;
            margin-bottom: 6px;
            font-family: 'garamond', sans-serif;
        }

        .descriptor5 {
            font-size: 13pt;
            text-align: left;
            font-weight: normal;
            margin-left: 26mm;
            margin-top: 10px;
            margin-bottom: 5px;
            font-family: 'chaparal', sans-serif;
        }

        .descriptor6 {
            font-size: 13pt;
            text-align: left;
            font-weight: normal;
            margin-left: 34mm;
            margin-top: 8px;
            margin-bottom: 4px;
            font-family: 'myriad', sans-serif;
        }

        .descriptor7 {
            font-size: 13pt;
            text-align: left;
            font-weight: normal;
            margin-left: 42mm;
            margin-top: 6px;
            margin-bottom: 3px;
            font-family: 'arno', sans-serif;
        }

        .descriptor8 {
            font-size: 13pt;
            text-align: left;
            font-weight: normal;
            margin-left: 50mm;
            margin-top: 6px;
            margin-bottom: 3px;
            font-family: 'myriad', sans-serif;
        }

        .contenido {
            text-align: justify;
            font-weight: normal;
            font-family: 'arno', sans-serif;
            font-size: 12pt;
            margin-bottom: 10px;
            margin-left: 42mm;
        }
    </style>

</head>

<!-- 
        @foreach ($estilos as $elemento)
            .{{ $elemento['nombre'] }} {
                font-family: '{{ $elemento['fontFamily'] }}', sans-serif;
                font-weight: {{ $elemento['fontWeight'] }};
                font-size: {{ $elemento['fontSize'] }};
                margin-left: {{ $elemento['marginLeft'] === 'auto' ? 'auto' : $elemento['marginLeft'] . 'mm' }};
                padding-bottom: {{ $elemento['paddingBottom'] }}px;
                margin-top: {{ $elemento['marginTop'] }}px;
                text-align: {{ $elemento['textAlign'] }};
                font-style: {{ $elemento['fontStyle'] }};
                text-decoration: {{ $elemento['textDecoration'] }};
                color: {{ $elemento['color'] }};
            }
        @endforeach -->

<body>
    <htmlpageheader name="page-header">
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 17mm; width: 10mm; height: 10mm;">
            1
        </div>
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 25mm; width: 10mm; height: 10mm;">
            2
        </div>
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 33mm; width: 10mm; height: 10mm;">
            3
        </div>
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 41mm; width: 10mm; height: 10mm;">
            4
        </div>
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 49mm; width: 10mm; height: 10mm;">
            5

        </div>
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 57mm; width: 10mm; height: 10mm;">
            6
        </div>
        <div style="position: absolute; top: 10mm; left: 9.5mm;margin-left: 65mm; width: 10mm; height: 10mm;">
            7
        </div>

        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 17mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 25mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 33mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 41mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 49mm; width: 10mm; height: 10mm;">
            |

        </div>
        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 57mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; top: 15mm; left: 10mm;margin-left: 65mm; width: 10mm; height: 10mm;">
            |
        </div>

        <div style="position: absolute; top: 15mm; right: 10mm; width: 10mm; height: 10mm;">
            IIJP
        </div>
    </htmlpageheader>


    <table style="width: 100%; text-align: center; border-collapse: collapse;">
        <tr>
            <td style="width: 10%;">
                <img src="{{ public_path('/images/facultad.jpeg') }}" alt="Image"
                    style="max-width: 100px; height: auto;" />
            </td>

            <td style="width: 80%; padding: 10px;">
                <div
                    style="font-size: 17pt;   font-family: 'script_mt', sans-serif;">
                    Observatorio del derecho y la política boliviana
                </div>
                <div
                    style="font-size: 17pt;   font-family: 'script_mt', sans-serif;">
                    Serie Cronologías jurídicas y políticas
                </div>
            </td>


            <td style="width: 10%;">
                <img src="{{ public_path('/images/iijp.png') }}" alt="Image"
                    style="max-width: 100px; height: auto;" />
            </td>
        </tr>
    </table>

    <div style="padding: 100px;"></div>

    <div style="position: absolute;right: 0;top: 200px; background: #A40020;background-color: #A40020; text-align: center;padding-top:20px; padding-bottom: 20px; color: white;">
        <p style="font-size: 26pt;" class="titulo-portada">SERIE DE CRONOJURÍDICAS</p>

        @if (isset($subtitulo))
        <p style="font-size: 20pt;" class="titulo-portada">{{ $subtitulo }}</p>
        @endif


    </div>

    <div style="margin-top: 5%; margin-left: 10%; text-align: right; border-bottom: 1px dashed black;">
        <p style="font-size: 11pt;">Índice del árbol jurisprudencial construido por el
            TSJ y automatizado por SAMED-TSJ.</p>
        <p style="font-size: 11pt;">Reorganizado en un documento único y de acceso
            amigable</p>
        <p style="font-size: 11pt; ">Acceso directo vía Internet, desde el celular o la
            PC</p>
    </div>


    @if (isset($fechaActual))
    <div style="margin-top: 5%;margin-left: 10%;">
        <p style="font-size: 13pt;  font-family: 'times-new-roman', sans-serif;">Instituto de
            Investigaciones Jurídicas y Políticas </p>
    </div>
    @endif




    <div style="padding: 70px;"></div>

    <div style="background-color: #A40020; text-align: center;color: white; padding: 3%;text-align: left; position: absolute;right: 0;top: 700px;padding-top:20px; padding-bottom: 20px;">

        <p style="font-size: 11pt;font-weight: bold;">Ver:</p>
        <p style="font-size: 11pt; font-style: italic;">Guía de uso, en video adjunto</p>
    </div>


    <table style="width: 100%; text-align: center;margin-top: 80px; border-collapse: collapse;">
        <tr>
            <td style="width: 15%;">

            </td>
            <td style="width: 35%;">

                <!-- <p style="font-family: garamond; font-weight: bold;">SAMED-TSJ</p><br> -->
                <img src="{{ public_path('/images/vite.png') }}" alt="Image" style="width: auto; height: 100px;" />

            </td>
            <td style="width: 35%;">
                <img src="{{ public_path('/images/tsj.png') }}" alt="Image" style="width: 300px; height: auto;" />

            </td>


            <td style="width: 15%;">
            </td>
        </tr>
    </table>

    <pagebreak resetpagenum="1" suppress="1" even-footer-value="off" even-header-value="off" />


    <div style="font-size: 10pt;  font-family: 'cambria', sans-serif; text-align: justify;padding-right:20% ">
        <p>Cómo citar el trabajo:</p>


        @if (isset($fechaActual))
        <p>Instituto de Investigaciones Jurídicas y Políticas (IIJP).
            ({{ \Illuminate\Support\Str::afterLast($fechaActual, ' ') }}).
            <em>Serie de Cronologías Jurídicas (CRONOJURÍDICAS)</em>. Cochabamba: IIJP.
            Actualizado al {{ $fechaActual }}.
        </p>
        @endif




        <p style="font-size: 10pt;">

            El Tesauro de Jurisprudencia Penal ha sido elaborado de manera automatizada por el
            programa SAMED-TSJ. Usa información de dos fuentes. La primera es la
            jurisprudencia sistematizada por el Tribunal Supremo de Justicia (TSJ).
            La segunda, la del Instituto de Investigaciones Jurídicas y Políticas (IIJP). No obstante el
            reconocimiento expreso al TSJ, el presente trabajo, tal cual se la presenta a
            continuación, es propiedad intelectual del IIJP. Esta obra está destinada para uso
            exclusivo personal-profesional del destinatario que quiera adquirirlo. La obra ha
            sido elaborada con la mayor buena fe, cuidando de que refleje de manera fidedigna
            lo resuelto por el Tribunal Supremo de Justicia. Es una fuente de consulta, pero no
            sustituye (nada lo hace) la necesidad de consultar los precedentes contradictorios
            mismos, esto es, autos supremos y autos de vista. Adquirir y usar esta obra implica
            cumplir las condiciones antes indicadas. Su infracción conlleva consecuencias
            legales.

        </p>


        <p style="padding-top: 3%;color: red;font-style: italic;font-size: 14pt; ">Serie Cronologías Jurídicas y
            Políticas</p>
        <p>Facultad de Ciencias Jurídicas y Políticas, UMSS</p>
        <p>Instituto de Investigaciones Jurídicas y Políticas (IIJP)</p>
        <p>Decano: Dr. Hernán Soria Camacho</p>
        <p>Director Académico: Mgr. Luís Fernando Viscarra Prudencio</p>
        <p>Director de IIJP: Dr. Neyer Zapata-Vásquez</p>

        <p style="padding-top: 3% "><strong>Contacto</strong></p>
        <p>Dirección: Avenida Oquendo, esquina Sucre</p>
        <p>Teléfono: (591) 4 4227509, Int. 38269</p>
        <p>Email: iijp@umss.edu</p>

        <p><strong>Cochabamba - Bolivia</strong></p>
    </div>



    <pagebreak resetpagenum="1" suppress="1" even-footer-value="off" even-header-value="off" />




    <div
        style="width: 100%;  border-collapse: collapse; font-family: 'times-new-roman', sans-serif;padding-left:20%;padding-top:30%  ">

        <div>

            <p style="font-size: 12pt;text-align: justify;font-style: italic;">
                Presento aquí los resultados de mi investigación, para que el tiempo no abata el recuerdo de las
                acciones
                humanas y que las grandes empresas acometidas, ya sea por los griegos, ya por los bárbaros, no
                caigan en el
                olvido.</p>
            <p style="font-size: 12pt;font-weight: bold;text-align: right;"> Herodoto</p>

        </div>

        <div>


            <p style="font-size: 12pt;text-align: justify;font-style: italic;"> Ahora te explicaré este mundo así
                ordenado, para que presente la apariencia de la verdad; de
                este modo,
                nunca
                más te intimidaran las ideas de los mortales.</p>
            <p style="font-size: 12pt;font-weight: bold;text-align: right;"> Parménides</p>
        </div>

    </div>


    <pagebreak resetpagenum="1" suppress="0" even-footer-value="off" even-header-value="off" />
    <tocpagebreak toc-entries="off" links="1" toc-preHTML="Tabla de Contenido" toc-bookmarkText="Tabla de Contenido" />



    @foreach ($results as $item)
    <div style="page-break-inside: avoid;">
        <div style="page-break-inside: avoid;">
            @foreach ($item->descriptor as $elemento)


            <!-- @if ($item->indices[$loop->index] == 0)
                        <pagebreak />
                    @endif -->

            @if ($loop->last)
            <h2 class="descriptor{{ $item->indices[$loop->index] }}">
                [{{ $elemento }}]
            </h2>
            @else
            <h2 class="descriptor{{ $item->indices[$loop->index] }}">
                <bookmark content="{{ $elemento }}" level="{{ $item->indices[$loop->index] }}" />
                <tocentry content="{{ $elemento }}" level="{{ $item->indices[$loop->index] }}" />
                {{ $elemento }}
            </h2>

            @endif

            @endforeach

        </div>

        <!-- <div>
                <p class="restrictor">{{ $item->restrictor }}</p>
            </div> -->
        <div class="contenido">
            <span class="resolution">
                <a target="_blank" href="https://samed-tsj.umss.edu.bo/cronojuridicas/resolucion/{{ $item->resolution_id }}">
                    {{ $item->nro_resolucion }}
                </a>
            </span>
            @if ($item->forma_resolucion)
            <span class="forma-resolucion">
                &nbsp;| {{ str_replace('_x000D_', "\n", $item->forma_resolucion) }}
            </span>
            @endif

            @if ($item->tipo_jurisprudencia)
            <span class="tipo-jurisprudencia">
                | {{ str_replace('_x000D_', "\n", $item->tipo_jurisprudencia) }}
            </span>
            @endif


            @if ($item->proceso)
            <span class="proceso">
                | {{ str_replace('_x000D_', "\n", $item->proceso) }}
            </span>
            @endif

            @if ($item->ratio)
            <span class="ratio">
                | {{ str_replace('_x000D_', "\n", $item->ratio) }}
            </span>
            @endif

            @if (isset($item->resultado))
            <p class="resultado">Por tanto: {{ str_replace(["\r\n\r\n", '_x000D_'], '', $item->resultado) }}
            </p>
            @endif

        </div>
    </div>
    @endforeach



    @if ($referencias && count($referencias) > 0)
    <pagebreak resetpagenum="1" />


    <p style="font-size: 20pt;" class="titulo-referencias">Bibliografía consultada</p>

    @foreach ($referencias as $elemento)
    <div style="margin-bottom: 1em; font-size: 12pt; line-height: 1.6; text-align: justify;">

        @if ($elemento->tipo_resolucion)
        <span>
            {{ $elemento->tipo_resolucion }}
        </span>
        @endif
        @if ($elemento->nro_resolucion)
        <span>
            {{ ltrim($elemento->nro_resolucion, '0') }}
        </span>
        @endif
        @if ($elemento->fecha_emision)
        <span>
            de {{ $elemento->fecha_emision }}.
        </span>
        @endif
        @if ($elemento->sala)
        <span>
            Tribunal Supremo de Justicia, Sala {{ $elemento->sala }}.
        </span>
        @endif
        @if ($elemento->external_id)
        <a target="_blank" href=" https://jurisprudencia.tsj.bo/resoluciones/{{ $elemento->external_id }}/pdf">
            Enlace
        </a>
        @endif

    </div>
    @endforeach

    @endif


    <htmlpagefooter name="page-footer">

        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 17mm; width: 10mm; height: 10mm;">
            1
        </div>
        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 25mm; width: 10mm; height: 10mm;">
            2
        </div>
        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 33mm; width: 10mm; height: 10mm;">
            3
        </div>
        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 41mm; width: 10mm; height: 10mm;">
            4
        </div>
        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 49mm; width: 10mm; height: 10mm;">
            5

        </div>
        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 57mm; width: 10mm; height: 10mm;">
            6
        </div>
        <div style="position: absolute; bottom: 10mm; left: 9.5mm;margin-left: 65mm; width: 10mm; height: 10mm;">
            7
        </div>

        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 17mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 25mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 33mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 41mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 49mm; width: 10mm; height: 10mm;">
            |

        </div>
        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 57mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; bottom: 15mm; left: 10mm;margin-left: 65mm; width: 10mm; height: 10mm;">
            |
        </div>
        <div style="position: absolute; bottom: 15mm; right: 10mm; width: 10mm; height: 10mm;">
            {PAGENO}
        </div>



    </htmlpagefooter>

</body>

</html>