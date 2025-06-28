import Loading from "../../../components/Loading";
import React, { useEffect, useState } from "react";
import MagistradoChart from "../MagistradoChart";
import { ImZoomOut } from "react-icons/im";
const TimesSeries = ({ setValor, resoluciones, recorrerLista }) => {
  const [abscisas, setAbscisas] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setAbscisas(resoluciones.map((item) => item.fecha));
    setData(resoluciones.map((item) => item.cantidad));
  }, [resoluciones]);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return `${params.name}: ${params.value} resoluciones`;
      },
      backgroundColor: "#ffffff",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
      showDelay: 0,
      transitionDuration: 0.2,
    },

    legend: {
      orient: "vertical",
      left: "left",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: abscisas,
    },
    yAxis: {
      type: "value",
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    series: {
      data: data,
      type: "line",
      symbol: "circle",
      symbolSize: 9,
      smooth: true,
      markPoint: {
        data: [
          { type: 'max', name: 'Cantidad maxima' },
          { type: 'min', name: 'Cantidad minima' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Promedio' }]
      },
      areaStyle: {
        opacity: 0.4,
        color: "#C9E8F1", // Color de relleno suave y claro para el área
      },
      lineStyle: {
        color: "#4A90E2", // Azul suave para la línea principal
        width: 4,
        type: "line",
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: "#FF7F50", // Naranja suave para el borde de los puntos
        color: "#FFA07A", // Naranja claro para el color de los puntos
      },
    },
  };
 
  return (
    <div
      
      className="relative h-[600px] border border-gray-300 p-4 m-4 custom:p-2 custom:m-0 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]"
    >
      {data.length > 0 ? (
        <MagistradoChart option={option} setData={setValor} />
      ) : (
        <Loading />
      )}

      <button
        onClick={() => recorrerLista(true)}
        
        className="absolute -bottom-0 -right-0 flex items-center bg-white hover:bg-gray-100 text-gray-800 font-semibold m-2 border border-gray-400 rounded shadow p-2"
      >
        <ImZoomOut className="w-5 h-6" />
      </button>
    </div>
  );
};

export default TimesSeries;
