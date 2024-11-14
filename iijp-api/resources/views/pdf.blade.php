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
        .{{ $elemento['titulo'] }} {
            font-family: '{{ $elemento['estilo']['fontFamily'] }}', sans-serif;
            font-weight: {{ $elemento['estilo']['fontWeight'] }};
            font-size: {{ $elemento['estilo']['fontSize'] }};
            margin-left: {{ $elemento['estilo']['marginLeft'] }};
            padding-bottom: {{ $elemento['estilo']['paddingBottom'] }}px;
            margin-top: {{ $elemento['estilo']['marginTop'] }}px;
            text-align: {{ $elemento['estilo']['textAlign'] }};
            font-style: {{ $elemento['estilo']['fontStyle'] }};
            text-decoration: {{ $elemento['estilo']['textDecoration'] }};
            color: {{ $elemento['estilo']['color'] }};
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
div.mpdf_toc_level_0 { /* Línea completa nivel 0 */
	line-height: 1.5;
	margin-left: 0;
	padding-right: 0em;
}

span.mpdf_toc_t_level_0 { /* Título nivel 0 */
	font-weight: bold;
}

span.mpdf_toc_p_level_0 { /* Número de página nivel 0 */
}


/* Nivel 1 */
div.mpdf_toc_level_1 { /* Línea completa nivel 1 */
	margin-left: 2em;
	text-indent: -2em;
	padding-right: 0em;
}

span.mpdf_toc_t_level_1 { /* Título nivel 1 */
	font-style: italic;
	font-weight: bold;
}

span.mpdf_toc_p_level_1 { /* Número de página nivel 1 */
}


/* Nivel 2 */
div.mpdf_toc_level_2 { /* Línea completa nivel 2 */
	margin-left: 4em;
	text-indent: -2em;
	padding-right: 0em;
}

span.mpdf_toc_t_level_2 { /* Título nivel 2 */
	font-style: italic;
}

span.mpdf_toc_p_level_2 { /* Número de página nivel 2 */
}


/* Nivel 3 */
div.mpdf_toc_level_3 { /* Línea completa nivel 3 */
	margin-left: 6em;
	text-indent: -2em;
	padding-right: 0em;
}

span.mpdf_toc_t_level_3 { /* Título nivel 3 */
	font-style: italic;
	color: #555;
}

span.mpdf_toc_p_level_3 { /* Número de página nivel 3 */
}


/* Nivel 4 */
div.mpdf_toc_level_4 { /* Línea completa nivel 4 */
	margin-left: 8em;
	text-indent: -2em;
	padding-right: 0em;
}

span.mpdf_toc_t_level_4 { /* Título nivel 4 */
	font-style: italic;
	color: #4c4c4c;
	font-weight: lighter;
}

span.mpdf_toc_p_level_4 { /* Número de página nivel 4 */
}


/* Nivel 5 */
div.mpdf_toc_level_5 { /* Línea completa nivel 5 */
	margin-left: 10em;
	text-indent: -2em;
	padding-right: 0em;
}

span.mpdf_toc_t_level_5 { /* Título nivel 5 */
	font-style: italic;
	color: #666666; /* Color aún más claro */
	font-weight: lighter;
}

span.mpdf_toc_p_level_5 { /* Número de página nivel 5 */
}


/* Nivel 6 */
div.mpdf_toc_level_6 { /* Línea completa nivel 6 */
	margin-left: 12em;
	text-indent: -2em;
	padding-right: 0em;
}

span.mpdf_toc_t_level_6 { /* Título nivel 6 */
	font-style: italic;
	color: #7f7f7f; /* Color muy claro */
	font-weight: lighter;
	font-size: 0.9em; /* Tamaño más pequeño */
}

span.mpdf_toc_p_level_6 { /* Número de página nivel 6 */
}


.titulo-portada{
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
   
    @if (isset($subtitulo))
    <div style="text-align: center; margin-top: 10%;" class="titulo-portada">
    <p style="font-size: 16pt;">{{$subtitulo}}</p>
    </div>
           
    @endif
    
    @if (isset($fechaActual))
    <div style="margin-top: 20%;margin-left: 10%;" class="titulo-portada">
    <p style="font-size: 12pt;"><span style="font-weight: bold;">Fecha de publicación:</span>{{$fechaActual}}</p>
    </div>
           
    @endif
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
            <p class="resolution">
                Nro Resolución:
                <a href="http://127.0.0.1:3000/jurisprudencia/resolucion/{{ $item->resolution_id }}">
                    {{ $item->nro_resolucion }}
                </a>
            </p>

            @if ($item->tipo_jurisprudencia)

                <p class="tipo-jurisprudencia">
                    Tipo de jurisprudencia:
                    {{ str_replace('_x000D_', "\n", $item->tipo_jurisprudencia) }}
                </p>

            @endif

            @if ($item->forma_resolucion)

                <p class="forma-resolucion">
                    Forma de Resolución: {{ str_replace('_x000D_', "\n", $item->forma_resolucion) }}
                </p>

            @endif

            @if ($item->proceso)

                <p class="proceso">
                    Proceso: {{ str_replace('_x000D_', "\n", $item->proceso) }}
                </p>

            @endif

            @if ($item->ratio)

                <p class="ratio">
                    Ratio: {{ str_replace('_x000D_', "\n", $item->ratio) }}
                </p>

            @endif

            @if (isset($item->resultado))
            <p class="resultado">Por tanto: {{ str_replace(["\r\n\r\n", "_x000D_"], '', $item->resultado) }} </p>
            @endif

        </div>
    </div>
    @endforeach

    <htmlpagefooter name="page-footer">
        <div style="color: gray; text-align: right;">{PAGENO}</div>
    </htmlpagefooter>

</body>

</html>
