import { useRef, useState, useMemo, useCallback } from "react";
import boliviaJson from "../../data/Bolivia.json";
import ReactECharts, { type EChartsOption } from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import "../../data/dark.js";
import { useThemeContext } from "../../context";
import Loading from "../Loading.js";
import { useNavigate } from "react-router-dom";
import type { ECElementEvent } from "echarts";
import type { ReceivedForm } from "../../types";


type EChartsGeoJSON = {
  type: "FeatureCollection";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any[];
};

interface contenidoItem {
  name: string;
  results: Record<string, number>;
}

interface contenidoItemWithTotal extends contenidoItem {
  winner: string | undefined;
  total: number;
  value: number;
}
interface GeoChartProps {
  contenido: contenidoItem[];
  receivedForm: ReceivedForm;
}

const GeoChart = ({ contenido, receivedForm }: GeoChartProps) => {
  const { isDark } = useThemeContext();
  const chartRef = useRef(null);

  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const colorPalette = useMemo(
    () => [
      "#3182bd",
      "#de2d26",
      "#EE6666",
      "#FAC858",
      "#73C0DE",
      "#3BA272",
      "#FC8452",
      "#9A60B4",
      "#EA7CCC",
    ],
    []
  );

  useMemo(() => {
    registerMap("Bolivia", boliviaJson as EChartsGeoJSON);
  }, []);

  const getKeyWithMaxValue = useCallback((obj: Record<string, number>) => {
    if (!obj || Object.keys(obj).length === 0) return undefined;
    return Object.entries(obj).reduce((maxEntry, currentEntry) =>
      currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry
    )[0];
  }, []);

  const dataKeys = useMemo(() => {
    return contenido.length > 0 ? Object.keys(contenido[0].results) : [];
  }, [contenido]);

  const mapData: contenidoItemWithTotal[] = useMemo(() => {
    return contenido.map((item) => {
      const winner = getKeyWithMaxValue(item.results);
      const totalResoluciones = Object.values(item.results).reduce(
        (sum, val) => sum + val,
        0
      );

      return {
        name: item.name,
        value: dataKeys.indexOf((winner || "").toLowerCase()),
        results: item.results,
        winner,
        total: totalResoluciones,
      };
    });
  }, [contenido, dataKeys, getKeyWithMaxValue]);

  const mapDataIndex = useMemo(() => {
    const index: { [key: string]: contenidoItemWithTotal } = {};
    for (const item of mapData) {
      index[item.name] = item;
    }
    return index;
  }, [mapData]);

  const pieData = useMemo(() => {
    if (!selectedDepartment)
      return { title: "Seleccione un departamento", data: [] };
    const departmentData = contenido.find(
      (item) => item.name === selectedDepartment
    );
    if (!departmentData)
      return { title: "Departamento no encontrado", data: [] };

    return {
      title: selectedDepartment,
      data: dataKeys
        .map((key) => ({ name: key, value: departmentData.results[key] || 0 }))
        .filter((item) => item.value > 0),
    };
  }, [selectedDepartment, contenido, dataKeys]);

  const tooltipFormatter = useCallback(
    (params: contenidoItemWithTotal) => {
      const state = mapDataIndex[params.name];
      if (!state) return params.name;
      return `
        <div style="padding: 8px;">
          <strong>${state.name}</strong><br/>
          Categoría dominante: <strong>${state.winner}</strong><br/>
        </div>
      `;
    },
    [mapDataIndex]
  );

  const mapOption: EChartsOption = useMemo(
    () => ({
      title: {
        text: "Desglose Comparativo de Resoluciones",
        subtext: "Tribunal Supremo de Justicia - Bolivia",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: isDark ? "#fff" : "#333",
        },
        subtextStyle: {
          fontSize: 12,
          color: isDark ? "#ccc" : "#666",
        },
      },
      color: colorPalette,
      visualMap: {
        show: false,
        min: 0,
        max: Math.max(dataKeys.length - 1, 0),
        inRange: { color: colorPalette },
      },
      tooltip: {
        trigger: "item",
        showDelay: 0,
        transitionDuration: 0.2,
        backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)",
        borderColor: isDark ? "#555" : "#ccc",
        textStyle: {
          color: isDark ? "#fff" : "#333",
        },
        formatter: tooltipFormatter,
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "top",
        iconStyle: {
          borderColor: isDark ? "#fff" : "#333",
        },
        feature: {
          saveAsImage: {
            title: "Guardar imagen",
            name: "mapa_resoluciones_bolivia",
          },
          restore: { title: "Restaurar" },
        },
      },
      series: [
        {
          name: "Resoluciones",
          type: "map",

          roam: "move",
          silent: false,
          map: "Bolivia",
          projection: {
            project: (point: [number, number]) => geoMercator()(point),
            unproject: (point: [number, number]) => {
              const mercator = geoMercator();
              return typeof mercator.invert === "function"
                ? mercator.invert(point)
                : undefined;
            },
          },
          label: {
            show: false, // Oculta etiquetas por defecto
          },
          itemStyle: {
            borderColor: isDark ? "#444" : "#999",
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              areaColor: "rgba(255, 215, 0, 0.6)",
              borderWidth: 2,
              borderColor: "#FFD700",
            },
            label: {
              show: true,
              fontSize: 12,
              fontWeight: "bold",
              color: "#000",
            },
          },
          select: {
            itemStyle: {
              areaColor: "rgba(255, 215, 0, 0.4)",
            },
          },
          data: mapData,
        },
      ],
    }),
    [mapData, dataKeys, colorPalette, isDark, tooltipFormatter]
  );

  const pieOption: EChartsOption = useMemo(
    () => ({
      title: {
        text: "Distribución Detallada",
        subtext: pieData.title,
        left: "center",
        textStyle: {
          fontSize: 16,
          color: isDark ? "#fff" : "#333",
        },
        subtextStyle: {
          fontSize: 14,
          color: isDark ? "#ccc" : "#666",
        },
      },
      tooltip: {
        trigger: "item",
        backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)",
        borderColor: isDark ? "#555" : "#ccc",
        textStyle: {
          color: isDark ? "#fff" : "#333",
        },
        formatter: "{a}<br/>{b}: {c} resoluciones ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: 10,
        top: "middle",
        data: dataKeys,
        textStyle: {
          color: isDark ? "#fff" : "#333",
        },
      },
      color: colorPalette,
      series: [
        {
          name: "Distribución",
          type: "pie",
          radius: ["45%", "75%"],
          center: ["60%", "50%"],
          avoidLabelOverlap: true,

          label: {
            show: pieData.data.length > 0 && pieData.data.length <= 6,
            position: "outside",
            formatter: "{b}\n{d}%",
            fontSize: 12,
            color: isDark ? "#fff" : "#333",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: pieData.data.length <= 6,
            lineStyle: {
              color: isDark ? "#666" : "#999",
            },
          },
          data: pieData.data,
          animationType: "fade",
          animationEasing: "quadraticOut",
        },
      ],
    }),
    [pieData, dataKeys, colorPalette, isDark]
  );

  const handleMapClick = useCallback((event: ECElementEvent) => {
    if (event.name) {
      setSelectedDepartment((prev) =>
        prev === event.name ? null : event.name
      );
    }
  }, []);
  const irAAnalisis = () => {
    navigate("/analisis-avanzado/", {
      state: { params: receivedForm },
    });
  };

  const generarSerie = () => {
    navigate(`/serie-temporal/${receivedForm.nombre}`, {
      state: { params: receivedForm },
    });
  };



  if (!Array.isArray(contenido) || contenido.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Estadísticas Generales
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-xl text-blue-600 dark:text-blue-400">
                {contenido.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Departamentos
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-green-600 dark:text-green-400">
                0
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Total Resoluciones
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-purple-600 dark:text-purple-400">
                0
              </div>
              <div className="text-gray-600 dark:text-gray-400">Categorías</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-orange-600 dark:text-orange-400">
                0
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Promedio/Depto
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            💡 <strong>Instrucciones:</strong> Haga clic en cualquier
            departamento del mapa para ver su distribución detallada en el
            gráfico circular.
            {selectedDepartment && (
              <span className="block mt-1">
                Mostrando datos de: <strong>{selectedDepartment}</strong>
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#100C2A] rounded-xl border border-gray-300 dark:border-gray-800 shadow-lg overflow-hidden h-[600px]">
            <Loading />
          </div>

          <div className="bg-white dark:bg-[#100C2A] rounded-xl border border-gray-300 dark:border-gray-800 shadow-lg overflow-hidden h-[600px]">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-row flex-wrap gap-2 items-center justify-center p-4 mb-4">
            <button
              onClick={() => irAAnalisis()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-600 to-red-octopus-600 hover:from-pink-700 hover:to-red-octopus-800 shadow-md transition-all"
            >
              ir a Análisis X-Y
            </button>
            <button
              onClick={() => generarSerie()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-md transition-all"
            >
              ir a Serie de Tiempo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Estadísticas Generales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-xl text-blue-600 dark:text-blue-400">
              {contenido.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Departamentos
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-green-600 dark:text-green-400">
              {mapData
                .reduce((sum, item) => sum + item.total, 0)
                .toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Total Resoluciones
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-purple-600 dark:text-purple-400">
              {dataKeys.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Categorías</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-orange-600 dark:text-orange-400">
              {Math.round(
                mapData.reduce((sum, item) => sum + item.total, 0) /
                  contenido.length
              ).toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Promedio/Depto
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          💡 <strong>Instrucciones:</strong> Haga clic en cualquier departamento
          del mapa para ver su distribución detallada en el gráfico circular.
          {selectedDepartment && (
            <span className="block mt-1">
              Mostrando datos de: <strong>{selectedDepartment}</strong>
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#100C2A] rounded-xl border border-gray-300 dark:border-gray-800 shadow-lg overflow-hidden">
          <ReactECharts
            theme={isDark ? "dark" : undefined}
            option={mapOption}
            style={{ height: "600px", width: "100%" }}
            onEvents={{ click: handleMapClick }}
            opts={{ renderer: "canvas" }} // Rendimiento mejorado
          />
        </div>

        <div className="bg-white dark:bg-[#100C2A] rounded-xl border border-gray-300 dark:border-gray-800 shadow-lg overflow-hidden">
          <ReactECharts
            ref={chartRef}
            theme={isDark ? "dark" : undefined}
            option={pieOption}
            style={{ height: "600px", width: "100%" }}
            opts={{ renderer: "canvas" }}
          />
        </div>
      </div>
    </div>
  );
};

export default GeoChart;
