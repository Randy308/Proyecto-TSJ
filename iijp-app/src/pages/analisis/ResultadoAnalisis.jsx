import React from "react";
import { useLocation } from "react-router-dom";
import LineChart from "./LineChart";

const ResultadoAnalisis = () => {
  const location = useLocation();
  const { data } = location.state || [];

  const tipo = data.tipo_periodo;

  const leyenda = data.data.map((item) => item.id);

  const meses = data.xAxis;
  const transformedData = data.data.map((item) => ({
    name: item.id,
    type: "line",
    stack: "Total",
    smooth: true,
    areaStyle: {},
    emphasis: {
      focus: "series",
    },

    data: item.data.map((subItem) => subItem.cantidad),
  }));

  console.log(transformedData);

  const option = {
    title: {
      text: "Grafico de lineas",
      left: "center",
      top: "5%",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: leyenda,
      top: "10%",
      left: "center",
    },
    grid: {
      top: "20%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: meses,
    },
    yAxis: {
      type: "value",
    },
    series: transformedData,
  };

  return (
    <div style={{ height: "fit-content" }}>
      <h1 className="text-center text-2xl font-bold p-4 m-4">
        Forma de Resoluciones por mes
      </h1>
      <div
        id="container-graph"
        style={{ height: 500 }}
        className="p-4 m-4 flex items-center justify-center"
      >
        {transformedData.length > 0 ? (
          <LineChart option={option} />
        ) : (
          <p>No existe informacion</p>
        )}
      </div>
    </div>
  );
};
export default ResultadoAnalisis;
