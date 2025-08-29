import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "../../data/dark.js";
import { useAnalisisContext, useThemeContext } from "../../context/index.js";
import type { AnalisisData } from "../../types/index.js";
import { titulo } from "../../utils/filterForm.js";
import { FaDownload } from "react-icons/fa";

interface OptionChartProps {
  border?: boolean;
}

export const Serie = ({ border = false }: OptionChartProps) => {
  const {
    datos: dataset,
    isMultiVariable,
    handleClick,
    names,
    pares,
    handlePair,
    invertirGrafico,
  } = useAnalisisContext();

  const chartRef = useRef<ReactECharts>(null);
  const [chartStyle, setChartStyle] = useState<"line" | "area">("line");
  const [option, setOption] = useState<echarts.EChartsOption>({});
  const { isDark } = useThemeContext();

  // Configuración dinámica
  function getDualChartConfig(dataset: AnalisisData): echarts.EChartsOption {
    const seriesCount = Math.max(dataset[0].length - 1, 1);

    return {
      title: [
        {
          text: "Cantidad de autos supremos por periodo",
          left: "center",
          top: 20, // margen superior para que no choque con el borde
          textStyle: { fontSize: 20 },
          subtextStyle: { color: "#175ce5", fontSize: 15, fontWeight: "bold" },
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
          subtextStyle: { fontSize: 12, color: "#666", lineHeight: 18 },
        },
      ],
      backgroundColor: "transparent",
      color: isDark
        ? ["#4ADE80", "#60A5FA", "#FACC15", "#F472B6"]
        : ["#2563EB", "#10B981", "#F59E0B", "#EF4444"],
      tooltip: {
        trigger: "axis",
        backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
        borderColor: isDark ? "#374151" : "#E5E7EB",
        textStyle: { color: isDark ? "#F9FAFB" : "#1F2937" },
      },
      legend: {
        top: 80, // subimos un poco la leyenda para que no choque con el título
        textStyle: { color: isDark ? "#F9FAFB" : "#374151" },
      },
      grid: {
        top: 150,
        bottom: 100, // más espacio para descripción y leyenda
        left: 60,
        right: 40,
        containLabel: true, // evita que labels del eje se corten
      },
      dataset: { source: dataset },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLine: { lineStyle: { color: isDark ? "#9CA3AF" : "#374151" } },
        axisLabel: {
          rotate: dataset[0].length > 7 ? 45 : 0, // rotar si muchas categorías
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: isDark ? "#9CA3AF" : "#374151" } },
        splitLine: {
          lineStyle: { type: "dashed", color: isDark ? "#4B5563" : "#E5E7EB" },
        },
      },
      series: Array.from({ length: seriesCount }, () => ({
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        areaStyle: chartStyle === "area" ? { opacity: 0.15 } : undefined,
      })),
    };
  }
  const invertir = () => {
    if (Array.isArray(dataset) && dataset.length > 0) {
      const firstItem = dataset[0];

      if (Array.isArray(firstItem)) {
        const periodos = firstItem.slice(1); // ✅ Solo si es un array
        const integerArray = periodos.map((str) => parseInt(String(str), 10));
        if (!integerArray.some(isNaN)) {
          invertirGrafico();
        }
      } else {
        console.warn("dataset[0] no es un array:", firstItem);
      }
    }
  };

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

  useEffect(() => {
    if (!isMultiVariable || dataset.length === 0) return;
    const configs = getDualChartConfig(dataset);
    if (configs) setOption(configs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, isDark, chartStyle]);

  useEffect(() => {
    invertir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pares.includes("fecha")) {
      handlePair("fecha", "serie");
      invertir();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pares]);

  if (!isMultiVariable || dataset.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          No hay datos para mostrar.
        </p>
      </div>
    );
  }
  return (
    <div
      className={`p-4 m-2 rounded-xl ${
        border ? "border shadow-lg" : ""
      } bg-white dark:bg-[#0F172A] transition`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Series Temporales
        </h2>

        {/* Toggle de estilo */}
        <button
          onClick={() => setChartStyle(chartStyle === "line" ? "area" : "line")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 shadow-md"
        >
          {chartStyle === "line" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="m140-100-60-60 300-300 160 160 284-320 56 56-340 384-160-160zm0-240-60-60 300-300 160 160 284-320 56 56-340 384-160-160z" />
              </svg>
              <span>Líneas múltiples</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M120-160v-520l160 120 200-280 200 160h160v520zm200-120 160-220 280 218v-318H652L496-725 298-447l-98-73v144z" />
              </svg>
              <span>Áreas apiladas</span>
            </>
          )}
        </button>
      </div>

      {/* Botones de variables */}
      {names && names.length > 2 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selecciona una variable a graficar:
          </p>
          <div className="flex flex-wrap gap-2">
            {names.map(
              (name: string) =>
                name !== "fecha" && (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handlePair(name, "serie")}
                    className={`px-4 py-2 rounded-lg text-white font-medium shadow-md transition-transform duration-200 ${
                      pares.includes(name)
                        ? "bg-blue-600 scale-105"
                        : "bg-blue-400 hover:bg-blue-500"
                    }`}
                  >
                    {titulo(name)}
                  </button>
                )
            )}
          </div>
        </div>
      )}

      {/* Gráfico */}
      <div className="h-[500px] md:h-[700px] rounded-lg overflow-hidden">
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
