import Loading from "../../../components/Loading";
import React, { useEffect, useRef, useState } from "react";
import MagistradoChart from "../MagistradoChart";
import { TiZoomOut } from "react-icons/ti";
const TimesSeries = ({ setValor, resoluciones, recorrerLista }) => {
  const [abscisas, setAbscisas] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setAbscisas(resoluciones.map((item) => item.fecha));
    setData(resoluciones.map((item) => item.cantidad));
  }, [resoluciones]);

  const option = {
    tooltip: {
      trigger: "axis",
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
  const containerRef = useRef(null);
  const iconRef = useRef(null);
  const handleShowList = () => {
    if (containerRef.current && iconRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const listaHeight = iconRef.current.offsetHeight;
      const listaWidth = iconRef.current.offsetWidth;

      iconRef.current.style.top = `${rect.bottom - 10 - listaHeight}px`;
      iconRef.current.style.left = `${
        rect.left + rect.width - 10 - listaWidth
      }px`;
    }
  };
  useEffect(() => {
    handleShowList();
  }, []);

  return (
    <div
      ref={containerRef}
      className=" h-[600px] static border border-gray-300 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]"
    >
      {data.length > 0 ? (
        <MagistradoChart option={option} setData={setValor} />
      ) : (
        <Loading />
      )}

      <button
        onClick={() => recorrerLista(true)}
        ref={iconRef}
        className="flex absolute items-center bg-white hover:bg-gray-100 text-gray-800 font-semibold p-2 border border-gray-400 rounded shadow"
      >
        <TiZoomOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TimesSeries;
