import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import dark from "../data/dark.js";
import { useThemeContext } from "../context/themeProvider.jsx";
export const OptionChart = ({
  dataset,
  chartType,
  isMultiVariable,
  border = true,
  handleClick = () => {
    console.log("Click en gráfico");
  },
}) => {
  // Configuraciones para una variable
  const singleVariableConfigs = {
    bar: {
      title: {
        text: "Ventas Mensuales - Barras",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      dataset: {
        source: dataset,
      },
      xAxis: {
        type: "category",
        axisLabel: { rotate: 45 },
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#667eea" },
              { offset: 1, color: "#764ba2" },
            ]),
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    },

    line: {
      title: {
        text: "Ventas Mensuales - Líneas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: { trigger: "axis" },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          type: "line",
          smooth: true,
          itemStyle: { color: "#667eea" },
          lineStyle: { width: 3 },
          symbol: "circle",
          symbolSize: 8,
        },
      ],
    },

    pie: {
      title: {
        text: "Distribución de Ventas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      dataset: {
        source: dataset,
      },
      series: [
        {
          type: "pie",
          radius: "60%",
          center: ["50%", "60%"],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    },

    scatter: {
      title: {
        text: "Ventas Mensuales - Dispersión",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          type: "scatter",
          symbolSize: 15,
          itemStyle: { color: "#667eea" },
        },
      ],
    },

    area: {
      title: {
        text: "Ventas Mensuales - Área",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: { trigger: "axis" },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          type: "line",
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(102, 126, 234, 0.8)" },
              { offset: 1, color: "rgba(102, 126, 234, 0.1)" },
            ]),
          },
          itemStyle: { color: "#667eea" },
          lineStyle: { width: 2 },
        },
      ],
    },
  };

  // Configuraciones para dos variables
  const dualVariableConfigs = {
    stackedBar: {
      title: {
        text: "Ventas por Canal - Barras Apiladas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "value" },
      yAxis: { type: "category" },
      series: [
        {
          name: "Ventas Online",
          type: "bar",
          stack: "total",
          itemStyle: { color: "#667eea" },
        },
        {
          name: "Ventas Tienda",
          type: "bar",
          stack: "total",
          itemStyle: { color: "#764ba2" },
        },
      ],
    },

    stackedColumn: {
      title: {
        text: "Ventas por Canal - Columnas Apiladas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Ventas Online",
          type: "bar",
          stack: "total",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#667eea" },
              { offset: 1, color: "#667eea80" },
            ]),
          },
        },
        {
          name: "Ventas Tienda",
          type: "bar",
          stack: "total",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#764ba2" },
              { offset: 1, color: "#764ba280" },
            ]),
          },
        },
      ],
    },

    groupedColumn: {
      title: {
        text: "Ventas por Canal - Columnas Agrupadas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Ventas Online",
          type: "bar",
          itemStyle: { color: "#667eea" },
        },
        {
          name: "Ventas Tienda",
          type: "bar",
          itemStyle: { color: "#764ba2" },
        },
      ],
    },

    multiLine: {
      title: {
        text: "Tendencias de Ventas - Líneas Múltiples",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: { trigger: "axis" },
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Ventas Online",
          type: "line",
          smooth: true,
          itemStyle: { color: "#667eea" },
          lineStyle: { width: 3 },
          symbol: "circle",
          symbolSize: 8,
        },
        {
          name: "Ventas Tienda",
          type: "line",
          smooth: true,
          itemStyle: { color: "#764ba2" },
          lineStyle: { width: 3 },
          symbol: "diamond",
          symbolSize: 8,
        },
      ],
    },

    stackedArea: {
      title: {
        text: "Ventas Acumuladas - Áreas Apiladas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: { trigger: "axis" },
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      dataset: {
        source: dataset,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Ventas Online",
          type: "line",
          stack: "total",
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#667eea80" },
              { offset: 1, color: "#667eea20" },
            ]),
          },
          itemStyle: { color: "#667eea" },
        },
        {
          name: "Ventas Tienda",
          type: "line",
          stack: "total",
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#764ba280" },
              { offset: 1, color: "#764ba220" },
            ]),
          },
          itemStyle: { color: "#764ba2" },
        },
      ],
    },

    polar: {
      title: {
        text: "Ventas por Canal - Gráfico Polar",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: { trigger: "axis" },
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      dataset: {
        source: dataset,
      },
      polar: { radius: [30, "70%"] },
      radiusAxis: { type: "category" },
      angleAxis: { type: "value", startAngle: 0 },
      series: [
        {
          name: "Ventas Online",
          type: "bar",
          coordinateSystem: "polar",
          itemStyle: { color: "#667eea" },
        },
        {
          name: "Ventas Tienda",
          type: "bar",
          coordinateSystem: "polar",
          itemStyle: { color: "#764ba2" },
        },
      ],
    },

    radar: {
      title: {
        text: "Comparación de Ventas - Gráfico Radar",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {},
      legend: {
        data: ["Ventas Online", "Ventas Tienda"],
        top: "10%",
      },
      radar: {
        indicator: [
          { name: "Enero", max: 250 },
          { name: "Febrero", max: 250 },
          { name: "Marzo", max: 250 },
          { name: "Abril", max: 250 },
          { name: "Mayo", max: 250 },
          { name: "Junio", max: 250 },
        ],
      },
      series: [
        {
          name: "Ventas por Canal",
          type: "radar",
          data: [
            {
              value: [120, 200, 150, 180, 170, 210],
              name: "Ventas Online",
              itemStyle: { color: "#667eea" },
              areaStyle: { color: "#667eea40" },
            },
            {
              value: [80, 120, 110, 140, 130, 160],
              name: "Ventas Tienda",
              itemStyle: { color: "#764ba2" },
              areaStyle: { color: "#764ba240" },
            },
          ],
        },
      ],
    },

    donut: {
      title: {
        text: "Distribución Total de Ventas",
        left: "center",
        textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle",
      },
      series: [
        {
          name: "Ventas Totales",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["60%", "50%"],
          data: [
            {
              value: 1030,
              name: "Ventas Online",
              itemStyle: { color: "#667eea" },
            },
            {
              value: 740,
              name: "Ventas Tienda",
              itemStyle: { color: "#764ba2" },
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    },
  };

  const [option, setOption] = useState(null);
  // Actualizar gráfico cuando cambian las configuraciones
  useEffect(() => {
    updateChart();
  }, [dataset, chartType, isMultiVariable]);

  const updateChart = () => {
    if (!chartType) return;

    const configs = isMultiVariable
      ? singleVariableConfigs
      : dualVariableConfigs;
    const config = configs[chartType];

    if (config) {
      setOption(config, true);
    }
  };
  const { isDark } = useThemeContext();
  return (
    <div
      className={`p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] h-[500px] md:h-[700px] ${
        border ? "border shadow-lg border-gray-300 dark:border-gray-800" : ""
      }`}
    >
      <ReactECharts
        key={JSON.stringify(option)}
        option={option}
        theme={isDark ? "dark" : undefined}
        style={{ height: "100%", width: "100%" }}
        onEvents={{
          click: handleClick,
        }}
      />
    </div>
  );
};
