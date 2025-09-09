import { useEffect, useState } from "react";
import "../styles/inicio.css";
import SimpleChart from "../components/charts/SimpleChart";
import Loading from "../components/Loading";
import { useHistoricContext } from "../context/historicContext";
import Novedades from "./Novedades";
import type { EChartsOption } from "echarts-for-react";
// "baseUrl": ".",
// "paths": {
//   "@/*": ["./src/*"]
// }
const Inicio = () => {
  // const tarjetas = [
  //   {
  //     nombre: "SAMED",
  //     path: "/dinamicas",
  //     icon: <FaChartPie className="tarjetas-icon-style" />,
  //   },
  //   {
  //     nombre: "SISGECRO",
  //     path: "/jurisprudencia",
  //     icon: <FaMagnifyingGlassChart className="tarjetas-icon-style" />,
  //   },
  // ];

  const { historic } = useHistoricContext();
  const [maxRes, setMaxRes] = useState(0);
  const [maxJuris, setMaxJuris] = useState(0);

  useEffect(() => {
    if (historic && historic.max_res && historic.max_juris) {
      setMaxRes(historic.max_res);
      setMaxJuris(historic.max_juris);
    }
  }, [historic]);

  const option: EChartsOption = {
    visualMap: [
      {
        show: false,
        type: "continuous",
        seriesIndex: 0,
        min: 0,
        max: maxRes,
      },
      {
        show: false,
        type: "continuous",
        seriesIndex: 1,
        min: 0,
        max: maxJuris,
      },
    ],
    toolbox: {
      feature: {
        magicType: {
          show: true,
          type: ["line", "bar"],
          title: {
            line: "Línea",
            bar: "Barras",
          },
        },
        saveAsImage: {
          show: true,
          title: "Guardar como imagen",
        },
      },
    },
    title: [
      {
        left: "center",
        top: "5%",
        text: "Cantidad de Autos supremos por periodo",
        textStyle: {
          fontSize: Math.max(12, window.innerWidth * 0.015), // Ajusta según el tamaño de la pantalla
          fontWeight: "bold",
        },
      },
      {
        top: "55%",
        left: "center",
        text: "Cantidad de Jurisprudencia por periodo",
        textStyle: {
          fontSize: Math.max(12, window.innerWidth * 0.015), // Ajusta según el tamaño de la pantalla
          fontWeight: "bold",
        },
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    xAxis: [
      {
        type: "time",
      },
      {
        type: "time",
        gridIndex: 1,
      },
    ],
    yAxis: [
      {},
      {
        gridIndex: 1,
      },
    ],
    grid: [
      {
        bottom: "60%",
        left: "5%",
        right: "5%",
        containLabel: true,
      },
      {
        top: "60%",
        left: "5%",
        right: "5%",
        containLabel: true,
      },
    ],
    series: [
      {
        type: "line",
        showSymbol: false,
        data: historic?.resoluciones || [],
      },
      {
        type: "line",
        showSymbol: false,
        data: historic?.jurisprudencia || [],
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
    ],
  };

  return (
    <div>
      <div className="mb-4 relative">
        {/* <div className="overflow-hidden bg-gradient-to-b from-red-octopus-50  to-red-octopus-100 dark:from-blue-50 dark:to-blue-500 [clip-path:ellipse(100%_70%_at_50%_20%)]">
          <img
            src="derechoo.webp"
            className="h-[300px] sm:h-[600px] w-full object-cover object-bottom mix-blend-multiply [clip-path:ellipse(100%_70%_at_50%_20%)]"
          />
        </div> */}
        <div className="w-full mt-6 flex items-center justify-center flex-wrap flex-row">
          <div className="flex flex-col items-center justify-center text-center p-4 text-black dark:text-white">
            <p className="text-end text-[40px] titulo font-bold md:text-[55px]">
              SAMED TSJ
            </p>
            <p className="pt-6 text-lg">
              Sistema de Almacenamiento de Métricas Estadísticas Dinámicas
              <br /> del Tribunal Supremo de Justicia
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="chart h-auto w-[300px] md:w-[350px] lg:w-[420px]"
            viewBox="0 0 800 800"
            fill="none"
          >
            <path
              d="M253 430.721C260.343 474.378 281.861 514.401 314.227 544.605C346.593 574.808 388.007 593.511 432.067 597.822C479.5 600 525.155 585.316 536.343 580.571M538.532 216.351C511.543 202.894 481.784 195.925 451.627 196.001C405.195 196.005 360.19 212.049 324.227 241.418C288.263 270.787 263.549 311.678 254.265 357.172"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M447.317 435.633C464.612 435.633 478.633 421.612 478.633 404.317C478.633 387.021 464.612 373 447.317 373C430.021 373 416 387.021 416 404.317C416 421.612 430.021 435.633 447.317 435.633Z"
              fill="#73C0DE"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M415.563 648.548C360.672 640.426 309.905 614.69 270.907 575.216C231.909 535.743 206.79 484.667 199.333 429.682M199.97 356.627C208.244 302.782 233.473 252.979 271.99 214.455C310.508 175.93 360.307 150.693 414.15 142.41L415.917 142.148"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M469.997 130.365C494.49 130.365 514.345 110.51 514.345 86.0167C514.345 61.5238 494.49 41.6684 469.997 41.6684C445.504 41.6684 425.648 61.5238 425.648 86.0167C425.648 110.51 445.504 130.365 469.997 130.365Z"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M467.98 758.332C492.473 758.332 512.328 738.476 512.328 713.983C512.328 689.49 492.473 669.635 467.98 669.635C443.487 669.635 423.632 689.49 423.632 713.983C423.632 738.476 443.487 758.332 467.98 758.332Z"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M136.463 438.697C160.956 438.697 180.812 418.841 180.812 394.348C180.812 369.855 160.956 350 136.463 350C111.97 350 92.115 369.855 92.115 394.348C92.115 418.841 111.97 438.697 136.463 438.697Z"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M207 394L249 408"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M207 394L249 373"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M425.747 195.817L420.613 166.215"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M380.913 207.267L371.453 177.833"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M344.08 225.933L327.897 200.388"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M285.53 283.383L261.725 265.698"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M267.247 317.3L239.3 307.31"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M255.597 355.015L229.052 351.96"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M242.717 487.448C246.123 487.448 248.885 484.687 248.885 481.28C248.885 477.873 246.123 475.112 242.717 475.112C239.31 475.112 236.548 477.873 236.548 481.28C236.548 484.687 239.31 487.448 242.717 487.448Z"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M289.583 560.577C292.99 560.577 295.752 557.815 295.752 554.408C295.752 551.002 292.99 548.24 289.583 548.24C286.177 548.24 283.415 551.002 283.415 554.408C283.415 557.815 286.177 560.577 289.583 560.577Z"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M360.192 610.905C363.598 610.905 366.36 608.143 366.36 604.737C366.36 601.33 363.598 598.568 360.192 598.568C356.785 598.568 354.023 601.33 354.023 604.737C354.023 608.143 356.785 610.905 360.192 610.905Z"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M312.38 251.148L291.405 229.667"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M524 589L532.053 620.587"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M512.5 203.25L520.155 164"
              stroke="#73C0DE"
              strokeWidth="16.6667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="ldl-ani"
              d="M439.888 273.564C409.227 274.874 380.015 286.974 357.408 307.728L407.924 358.244C417.038 350.771 428.159 346.161 439.888 344.996V273.564Z"
              fill="#77A4BD"
            />
            <path
              className="ldl-ani"
              d="M332.832 300.12C307.74 327.196 293.408 361.796 292 398.692H386.188C387.352 386.963 391.961 375.841 399.436 366.728L332.832 300.12Z"
              fill="#A0C8D7"
            />
            <path
              className="ldl-ani"
              d="M536.752 398.692C535.493 378.706 527.623 359.706 514.38 344.684L492.336 366.728C499.809 375.842 504.419 386.964 505.584 398.692H536.752Z"
              fill="#E15B64"
            />
            <path
              className="ldl-ani"
              d="M514.52 327.576L568.004 274.092C536.224 244.336 495.4 227.424 451.888 226V344.996C463.956 346.196 474.964 350.968 483.852 358.244L514.52 327.576Z"
              fill="#C33737"
            />
            <path
              className="ldl-ani"
              d="M451.888 464.388V558.576C488.78 557.172 523.384 542.84 550.46 517.744L483.852 451.14C474.74 458.616 463.617 463.226 451.888 464.388Z"
              fill="#F8B26A"
            />
            <path
              className="ldl-ani"
              d="M355.024 410.692C356.282 430.678 364.153 449.678 377.396 464.7L399.44 442.656C391.968 433.541 387.358 422.42 386.192 410.692H355.024Z"
              fill="#849B87"
            />
            <path
              className="ldl-ani"
              d="M545.84 496.16C567.38 472.756 579.924 442.472 581.244 410.692H505.588C504.424 422.421 499.815 433.543 492.34 442.656L545.84 496.16Z"
              fill="#F47E60"
            />
            <path
              className="ldl-ani"
              d="M357.408 501.656C380.017 522.406 409.228 534.506 439.888 535.82V464.388C428.159 463.224 417.037 458.615 407.924 451.14L357.408 501.656Z"
              fill="#ABBD81"
            />
          </svg>

          {/* <p className="mb-4 uppercase text-xl text-center font-extrabold leading-none tracking-tight text-white md:text-3xl lg:text-4xl">
            Sistemas Administración de Métricas Estadísticas Dinámicas
            Judiciales
          </p> */}
        </div>
      </div>

      <div className="grid grid-cols-1  lg:grid-cols-3 text-black dark:text-white">
        <div className="flex items-center">
          <div className="p-4 m-4">
            <div className="mb-4 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 max-w-[700px] text-justify custom:max-w-none">
              A través de este sistema web, se facilita el análisis de los Autos
              Supremos y otras resoluciones del Tribunal Supremo de Justicia,
              proporcionando una herramienta para organizar y comprender datos
              legales de manera eficiente, accesible y comprensible. Esto no
              solo potencia la educación y el conocimiento en temas legales,
              sino que también promueve la transparencia y el acceso a la
              justicia en Bolivia.
            </div>
          </div>
        </div>
        <div className="p-4 lg:col-span-2">
          {historic &&
          historic.resoluciones &&
          historic.resoluciones.length > 0 ? (
            <SimpleChart option={option}></SimpleChart>
          ) : (
            <Loading></Loading>
          )}
        </div>
      </div>
      <div>
        <Novedades />
      </div>
      <div>
        <p className="text-2xl text-center font-bold dark:text-white">
          Otros sitios de interés
        </p>
        <div className="flex items-center flex-wrap justify-center gap-4 my-4">
          <a
            href="https://samed-tcp.umss.edu.bo/Inicio"
            className="dark:bg-[#1e293b] rounded-md p-1 flex items-center bg-white shadow-xl border-2 border-gray-200 dark:border-gray-700"
          >
            <img
              src="/logo.png"
              alt="Logo SAMED"
              className="samed-logo w-auto h-20"
            />
            <h1 className="text-[#004080] dark:text-white text-3xl font-extrabold tracking-wider uppercase drop-shadow-md">
              SAMED TCP
            </h1>
          </a>
          <a
            href="https://sigecro.umss.edu.bo/"
            className="px-4 rounded-md dark:bg-[#1e293b] shadow-xl border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center"
          >
            <img src="/sigecro-v2.svg" alt="SISGECRO" className="h-20 w-64" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
