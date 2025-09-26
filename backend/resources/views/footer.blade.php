<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    @if ($referencias && count($referencias) > 0)
    <pagebreak even-footer-value="-1" resetpagenum="1" />


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

</body>

</html>