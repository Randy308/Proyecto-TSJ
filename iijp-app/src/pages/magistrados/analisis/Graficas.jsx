import React, { useEffect, useState } from "react";

import Loading from "../../../components/Loading";
import "../../../styles/styles_randy/magistradosTSJ.css";
import { MdOutlineZoomOut } from "react-icons/md";
import MagistradoChart from "../MagistradoChart";

const Graficas = ({ resoluciones, leyenda, setValor, recorrerLista }) => {

  const [abscisas, setAbscisas] = useState([]);
  const [data, setData] = useState([]);
  const [dataPie, setDataPie] = useState([]);

  useEffect(() => {
    setAbscisas(resoluciones.map((item) => item.fecha));
    setData(resoluciones.map((item) => item.cantidad));
    setDataPie(
      resoluciones
        .filter((item) => item.cantidad > 0)
        .map((item) => ({ value: item.cantidad, name: item.fecha }))
    );
  }, [resoluciones]);

  const [chartType, setChartType] = useState("line");
  const [suavizar, setSuavizar] = useState(false);
  const [area, setArea] = useState(false);

  const handleRadioChange = (event) => {
    setChartType(event.target.value);
    if (event.target.value === "pie") {
      delete option.xAxis;
      delete option.yAxis;
    } else {
      option.xAxis = {
        type: "category",
        boundaryGap: chartType === "line" ? false : true,
        data: abscisas,
      };
      option.yAxis = {
        type: "value",
      };
    }
  };

  const cambiarArea = (event) => {
    if (area) {
      setArea(false);
    } else {
      setArea(true);
    }
  };
  const cambiarSuavizar = (event) => {
    if (suavizar) {
      setSuavizar(false);
    } else {
      setSuavizar(true);
    }
  };

  const getSeries = () => {
    if (chartType === "pie") {
      return [
        {
          name: leyenda,
          type: "pie",
          radius: "50%",
          data: dataPie,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ];
    }

    return [
      {
        data: data,
        name: leyenda,
        type: chartType,
        smooth: chartType === "line" && suavizar ? true : false,
        areaStyle: chartType === "line" && area ? {} : null,
      },
    ];
  };

  const option = {
    tooltip: {
      trigger: chartType === "pie" ? "item" : "axis",
    },

    legend: {
      orient: "vertical",
      left: "left",
    },
    xAxis: {
      type: "category",
      boundaryGap: chartType === "line" ? false : true,
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

    series: getSeries(),
  };

  return (
    <div className="p-2 m-2 flex flex-row flex-wrap justify-center gap-4 custom:justify-normal custom:gap-1">
      <div className="grafica-contenedor  rounded-md border border-gray-400 p-0.5">
        {data.length > 0 ? (
          <MagistradoChart option={option} setData={setValor} />
        ) : (
          <Loading />
        )}
        <div
          className="flex flex-col bg-white gap-2 rounded-lg border"
          id="boton-navegar"
        >
          <div className="flex-grow flex justify-center items-center">
            <MdOutlineZoomOut
              className="cursor-pointer text-xl"
              onClick={() => recorrerLista(true)}
            />
          </div>
        </div>
      </div>
      <div
        id="herramientas-grafico"
        className="p-2 m-2 flex flex-col rounded-md border border-gray-400"
      >
        <span className="text-center font-bold text-lg subtitulo">
          Herramientas
        </span>
        <div className="p-2 m-2 flex flex-col gap-4">
          <div
            id="herramientas-tipos"
            className="flex flex-col gap-4 p-4 rounded-lg border border-slate-300"
          >
            <span className="text-center subtitulo">Tipo de Gráfico</span>
            <div className="selector-graph">
              <label>
                <input
                  type="radio"
                  value="line"
                  checked={chartType === "line"}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Líneas</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="bar"
                  checked={chartType === "bar"}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Barras</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="pie"
                  checked={chartType === "pie"}
                  onChange={handleRadioChange}
                />
                <span className="radio-label">Pastel</span>
              </label>
            </div>
          </div>
          {chartType === "line" ? (
            <div
              id="herramientas-opciones"
              className="flex flex-col gap-4 p-4 rounded-lg border border-slate-300"
            >
              <span className="text-center subtitulo">Opciones </span>
              <label className="switch">
                <input
                  type="checkbox"
                  value="Suavizar"
                  checked={suavizar}
                  onChange={cambiarSuavizar}
                />
                <span className="round subtitulo">Suavizar</span>
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  value="Area"
                  checked={area}
                  onChange={cambiarArea}
                />
                <span className="round subtitulo">Agregar area</span>
              </label>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Graficas;
