<!DOCTYPE html>
<html lang="en">

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
                    style="font-size: 17pt;   font-family: 'script_mt', sans-serif;">
                    Observatorio del derecho y la política boliviana
                </div>
                <div
                    class="cover-subtitle"
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

    <div style="background-color: #A40020; text-align: center; margin-top: 10%; color: white;">
        <p style="font-size: 28pt;" class="titulo-portada">Tesauro de</p>

        @if (isset($titulo))
        <p style="font-size: 28pt;" class="titulo-portada">{{ $titulo }}</p>
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

    <table style="width: 100%; text-align: center;margin-top: 20px; border-collapse: collapse;">
        <tr>
            <td style="width: 15%;">

            </td>
            <td style="width: 70%;">
                <img src="{{ public_path('/images/tsj.png') }}" alt="Image" style="width: 320px; height: auto;" />

            </td>


            <td style="width: 15%;">
            </td>
        </tr>
    </table>

    <pagebreak even-footer-value="-1" resetpagenum="1" suppress="1" />


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



    <pagebreak even-footer-value="-1" resetpagenum="1" suppress="1" />




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


    <pagebreak even-footer-value="-1" resetpagenum="1" suppress="0" />
</body>

</html>