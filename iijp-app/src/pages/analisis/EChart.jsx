import React, { useEffect, useState } from "react";
import boliviaJson from "../../data/Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import "../../data/dark.js"; // Import the dark theme
import { useThemeContext } from "../../components/ThemeProvider";
import { useFreeApi } from "../../hooks/api/useFreeApi";
import Loading from "../../components/Loading";
const EChart = ({ url }) => {
  const { contenido, isLoading, error } = useFreeApi(url);

  const isDarkMode = useThemeContext();

  registerMap("Bolivia", boliviaJson);

  const projection = geoMercator();
  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <ReactECharts
      theme={isDarkMode ? "dark" : null}
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
          min: Math.min(...contenido.map( item => (item.value))),
          max: Math.max(...contenido.map( item => (item.value))),
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
            //dataView: { readOnly: false },
            //restore: {},
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
                areaColor: "rgb(255, 215, 0, 0.4)",
              },
              label: {
                show: true,
              },
            },
            data: contenido,
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
