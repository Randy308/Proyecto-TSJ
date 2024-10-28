import React, { act, useEffect, useState } from "react";
import axios from "axios";

import Loading from "../../components/Loading";
import "../../styles/styles_randy/magistradosTSJ.css";
import EChart from "../analisis/EChart";
import { variables } from "../../data/VariablesMagistradoItems";

import { MdOutlineZoomOut } from "react-icons/md";
import MagistradoChart from "./MagistradoChart";

const EstadisticasMagistrado = ({ id }) => {
  const listaPeriodos = ["year", "month", "day"];
  const [resoluciones, setResoluciones] = useState([]);
  const [leyenda, setLeyenda] = useState([]);
  const [valor, setValor] = useState(null);
  const [superior, setSuperior] = useState(null);

  const endpoint = process.env.REACT_APP_BACKEND;
  const url = `${endpoint}/magistrado-estadisticas-departamentos/${id}`;

  useEffect(() => {
    const getEstadisticas = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/magistrado-estadisticas/${id}`,
          {
            params: {
              superior: superior,
              dato: valor,
            },
          }
        );
        setLeyenda(response.data.magistrado);
        setResoluciones(response.data.data);
        setSuperior(response.data.siguiente);
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    getEstadisticas();
  }, [id]);

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
  const [activo, setActivo] = useState("primero");
  const actualizar = (id) => {
    setActivo(id);
    console.log(activo);
  };

  const imprimir = (value) => {
    console.log(value);
  };

  const generarFecha = () => {
    if (valor !== null) {
      switch (superior) {
        case "year":
          return new Date(valor, 0, 1);

        case "mes":
          const selectedData = resoluciones.find(
            (item) => item.fecha === valor
          );
          return selectedData ? selectedData.full : null;
        case "day":
          // Si el caso "day" es relevante, implementa la lógica aquí
          setValor(null);
          break;
        default:
          break;
      }
    }
    return null;
  };

  const reducirFecha = () => {
    switch (superior) {
      case "year":
        console.log("limite superior");
        break;
      case "mes":
        var minDate = resoluciones.map((item) => item.full)[0];
        setSuperior(null);
        setValor(minDate);

        break;
      case "day":
        var minDate = resoluciones.map((item) => item.fecha)[0];
        setSuperior("year");
        setValor(minDate.split("-")[0]);

        break;
      default:
        break;
    }
  };
  const getEstadisticas = async () => {
    try {
      setResoluciones([]);
      const response = await axios.get(
        `${endpoint}/magistrado-estadisticas/${id}`,
        {
          params: {
            superior: superior,
            dato: generarFecha(),
          },
        }
      );
      setResoluciones(response.data.data);
      setSuperior(response.data.siguiente);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    console.log(valor);
    if (superior == "day") {
      setValor(null);
    }
    if (valor && superior !== "day") {
      console.log(valor);
      getEstadisticas();
    }
  }, [valor]);

  return (
    <div>
      <div className="flex flex-row items-center justify-center">
        <p className="titulo">Seleccionar Variable :</p>
        <select
          name="variablesMagistrado"
          id="variablesMagistrado"
          className="p-4 m-4"
          onChange={(e) => actualizar(e.target.value)}
        >
          {variables.map((item) => (
            <option value={item.id} key={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="text-center bg-blue-700 p-4 m-4 text-white">
        Resumen Estadístico
      </div>
      <div id="container-estadistica">
        <div
          className={`p-2 m-2 flex flex-row flex-wrap justify-around gap-4 custom:justify-center ${
            "primero" === activo ? "" : "hidden"
          }`}
        >
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
                  onClick={() => reducirFecha()}
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
                    <span className="round subtitulo">Suavizare</span>
                  </label>

                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" />
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Toggle me
                    </span>
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
        <div className={`mapa-bolivia ${"segundo" === activo ? "" : "hidden"}`}>
          <EChart url={url}></EChart>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasMagistrado;
