import React from "react";
import boliviaJson from "../../data/Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import "../../data/dark.js";
import "../../data/vintage.js";
import { useThemeContext } from "../../context/ThemeProvider";

const GeoChart = ({ contenido }) => {
  const isDarkMode = useThemeContext();

  registerMap("Bolivia", boliviaJson);

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return (
      <p className="text-black dark:text-white">No hay datos disponibles.</p>
    );
  }

  // Escala de colores para representar cada término_X
  const colorScale = {
    termino_1: "#FFB3BA", // Rojo pastel
    termino_2: "#AEC6CF", // Azul pastel
    termino_3: "#B4F0A7", // Verde pastel
    termino_4: "#FFEB99", // Amarillo pastel
    termino_5: "#FFCC99", // Naranja pastel
  };

  // Convertir la estructura de contenido para extraer el término dominante
  const processedData = contenido.map((item) => {
    // Extraer todos los valores dinámicos `termino_X`
    const terminos = Object.keys(item)
      .filter((key) => key.startsWith("termino_"))
      .reduce((acc, key) => {
        acc[key] = item[key];
        return acc;
      }, {});

    // Encontrar el término con el valor más alto
    const maxTermino = Object.keys(terminos).reduce((a, b) =>
      terminos[a] > terminos[b] ? a : b
    );

    return {
      name: item.name,
      maxTermino,
      maxValue: terminos[maxTermino],
      itemStyle: {
        areaColor: colorScale[maxTermino],
        borderColor: "black",
      },
    };
  });

  // Función para formatear el tooltip con el término dominante
  const formatTooltip = (params) => {
    const departmentData = params.data;
    if (!departmentData) return params.name;
    return `${params.name}:<br />${departmentData.maxTermino} → ${departmentData.maxValue}`;
  };

    
  const option = {
    title: {
      text: "Desglose comparativo de resoluciones por departamento",
      subtext: "Datos de TSJ de Bolivia",
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
      formatter: formatTooltip,
      backgroundColor: "#ffffff",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
      showDelay: 0,
      transitionDuration: 0.2,
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
          project: (point) => geoMercator()(point),
          unproject: (point) => geoMercator().invert(point),
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
        data: processedData,
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

export default GeoChart;
