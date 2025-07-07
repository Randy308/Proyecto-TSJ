import { useEffect, useState } from "react";
import "../styles/inicio.css";
import SimpleChart from "../components/charts/SimpleChart";
import Loading from "../components/Loading";
import { useHistoricContext } from "../context/historicContext";
import edificioIIJP from "../images/derechoo.png"; // Importa la imagen del edificio IIJP
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
    } else {
      console.error("El objeto 'historic' no contiene los datos necesarios");
    }
  }, [historic]);

  const option:EChartsOption = {
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
        <div className="overflow-hidden bg-gradient-to-b from-red-octopus-50  to-red-octopus-100 dark:from-blue-50 dark:to-blue-500 [clip-path:ellipse(100%_70%_at_50%_20%)]">
          <img
            src={edificioIIJP}
            className="h-[300px] sm:h-[600px] w-full object-cover object-bottom mix-blend-multiply [clip-path:ellipse(100%_70%_at_50%_20%)]"
          />
        </div>
        <div className="w-full top-1/2 transform -translate-y-1/2 z-30 absolute">
          <p className="mb-4 uppercase text-xl text-center font-extrabold leading-none tracking-tight text-white md:text-3xl lg:text-4xl">
            Sistemas Gestión y Análisis de Métricas de la Justicia Ordinaria
          </p>
        </div>
      </div>
      <div>
        <Novedades />
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
          {historic && historic.resoluciones && historic.resoluciones.length > 0 ? (
            <SimpleChart option={option}></SimpleChart>
          ) : (
            <Loading></Loading>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inicio;
