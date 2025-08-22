import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "../../data/dark.js";
import { useAnalisisContext, useThemeContext } from "../../context/index.js";
import type { AnalisisData } from "../../types/index.js";
import { titulo } from "../../utils/filterForm.js";

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
    setPares,
    handlePair,
    invertirGrafico,
  } = useAnalisisContext();

  const [chartStyle, setChartStyle] = useState<"line" | "area">("line");
  const [option, setOption] = useState<echarts.EChartsOption>({});
  const { isDark } = useThemeContext();

  // Configuración dinámica
  function getDualChartConfig(dataset: AnalisisData): echarts.EChartsOption {
    const seriesCount = Math.max(dataset[0].length - 1, 1);

    return {
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
        top: 10,
        textStyle: { color: isDark ? "#F9FAFB" : "#374151" },
      },
      grid: { left: "3%", right: "3%", bottom: "5%", containLabel: true },
      dataset: { source: dataset },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLine: { lineStyle: { color: isDark ? "#9CA3AF" : "#374151" } },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: isDark ? "#9CA3AF" : "#374151" } },
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

  useEffect(() => {
    if (!isMultiVariable || dataset.length === 0) return;
    const configs = getDualChartConfig(dataset);
    if (configs) setOption(configs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, isDark, chartStyle]);

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pares.includes("fecha")) {
      const newPares = [...pares.slice(1), "fecha"];
      if (newPares.length === 2) {
        setPares(newPares);
        invertirGrafico();
      }
    }
    console.log("Pares actuales:", pares);
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
          key={JSON.stringify(option)}
          option={option}
          theme={isDark ? "dark" : undefined}
          style={{ height: "100%", width: "100%" }}
          onEvents={{
            click: handleClick,
          }}
        />
      </div>
    </div>
  );
};
