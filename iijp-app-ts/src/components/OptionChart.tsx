import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "../data/dark.js";
import { useThemeContext } from "../context";
import type {
  AnalisisData,
  ChartType,
  DualChartType,
  SingleChartType,
} from "../types";

interface OptionChartProps {
  dataset: AnalisisData;
  chartType: ChartType;
  isMultiVariable: boolean;
  border?: boolean;
  handleClick?: () => void;
}
export const OptionChart = ({
  dataset,
  chartType,
  isMultiVariable,
  border = true,
  handleClick = () => {
    console.log("Click en gráfico");
  },
}: OptionChartProps) => {
  // Configuraciones para una variable
  function getChartOption(
    chartType: SingleChartType,
    dataset: AnalisisData
  ): echarts.EChartsOption {
    switch (chartType) {
      case "bar":
        return {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
          },
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          dataset: { source: dataset },
          xAxis: {
            type: "category",
            axisLabel: { rotate: 40 },
          },
          yAxis: { type: "value" },
          series: [
            {
              type: "bar",
              colorBy: "data",
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
        };

      case "line":
        return {
          title: {
            text: "Ventas Mensuales - Líneas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          legend: {},
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
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
        };

      case "pie":
        return {
          title: {
            text: "Distribución de Ventas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          legend: {},
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
          },
          dataset: { source: dataset },
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
        };

      case "scatter":
        return {
          title: {
            text: "Ventas Mensuales - Dispersión",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          legend: {},
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
          },
          dataset: { source: dataset },
          xAxis: { type: "category" },
          yAxis: { type: "value" },
          series: [
            {
              type: "scatter",
              symbolSize: 15,
              itemStyle: { color: "#667eea" },
            },
          ],
        };

      case "area":
        return {
          title: {
            text: "Ventas Mensuales - Área",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          legend: {},
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
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
        };

      case "column":
        return {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
          },
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },

          dataset: {
            source: dataset,
          },
          xAxis: { type: "value" },
          yAxis: { type: "category" },
          series: [
            {
              type: "bar",
              colorBy: "data",
              seriesLayoutBy: "column",
              barGap: "30%",
            },
          ],
        };

      case "donut":
        return {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
          },
          legend: {},
          dataset: { source: dataset },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
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
        };

      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  }

  function getDualChartConfig(
    type: DualChartType,
    dataset: AnalisisData
  ): echarts.EChartsOption {
    switch (type) {
      case "stackedBar":
        return {
          title: {
            text: "Ventas por Canal - Barras Apiladas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
          dataset: { source: dataset },
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
        };

      case "stackedColumn":
        return {
          title: {
            text: "Ventas por Canal - Columnas Apiladas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
          dataset: { source: dataset },
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
        };

      case "groupedColumn":
        return {
          title: {
            text: "Ventas por Canal - Columnas Agrupadas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
          dataset: { source: dataset },
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
        };

      case "multiLine":
        return {
          title: {
            text: "Tendencias de Ventas - Líneas Múltiples",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "axis" },
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
          dataset: { source: dataset },
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
        };

      case "stackedArea":
        return {
          title: {
            text: "Ventas Acumuladas - Áreas Apiladas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "axis" },
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
          dataset: { source: dataset },
          xAxis: { type: "category" },
          yAxis: { type: "value" },
          series: [
            {
              name: "Ventas Online",
              type: "line",
              stack: "total",
              smooth: true,
              itemStyle: { color: "#667eea" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#667eea80" },
                  { offset: 1, color: "#667eea20" },
                ]),
              },
            },
            {
              name: "Ventas Tienda",
              type: "line",
              stack: "total",
              smooth: true,
              itemStyle: { color: "#764ba2" },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#764ba280" },
                  { offset: 1, color: "#764ba220" },
                ]),
              },
            },
          ],
        };

      case "polar":
        return {
          title: {
            text: "Ventas por Canal - Gráfico Polar",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "axis" },
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
          dataset: { source: dataset },
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
        };

      case "radar":
        return {
          title: {
            text: "Comparación de Ventas - Gráfico Radar",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: {},
          legend: { data: ["Ventas Online", "Ventas Tienda"], top: "10%" },
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
        };

      case "donut":
        return {
          title: {
            text: "Distribución Total de Ventas",
            left: "center",
            textStyle: { fontSize: 18, fontWeight: "bold", color: "#333" },
          },
          tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
          legend: { orient: "vertical", left: "left", top: "middle" },
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
        };

      default:
        throw new Error(`Tipo de gráfico no soportado: ${type}`);
    }
  }

  const [option, setOption] = useState<echarts.EChartsOption>({});
  // Actualizar gráfico cuando cambian las configuraciones
  useEffect(() => {
    console.log("Actualizando gráfico con dataset:", chartType);
    if (dataset.length === 0) {
      console.warn("Dataset vacío, no se puede actualizar el gráfico.");
      return;
    }
    if (!chartType) {
      console.warn(
        "Tipo de gráfico no especificado, no se puede actualizar el gráfico."
      );
      return;
    }
    updateChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartType, dataset]);

  const updateChart = () => {
    const configs: echarts.EChartsOption = !isMultiVariable
      ? getChartOption(chartType as SingleChartType, dataset)
      : getDualChartConfig("stackedColumn", dataset);
    console.log(configs);
    if (configs) {
      setOption(configs);
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
