<!DOCTYPE html>
<html lang="en">

<body>

    <table style="width: 100%; text-align: center; border-collapse: collapse;">
        <tr>
            <td style="width: 10%;">
                <img src="{{ public_path('/images/umss.png') }}" alt="Image"
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




    <div style="padding: 100px;"></div>

    <div style="position: absolute;left: 100px;width: 100% ;height:150px;top: 200px; background: #A40020;background-color: #A40020; text-align: center;padding-left: 30px; padding-top:20px; padding-bottom: 20px; color: white;">
        <p style="font-size: 26pt;" class="titulo-portada">SERIE DE CRONOJURÍDICAS</p>

        @if (isset($titulo))
        <p style="font-size: 20pt;" class="titulo-portada">{{ $titulo }}</p>
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
        <!-- <p style="font-size: 11pt;">Actualizado al {{ $fechaActual }}</p>
        <p style="font-size: 11pt;"> Con enlaces para acceder al texto completo</p> -->
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





        <p style="font-size: 10pt;">

            Las cronojuridicas han sido elaboradas de manera automatizada por el
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