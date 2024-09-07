import React, { act, useEffect, useState } from "react";
import axios from "axios";

import Loading from "../../components/Loading";
import LineChart from "../analisis/LineChart";
import "../../styles/styles_randy/magistradosTSJ.css";
import EChart from "../analisis/EChart";
import { variables } from "../../data/VariablesMagistradoItems";
const EstadisticasMagistrado = ({ id }) => {
  const [data, setData] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  useEffect(() => {
    const endpoint = process.env.REACT_APP_BACKEND;
    const getEstadisticas = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/magistrado-estadisticas/${id}`
        );

        setXAxis(response.data.data.magistrado);
        setData(response.data.data.data);
        setDepartamentos(response.data.data.departamentos);
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    getEstadisticas();
  }, [id]);

  const x = data.map((item) => item.year);
  const leyenda = xAxis;
  const [chartType, setChartType] = useState("line");
  const [suavizar, setSuavizar] = useState(false);
  const [area, setArea] = useState(false);

  const toggleChartType = () => {
    setChartType((prevType) => {
      if (prevType === "line") return "bar";
      if (prevType === "bar") return "pie";
      return "line";
    });
  };
  const handleRadioChange = (event) => {
    setChartType(event.target.value);
    if (event.target.value === "pie") {
      delete option.xAxis;
      delete option.yAxis;
    } else {
      option.xAxis = {
        type: "category",
        boundaryGap: chartType === "line" ? false : true,
        data: x,
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
  // Configuración de la serie basada en el tipo de gráfico seleccionado
  const getSeries = () => {
    if (chartType === "pie") {
      return [
        {
          name: leyenda,
          type: "pie",
          radius: "50%",
          data: data.map((item) => ({ value: item.cantidad, name: item.year })),
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
        data: data.map((item) => item.cantidad),
        name: leyenda,
        type: chartType,
        smooth: chartType === "line" && suavizar ? true : false, // Smooth solo se aplica a líneas
        areaStyle: chartType === "line" && area ? {} : null, // areaStyle solo se aplica a líneas
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
      data: x,
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
  const [ activo , setActivo] = useState("primero");
  const actualizar =( id) =>{
    setActivo(id)
    console.log(activo)
  }
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
            <option value={item.id}  key={item.id}>{item.nombre}</option>
          ))}
        </select>
      </div>
      <div className="text-center bg-blue-700 p-4 m-4 text-white">
        Resumen Estadístico
      </div>
      <div id="container-estadistica">
        <div className={`p-2 m-2 flex flex-row flex-wrap gap-2 justify-center ${"primero" === activo ? "" : "hidden"}`}>
          <div className="grafica-contenedor">
            {data.length > 0 ? (
              <LineChart option={option} />
            ) : (
              <div style={{ width: 700 }} className="flex justify-center">
                <Loading />
              </div>
            )}
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
