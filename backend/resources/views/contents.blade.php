<!DOCTYPE html>
<html lang="en">

    @foreach ($results as $item)
        <div style="page-break-inside: avoid;">
            <div style="page-break-inside: avoid;">
                @foreach ($item->descriptor as $elemento)
                                 
                
                    <!-- @if ($item->indices[$loop->index] == 0)
                        <pagebreak />
                    @endif -->

                    @if ($loop->last)
                    <h2 class="restrictor">
                        [{{ $elemento }}]
                    </h2>                    
                    @else
                     <h2 class="descriptor{{ $item->indices[$loop->index] }}">
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


    <htmlpagefooter name="page-footer">
        <div style="color: gray; text-align: right;">{PAGENO}</div>
    </htmlpagefooter>

</body>

</html>
