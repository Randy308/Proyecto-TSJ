import React, {  } from "react";
import boliviaJson from "../../data/Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import "../../data/dark.js";
import "../../data/vintage.js";
import { useThemeContext } from "../../context/ThemeProvider";
const EChart = ({ contenido }) => {
  const isDarkMode = useThemeContext();

  registerMap("Bolivia", boliviaJson);

  const projection = geoMercator();

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return (
      <p className="text-black dark:text-white">No hay datos disponibles.</p>
    );
  }

  const option = {
    title: {
      text: "Cantidad de resoluciones por departamento",
      subtext: "Datos de TSJ Bolivia",
      left: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
      },
      subtextStyle: {
        fontSize: 12,
        color: "#666",
      },
    },
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
    visualMap: {
      left: "right",
      min: Math.min(...contenido.map((item) => item.value)),
      max: Math.max(...contenido.map((item) => item.value)),
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
      text: ["Alto", "Bajo"],
      calculable: true,
      orient: "horizontal",
      bottom: "10%",
    },
    toolbox: {
      show: true,
      orient: "vertical",
      left: "left",
      top: "top",
      feature: {
        saveAsImage: {
          title: "Guardar como imagen",
        },
      },
    },
    series: [
      {
        name: "Resoluciones",
        type: "map",
        roam: true,
        map: "Bolivia",
        projection: {
          project: function (point) {
            return projection(point);
          },
          unproject: function (point) {
            return projection.invert(point);
          },
        },
        label: {
          show: true,
          fontSize: 11,
          color: "black",
        },
        emphasis: {
          itemStyle: {
            areaColor: "rgba(255, 215, 0, 0.4)",
          },
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
            color: "#000",
          },
        },
        data: contenido,
      },
    ],
  };
  return (
    <ReactECharts
      theme={isDarkMode ? "dark" : "vintage"}
      option={option}
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default EChart;
