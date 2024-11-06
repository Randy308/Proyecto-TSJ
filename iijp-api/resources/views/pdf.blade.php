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

    </style>

</head>

<body>

    <htmlpageheader name="page-header">
        <div style="color: gray; text-align: center;">IIJP</div>
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

    <div style="background-color: #c23b22; text-align: center; margin-top: 20%; color: white;">
        <p style="font-size: 45pt;">Cronologias Juridicas</p>

        @if (isset($subtitulo))
            <p style="font-size: 35pt;">{{$subtitulo}}</p>
            @endif


    </div>

    <pagebreak even-footer-value="-1" resetpagenum="1" />

    <tocpagebreak toc-entries="off" links="1" toc-preHTML="Tabla de Contenido" />




    @foreach ($results as $item)
    <div>
        <div>
            @foreach ($item->descriptor as $elemento)
            <h2 class="descriptor{{ $item->indices[$loop->index] }}">

                @if ($item->indices[$loop->index]
                < 3)
                    <tocentry content="{{ $elemento }}" level="{{ $item->indices[$loop->index] }}" />
                @endif

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
