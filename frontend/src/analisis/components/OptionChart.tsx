import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "../../data/dark.js";
import { useAnalisisContext, useThemeContext } from "../../context/index.js";
import type {
  AnalisisData,
  DualChartType,
  SingleChartType,
} from "../../types/index.js";
import { ToolbarChart } from "./ToolbarChart.js";
import { titulo } from "../../utils/filterForm.js";
import { FaDownload } from "react-icons/fa";

export interface OptionChartProps {
  border?: boolean;
}
export const OptionChart = ({ border = false }: OptionChartProps) => {
  const {
    datos: dataset,
    chartType,
    isMultiVariable,
    pares,
    handleClick,
  } = useAnalisisContext();
  // Configuraciones para una variable
  function getChartOption(
    chartType: SingleChartType,
    dataset: AnalisisData,
    pares: string[] // variables seleccionadas
  ): echarts.EChartsOption {
    const commonGrid = {
      left: "6%",
      right: "4%",
      top: 120, // espacio para título
      bottom: 100, // espacio para descripción y leyenda
      containLabel: true,
    };

    // Configuración de leyenda común
    const commonLegend = {
      top: 80,
      textStyle: { color: isDark ? "#F9FAFB" : "#374151" },
    };

    switch (chartType) {
      case "bar":
        return {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
          },
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
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
          legend: commonLegend,
          grid: commonGrid,
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
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
          legend: commonLegend,
          grid: commonGrid,
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
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
          legend: commonLegend,
          grid: commonGrid,
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
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
          legend: commonLegend,
          grid: commonGrid,
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
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

          legend: commonLegend,
          grid: commonGrid,
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
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
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],

          legend: commonLegend,
          grid: commonGrid,
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
    dataset: AnalisisData,
    pares: string[],
    isDark: boolean = false
  ): echarts.EChartsOption {
    const seriesCount = Math.max(dataset[0].length - 1, 1); // quitamos la primera columna (categoría)

    // Título y descripción comunes

    // Configuración de grid común
    const commonGrid = {
      left: "6%",
      right: "4%",
      top: 120, // espacio para título
      bottom: 100, // espacio para descripción y leyenda
      containLabel: true,
    };

    // Configuración de leyenda común
    const commonLegend = {
      top: 80,
      textStyle: { color: isDark ? "#F9FAFB" : "#374151" },
    };

    switch (type) {
      case "stackedColumn":
        return {
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
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
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: {
            type: "category",
            axisLabel: { rotate: dataset[0].length > 7 ? 45 : 0 },
          },
          yAxis: { type: "value" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            stack: "total",
          })),
        };

      case "column":
        return {
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: { type: "value" },
          yAxis: { type: "category" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            seriesLayoutBy: "column",
          })),
        };

      case "bar":
        return {
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          dataset: { source: dataset },
          xAxis: { type: "category", axisLabel: { rotate: 40 } },
          yAxis: { type: "value" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            seriesLayoutBy: "column",
          })),
        };

      case "multiLine":
        return {
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
          xAxis: { type: "category", boundaryGap: false },
          yAxis: { type: "value" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "line",
            symbol: "circle",
            symbolSize: 8,
          })),
        };

      case "stackedArea":
        return {
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
          xAxis: { type: "category", boundaryGap: false },
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
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          grid: commonGrid,
          tooltip: { trigger: "axis" },
          dataset: { source: dataset },
          radiusAxis: {},
          polar: {},
          angleAxis: { type: "category" },
          series: Array.from({ length: seriesCount }, () => ({
            type: "bar",
            coordinateSystem: "polar",
            stack: "a",
            emphasis: { focus: "series" },
          })),
        };

      case "radar": {
        const globalMax = Math.max(
          ...dataset.slice(1).flatMap((row) => row.slice(1).map(Number))
        );
        const indicators = dataset.slice(1).map((row) => ({
          name: String(row[0]),
          max: globalMax,
        }));
        const transposed = dataset[0].map((_, colIndex) =>
          dataset.map((row) => row[colIndex])
        );
        return {
          title: [
            {
              text: `Cantidad de autos supremos agrupados por ${pares
                .map(titulo)
                .join(", ")}`,
              left: "center",
              top: 20,
              textStyle: { fontSize: 20 },
              subtextStyle: {
                color: "#175ce5",
                fontSize: 15,
                fontWeight: "bold",
              },
            },
            {
              text: "Fuente: Tribunal Supremo de Justicia. Bolivia",
              subtext: [
                `Variables seleccionadas: ${pares.map(titulo).join(", ")}`,
                `Categorías seleccionadas: ${dataset[0].slice(1).join(", ")}`,
                dataset
                  .slice(1)
                  .map((item) => item[0])
                  .join(", "),
              ].join("\n"),
              left: "left",
              bottom: 10,
              textStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
            },
          ],
          legend: commonLegend,
          radar: { indicator: indicators },
          dataset: { source: dataset },
          series: [
            {
              name: "Budget vs spending",
              type: "radar",
              data: transposed
                .slice(1)
                .map((row) => ({ name: row[0], value: row.slice(1) })),
            },
          ],
        };
      }

      default:
        throw new Error(`Tipo de gráfico no soportado: ${type}`);
    }
  }

  const [option, setOption] = useState<echarts.EChartsOption>({});

  const chartRef = useRef<ReactECharts>(null);
  const downloadImage = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      const dataURL = instance.getDataURL({
        type: "png", // "jpeg" o "svg" también son opciones
        pixelRatio: 2, // mayor calidad
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF", // fondo acorde al tema
      });

      // Crear un enlace para descargar
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "grafico.png";
      link.click();
    }
  };

  // Actualizar gráfico cuando cambian las configuraciones
  useEffect(() => {
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
      ? getChartOption(chartType as SingleChartType, dataset, pares)
      : getDualChartConfig(chartType as DualChartType, dataset, pares);
    if (configs) {
      setOption(configs);
    }
  };
  const { isDark } = useThemeContext();

  return (
    <div
      className={`p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] ${
        border ? "border shadow-lg border-gray-300 dark:border-0" : ""
      }`}
    >
      <ToolbarChart />

      <div className="p-2 m-2 rounded-xl bg-white dark:bg-[#100C2A] h-[500px] md:h-[700px]">
        <ReactECharts
          ref={chartRef}
          key={JSON.stringify(option)}
          option={option}
          theme={isDark ? "dark" : undefined}
          style={{ height: "100%", width: "100%" }}
          onEvents={{
            click: handleClick,
          }}
        />
      </div>
      <button
        onClick={downloadImage}
        className="mt-4 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-200 bg-gray-100 border-1 border-gray-600 text-gray-700 rounded"
      >
        <FaDownload />
        Descargar Gráfico
      </button>
    </div>
  );
};
