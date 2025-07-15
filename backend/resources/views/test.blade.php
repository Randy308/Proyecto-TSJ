<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <styles>
        div.mpdf_toc {
        font-family: sans-serif;
        font-size: 11pt;
        }
        a.mpdf_toc_a {
        text-decoration: none;
        color: black;
        }

        /* Whole line level 0 */
        div.mpdf_toc_level_0 {
        line-height: 1.5;
        margin-left: 0;
        padding-right: 2em;
        }

        /* padding-right should match e.g
        <dottab outdent="2em" /> 0 is default */
        /* Title level 0 - may be inside <a> */
            span.mpdf_toc_t_level_0 {
            font-weight: bold;
            }

            /* Page no. level 0 - may be inside <a> */
                span.mpdf_toc_p_level_0 {}

                /* Whole line level 1 */
                div.mpdf_toc_level_1 {
                margin-left: 2em;
                text-indent: -2em;
                padding-right: 2em;
                }

                /* padding-right should match
                <dottab outdent="2em" /> 2em is default */
                /* Title level 1 */
                span.mpdf_toc_t_level_1 {
                font-style: italic;
                font-weight: bold;
                }

                /* Page no. level 1 - may be inside <a> */
                    span.mpdf_toc_p_level_1 {}

                    /* Whole line level 2 */
                    div.mpdf_toc_level_2 {
                    margin-left: 4em;
                    text-indent: -2em;
                    padding-right: 2em;
                    }

                    /* padding-right should match
                    <dottab outdent="2em" /> 2em is default */
                    /* Title level 2 */
                    span.mpdf_toc_t_level_2 {}

                    /* Page no. level 2 - may be inside <a> */
                        span.mpdf_toc_p_level_2 {}
    </styles>
</head>

<body>


    <tocpagebreak toc-entries="off" links="1" toc-preHTML="Tabla de Contenido" />
    <h1>
        <tocentry content="Título principal" level="1" />Título principal
    </h1>
    <h2>
        <tocentry content="Subtítulo 1" level="2" />Subtítulo 1
    </h2>
    <h3>
        <tocentry content="Sub-subtítulo 1.1" level="3" />Sub-subtítulo 1.1
    </h3>
    <h4>
        <tocentry content="Sub-sub-subtítulo 1.1.1" level="4" />Sub-sub-subtítulo 1.1.1
    </h4>
    <h5>
        <tocentry content="Sub-sub-sub-subtítulo 1.1.1.1" level="5" />Sub-sub-sub-subtítulo 1.1.1.1
    </h5>
    <h3>
        <tocentry content="Sub-subtítulo 1.2" level="3" />Sub-subtítulo 1.2
    </h3>
    <h2>
        <tocentry content="Subtítulo 2" level="2" />Subtítulo 2
    </h2>
    <h3>
        <tocentry content="Sub-subtítulo 2.1" level="3" />Sub-subtítulo 2.1
    </h3>
    <h4>
        <tocentry content="Sub-sub-subtítulo 2.1.1" level="4" />Sub-sub-subtítulo 2.1.1
    </h4>
    <h2>
        <tocentry content="Subtítulo 3" level="2" />Subtítulo 3
    </h2>
    <h3>
        <tocentry content="Sub-subtítulo 3.1" level="3" />Sub-subtítulo 3.1
    </h3>
    <h3>
        <tocentry content="Sub-subtítulo 3.2" level="3" />Sub-subtítulo 3.2
    </h3>
    <h4>
        <tocentry content="Sub-sub-subtítulo 3.2.1" level="4" />Sub-sub-subtítulo 3.2.1
    </h4>
    <h5>
        <tocentry content="Sub-sub-sub-subtítulo 3.2.1.1" level="5" />Sub-sub-sub-subtítulo 3.2.1.1
    </h5>
    <h2>
        <tocentry content="Subtítulo 4" level="2" />Subtítulo 4
    </h2>
    <h3>
        <tocentry content="Sub-subtítulo 4.1" level="3" />Sub-subtítulo 4.1
    </h3>
    <h2>
        <tocentry content="Subtítulo 5" level="2" />Subtítulo 5
    </h2>
    <h3>
        <tocentry content="Sub-subtítulo 5.1" level="3" />Sub-subtítulo 5.1
    </h3>
    <h4>
        <tocentry content="Sub-sub-subtítulo 5.1.1" level="4" />Sub-sub-subtítulo 5.1.1
    </h4>
    <h2>
        <tocentry content="Subtítulo 6" level="2" />Subtítulo 6
    </h2>
    <h3>
        <tocentry content="Sub-subtítulo 6.1" level="3" />Sub-subtítulo 6.1
    </h3>
    <h3>
        <tocentry content="Sub-subtítulo 6.2" level="3" />Sub-subtítulo 6.2
    </h3>
</body>

</html>