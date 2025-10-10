    @foreach ($results as $item)


    @foreach ($item->descriptor as $elemento)

    <h2 class="descriptor{{ $item->indices[$loop->index] }}">
        <bookmark content="{{ $elemento }}" level="{{ $item->indices[$loop->index] }}" />
        <tocentry content="{{ $elemento }}" name="descriptor" level="{{ $item->indices[$loop->index] }}" />
        <tocentry content="{{ $elemento }}" name="restrictor" level="{{ $item->indices[$loop->index] }}" />

        {{ $elemento }}
    </h2>

    @endforeach

    @if (!empty($item->restrictor))
    <div>
        <tocentry content="{{ $item->restrictor }}" level="7" name="restrictor" />
        <p class="restrictor" toc-name="restrictor">{{ $item->restrictor }}</p>
    </div>
    @endif
    <div class="contenido">
        <span class="resolution">
            <tocentry content="{{ $item->nro_resolucion }}" level="1" name="autos" />

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


    </div>

    @endforeach