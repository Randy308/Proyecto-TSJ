import React, { useEffect, useState } from "react";

import Loading from "../../../components/Loading";
import LineChart from "../LineChart";
import "../../../styles/styles_randy/magistradosTSJ.css";

const Grafica = ({ content }) => {
  const [data, setData] = useState([]);
  const [leyenda, setLeyenda] = useState([]);
  const [x, setX] = useState([]);
  const [dataPie, setDataPie] = useState([]);
  useEffect(() => {
    console.log(content.data);
    setLeyenda("Resoluciones");
    setData(content.map((item) => item.cantidad));
    setX(content.map((item) => item.year));
    setDataPie(
      content.map((item) => ({ value: item.cantidad, name: item.year }))
    );
  }, [content]);

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

  const [valor, setValor] = useState(null);
  useEffect(() => {
    if (valor) {
      console.log(valor);
    }
  }, [valor]);

  return (
    <div id="container-estadistica" className="w-full m-4 p-4 flex custom:flex-wrap">
        <div className="grafica-contenedor">
          {data.length > 0 ? (
            <LineChart option={option} setData={setValor}/>
          ) : (
            <div style={{ width: 700 }} className="flex justify-center">
              <Loading />
            </div>
          )}
        </div>
        <div className="p-2 bg-gray-200 flex flex-col">
          <span className="text-center font-bold text-lg">Herramientas</span>
          <div className="p-2 flex flex-col gap-4">
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
  );
};

export default Grafica;
