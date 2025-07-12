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
  handleClick: (params: echarts.ECElementEvent) => void;
}
export const OptionChart = ({
  dataset,
  chartType,
  isMultiVariable,
  border = true,
  handleClick,
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
    const seriesCount = Math.max(dataset[0].length - 1, 1); // quitamos la primera columna (categoría)

    switch (type) {
      case "stackedColumn":
        return {
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: { type: "value" },
          yAxis: { type: "category" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            stack: "total",
          })),
        };

      case "stackedBar":
        return {
          legend: {},
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: { type: "category" },
          yAxis: { type: "value" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            stack: "total",
          })),
        };

      case "column": {
        const barSeriesCount = Math.max(dataset[0].length - 1, 1);
        return {
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: { type: "value" },
          yAxis: { type: "category" },
          series: Array.from({ length: barSeriesCount }, () => ({
            type: "bar",
            seriesLayoutBy: "column",
          })),
        };
      }

      case "bar":
        return {
          legend: {},
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: { type: "category", axisLabel: { rotate: 40 } },
          yAxis: { gridIndex: 0 },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            seriesLayoutBy: "column",
          })),
        };

      case "multiLine":
        return {
          legend: {},
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
          xAxis: { type: "category" },
          yAxis: { type: "value" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
          })),
        };

      case "stackedArea":
        return {
          legend: {},
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
          xAxis: { type: "category" },
          yAxis: { type: "value" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "line",
            stack: "total",
            smooth: true,
            areaStyle: {},
          })),
        };

      case "polar":
        return {
          tooltip: { trigger: "axis" },
          legend: {},
          dataset: { source: dataset },
          radiusAxis: {},
          polar: {},
          angleAxis: {
            type: "category",
          },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            coordinateSystem: "polar",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          })),
        };

      case "radar": {
        const globalMax = Math.max(
          ...dataset.slice(1).flatMap((row) => row.slice(1).map(Number))
        );

        const indicators = dataset.slice(1).map((row) => ({
          name: String(row[0]),
          max: globalMax, // Puedes ajustar esto según el rango de valores
        }));

        const transposed = dataset[0].map((_, colIndex) =>
          dataset.map((row) => row[colIndex])
        );

        return {
          tooltip: {},
          legend: {},
          radar: {
            indicator: indicators,
          },
          dataset: {
            source: dataset,
          },
          series: [
            {
              name: "Budget vs spending",
              type: "radar",
              data: transposed.slice(1).map((row) => ({
                name: row[0],
                value: row.slice(1), // Puedes ajustar esto según el rango de valores
              })),
            },
          ],
        };
      }

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
      : getDualChartConfig(chartType as DualChartType, dataset);
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
