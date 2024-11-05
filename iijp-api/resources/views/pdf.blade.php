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

        .contenido {
            margin-top: 10px;
        }

        .descriptor,
        .resolution,
        .tipo-jurisprudencia,
        .forma-resolucion,
        .proceso,
        .ratio {
            margin-bottom: 5px;
        }

        .descriptor-0 {
            font-family: "Cambria";
            font-weight: normal;
            font-size: 26pt;
            margin-left: 2px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: center;
        }

        .descriptor-1 {
            font-family: "Cambria";
            font-weight: normal;
            font-size: 22pt;
            margin-left: 2px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: center;
        }

        .descriptor-2 {
            font-family: "Trebuchet MS";
            font-weight: normal;
            font-size: 16pt;
            margin-left: 2px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: justify;
        }

        .descriptor-3 {
            font-family: "Trebuchet MS";
            font-weight: normal;
            font-size: 15pt;
            margin-left: 15px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: justify;
        }

        .descriptor-4 {
            font-family: "Trebuchet MS";
            font-weight: normal;
            font-size: 14pt;
            margin-left: 30px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: justify;
        }

        .descriptor-5 {
            font-family: "Trebuchet MS";
            font-weight: normal;
            font-size: 13pt;
            margin-left: 55px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: justify;
        }

        .descriptor-6 {
            font-family: "Trebuchet MS";
            font-weight: normal;
            font-size: 12pt;
            margin-left: 75px;
            padding-bottom: 5px;
            margin-top: 0;
            text-align: justify;
        }

        .ratio {
            font-family: "Times New Roman";
            font-weight: normal;
            font-size: 12pt;
            margin-left: 0;
            padding-bottom: 0;
            margin-top: 10px;
            text-align: justify;
        }

        .resolution {
            font-family: "Times New Roman";
            font-weight: normal;
            font-size: 12pt;
            margin-left: 0;
            padding-bottom: 15px;
            margin-top: 10px;
            text-align: justify;
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
    <pagebreak even-footer-value="-1" resetpagenum="1" />

    <tocpagebreak toc-entries="off" links="1" toc-preHTML="Tabla de Contenido" />




    @foreach ($results as $item)
        <div>
            <div>
                @foreach ($item->descriptor as $elemento)
                    <h2 class="descriptor-{{ $item->indices[$loop->index] }}">

                        @if ($item->indices[$loop->index] < 3)
                            <tocentry content="{{ $elemento }}" level="{{ $item->indices[$loop->index] }}" />
                        @endif

                        {{ $elemento }}
                    </h2>
                @endforeach
            </div>

            <div class="contenido">
                <p class="descriptor">{{ $item->restrictor }}</p>

                <p class="resolution">
                    Nro Resolución:
                    <a href="http://127.0.0.1:3000/Jurisprudencia/Resolucion/{{ $item->resolution_id }}">
                        {{ $item->nro_resolucion }}
                    </a>
                </p>

                @if ($item->tipo_jurisprudencia)
                    <div>
                        <p class="tipo-jurisprudencia">
                            Tipo de jurisprudencia:
                            {{ str_replace('_x000D_', "\n", $item->tipo_jurisprudencia) }}
                        </p>
                    </div>
                @endif

                @if ($item->forma_resolucion)
                    <div>
                        <p class="forma-resolucion">
                            Forma de Resolución: {{ str_replace('_x000D_', "\n", $item->forma_resolucion) }}
                        </p>
                    </div>
                @endif

                @if ($item->proceso)
                    <div>
                        <p class="proceso">
                            Proceso: {{ str_replace('_x000D_', "\n", $item->proceso) }}
                        </p>
                    </div>
                @endif

                @if ($item->ratio)
                    <div>
                        <p class="ratio">
                            Ratio: {{ str_replace('_x000D_', "\n", $item->ratio) }}
                        </p>
                    </div>
                @endif
            </div>
        </div>
    @endforeach

    <htmlpagefooter name="page-footer">
        <div style="color: gray; text-align: right;">{PAGENO}</div>
    </htmlpagefooter>

</body>

</html>
