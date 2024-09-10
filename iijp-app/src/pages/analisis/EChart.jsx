import React, { useEffect, useState } from "react";
import boliviaJson from "../../data/Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import '../../data/dark.js'; // Import the dark theme
import { useThemeContext } from "../../components/ThemeProvider";
const EChart = ({ data }) => {
  const [departamentos, setDepartamentos] = useState([]);
  useEffect(() => {
    if (data) {
      setDepartamentos(data);
    }
  }, [data]);
  const isDarkMode = useThemeContext();
  useEffect(() => {
    // Check for NaN or invalid values
    if (departamentos.some(item => isNaN(item.value))) {
      setDepartamentos(data); // Reset to original data
    }
  }, [departamentos]);
  registerMap("Bolivia", boliviaJson);
  const projection = geoMercator();
  return (
    <ReactECharts theme={isDarkMode ? 'dark' : null} 
      option={{
        title: {
          text: "Cantidad de resoluciones por departamento",
          subtext: "Datos de TSJ Bolivia",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
        },
        visualMap: {
          left: "right",
          min: 0,
          max: 500,
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
        },
        toolbox: {
          show: true,
          left: "left",
          top: "top",
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
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
            emphasis: {
              itemStyle: {
                areaColor: "rgb(255, 215, 0, 0.4)", // Cambia a cualquier color que desees para el hover
              },
              label: {
                show: true,
              },
            },
            data: departamentos,
          },
        ],
      }}
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default EChart;
