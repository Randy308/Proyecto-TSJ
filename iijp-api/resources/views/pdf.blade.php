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

        @foreach ($estilos as $elemento)
            .{{ $elemento['nombre'] }} {
                font-family: '{{ $elemento['fontFamily'] }}', sans-serif;
                font-weight: {{ $elemento['fontWeight'] }};
                font-size: {{ $elemento['fontSize'] }};
                margin-left: {{ $elemento['marginLeft'] === 'auto' ? 'auto' : $elemento['marginLeft'].'%' }};
                padding-bottom: {{ $elemento['paddingBottom'] }}px;
                margin-top: {{ $elemento['marginTop'] }}px;
                text-align: {{ $elemento['textAlign'] }};
                font-style: {{ $elemento['fontStyle'] }};
                text-decoration: {{ $elemento['textDecoration'] }};
                color: {{ $elemento['color'] }};
            }
        @endforeach

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
            font-family: 'cambria', sans-serif;
            font-style: italic;
            text-align: right;
            padding: 0 10%;
        }
    </style>

</head>

<body>
    <htmlpageheader name="page-header">
        <div style="text-align: center; color: #999;">IIJP</div>
    </htmlpageheader>

    <table style="width: 100%; text-align: center; border-collapse: collapse;">
        <tr>
            <td style="width: 10%;">
                <img src="{{ public_path('/images/facultad.jpeg') }}" alt="Image"
                    style="max-width: 100px; height: auto;" />
            </td>
            <td style="width: 80%; padding: 10px;">
                <div
                    style="font-size: 17pt;   font-family: 'cambria', sans-serif; font-weight: bold; font-style: italic;">
                    Observatorio del derecho y la política boliviana
                </div>
                <div
                    style="font-size: 17pt;   font-family: 'cambria', sans-serif; font-weight: bold; font-style: italic;">
                    Serie Cronologías jurídicas y políticas
                </div>
            </td>


            <td style="width: 10%;">
                <img src="{{ public_path('/images/iijp.png') }}" alt="Image"
                    style="max-width: 100px; height: auto;" />
            </td>
        </tr>
    </table>

    <div style="background-color: #A40020; text-align: center; margin-top: 10%; color: white;">
        <p style="font-size: 26pt;" class="titulo-portada">SERIE DE CRONOLOGÍAS JURÍDICAS (CRONOJURÍDICAS)</p>

        @if (isset($subtitulo))
            <p style="font-size: 20pt;" class="titulo-portada">{{ $subtitulo }}</p>
        @endif


    </div>
    <div style="margin-top: 5%; margin-left: 10%; text-align: right; border-bottom: 1px dashed black;">
        <p style="font-size: 11pt;">Índice del árbol jurisprudencial construido por el
            TSJ</p>
        <p style="font-size: 11pt;">Reorganizado en un documento único y de acceso
            amigable</p>
        <p style="font-size: 11pt;">Filtros temáticos e índice de sentencias</p>
        <p style="font-size: 11pt; ">Acceso directo vía Internet, desde el celular o la
            PC</p>
    </div>


    @if (isset($fechaActual))
        <div style="margin-top: 5%;margin-left: 10%;">
            <p style="font-size: 11pt;">Actualizado al {{ $fechaActual }}</p>
            <p style="font-size: 11pt;"> Con enlaces para acceder al texto completo</p>
            <p style="font-size: 13pt;  font-family: 'times-new-roman', sans-serif;">Instituto de
                Investigaciones Jurídicas y Políticas </p>
        </div>
    @endif




    <table style="width: 100%;  border-collapse: collapse;">
        <tr>
            <td style="width: 50%;">

            </td>


            <td
                style="width: 50%;background-color: #A40020; text-align: center;color: white; padding: 3%;text-align: left;">
                <div>
                    <p style="font-size: 11pt;font-weight: bold;">Ver:</p>
                    <p style="font-size: 11pt; font-style: italic;">Guía de uso, en video adjunto</p>
                </div>
            </td>
        </tr>
    </table>

    <pagebreak even-footer-value="-1" resetpagenum="1" />


    <div style="font-size: 10pt;  font-family: 'cambria', sans-serif; text-align: justify;padding-right:20% ">
        <p>Cómo citar el trabajo:</p>


        @if (isset($fechaActual))
            <p>Instituto de Investigaciones Jurídicas y Políticas (IIJP).
                ({{ \Illuminate\Support\Str::afterLast($fechaActual, ' ') }}).
                <em>Serie de Cronologías Jurídicas (CRONOJURÍDICAS)</em>. Cochabamba: IIJP.
                Actualizado al {{ $fechaActual }}.
            </p>
        @endif





        <p style="font-size: 10pt;">La Base de datos está compuesta por noticias, decisiones judiciales y todo otro
            documento que contenga
            información acerca de algún hecho legal o político. Los documentos se guardan en un repositorio del IIJP.
            Estos
            documentos, en formato digital, están adjuntos a sus referencias documentales o bibliográficas.Hay dos
            versiones de las referencias; una trabaja con el programa Zotero; la otra, con EndNote. Si usted está
            escribiendo algún trabajo académico relativo al tema del presente documento, sepa que, con un simple clic,
            puede
            introducir dichas referencias en su trabajo académico.La Base de datos es de acceso público y gratuito, a
            condición de que su uso no tenga fines de lucro. Los
            interesados
            en toda la Base de datos pueden apersonarse a oficinas del IIJP; para descargar solo las referencias se
            puede usar los
            enlaces que se indican abajo. El uso que otras personas hagan la Base de datos no es responsabilidad del
            IIJP.</p>

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



    <pagebreak even-footer-value="-1" resetpagenum="1" />




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
    <pagebreak even-footer-value="-1" resetpagenum="1" />


    <tocpagebreak toc-entries="off" links="1" toc-preHTML="Tabla de Contenido" />



    @foreach ($results as $item)
        <div>
            <div>
                @foreach ($item->descriptor as $elemento)
                    <h2 class="descriptor{{ $item->indices[$loop->index] }}">
                        <tocentry content="{{ $elemento }}" level="{{ $item->indices[$loop->index] }}" />
                        {{ $elemento }}
                    </h2>
                @endforeach
            </div>

            <div>
                <p class="restrictor">{{ $item->restrictor }}</p>
            </div>
            <div class="contenido">
                <span class="resolution">
                    <a href="http://127.0.0.1:3000/jurisprudencia/resolucion/{{ $item->resolution_id }}">
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

    <htmlpagefooter name="page-footer">
        <div style="color: gray; text-align: right;">{PAGENO}</div>
    </htmlpagefooter>

</body>

</html>
