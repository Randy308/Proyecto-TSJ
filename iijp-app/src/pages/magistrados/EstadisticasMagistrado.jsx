import React, { act, useEffect, useState } from "react";
import axios from "axios";

import Loading from "../../components/Loading";
import "../../styles/styles_randy/magistradosTSJ.css";
import EChart from "../analisis/EChart";
import { variables } from "../../data/VariablesMagistradoItems";

import { MdOutlineZoomOut } from "react-icons/md";
import MagistradoChart from "./MagistradoChart";

const EstadisticasMagistrado = ({ id }) => {
  const [resoluciones, setResoluciones] = useState([]);

  const [departamentos, setDepartamentos] = useState([]);

  const [leyenda, setLeyenda] = useState([]);

  const [valor, setValor] = useState(null);
  const [superior, setSuperior] = useState(null);
  useEffect(() => {
    const endpoint = process.env.REACT_APP_BACKEND;
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
        setDepartamentos(response.data.departamentos);
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
  const endpoint = process.env.REACT_APP_BACKEND;
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
        <p>Seleccionar Variable :</p>
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
          className={`p-2 m-2 flex flex-row flex-wrap gap-2 justify-center ${
            "primero" === activo ? "" : "hidden"
          }`}
        >
          <div className="grafica-contenedor">
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
          <div className="p-2 m-2 bg-gray-200 flex flex-col">
            <span className="text-center font-bold text-lg">Herramientas</span>
            <div className="p-2 m-2 flex flex-col gap-4">
              <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
                <span className="text-center">Tipo de Gráfico</span>
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
                <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
                  <span className="text-center">Opciones </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      value="Suavizar"
                      checked={suavizar}
                      onChange={cambiarSuavizar}
                    />
                    <span className="round">Suavizar</span>
                  </label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      value="Area"
                      checked={area}
                      onChange={cambiarArea}
                    />
                    <span className="round">Agregar area</span>
                  </label>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className={`mapa-bolivia ${"segundo" === activo ? "" : "hidden"}`}>
          <EChart data={departamentos}></EChart>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasMagistrado;