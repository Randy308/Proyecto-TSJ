import React from "react";
import boliviaJson from "../../../data/Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from 'd3-geo';
const EChart = () => {
  registerMap("Bolivia", boliviaJson);
  const projection = geoMercator();
  return (
    <ReactECharts
      option={{
        title: {
          text: "Estimaciones de Población de Bolivia",
          subtext: "Datos de INE Bolivia",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
        },
        visualMap: {
          left: "right",
          min: 500000,
          max: 10000000,
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
            name: "Población",
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
            data: [
              { name: "Cochabamba", value: 2000000 },
              { name: "Oruro", value: 500000 },
              { name: "Chuquisaca", value: 1200000 },
              { name: "Tarija", value: 600000 },
              { name: "La Paz", value: 2800000 },
              { name: "Beni", value: 500000 },
              { name: "Pando", value: 200000 },
              { name: "Santa Cruz", value: 3000000 },
              { name: "Potosí", value: 800000 },
            ],
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
