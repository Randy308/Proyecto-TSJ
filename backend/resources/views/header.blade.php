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
        .cover-subtitle {
            font-size: 15pt;   font-family: 'script_mt', sans-serif;
            margin-top: 5px;
        }

        @foreach ($estilos as $elemento)
            .{{ $elemento['nombre'] }} {
                font-family: '{{ $elemento['fontFamily'] }}', sans-serif;
                font-weight: {{ $elemento['fontWeight'] }};
                font-size: {{ $elemento['fontSize'] }};
                margin-left: {{ $elemento['marginLeft'] === 'auto' ? 'auto' : $elemento['marginLeft'] . '%' }};
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
            text-align: left;
            padding-left: 5%;
        }

        .titulo-referencias {
            font-family: 'cambria', sans-serif;
            font-style: italic;
            text-align: center;
            padding: 0 10%;
        }

    </style>

</head>
</html>