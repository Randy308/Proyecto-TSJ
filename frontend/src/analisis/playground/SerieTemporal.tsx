import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { agregarTotalLista, filtrarLista } from "../../utils/arrayUtils";
import AnalisisChart from "./AnalisisChart";
import TablaX from "../../components/tables/TablaX";
import { invertirXY, obtenerEstadisticas } from "../../utils/math";
import {StatsService} from "../../services";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { toast } from "react-toastify";
import type { AnalisisData } from "../../types";
import type { EChartsOption } from "echarts-for-react";
import type { ECElementEvent } from "echarts";
type AccessorKey = string;

interface Column {
  accessorKey: AccessorKey;
  header: string;
}

const SerieTemporal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const receivedForm = location.state?.params;
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [data, setData] = useState<AnalisisData>([] as AnalisisData);

  const [tableData, setTableData] = useState<AnalisisData>([]);
  const [originalData, setOriginalData] = useSessionStorage<AnalisisData>(
    "serie",
    [] as AnalisisData
  );
  const [total, setTotal] = useSessionStorage("total-serie", 0);
  const [series, setSeries] = useState<EChartsOption["series"]>([]);
  const [show, setShow] = useState(true);

  const [columns, setColumns] = useState<Column[]>([]);
  const option: EChartsOption = {
    legend: {},
    tooltip: {
      trigger: "axis",
      showContent: false,
    },
    dataset: {
      source: data,
    },
    xAxis: { type: "category" },
    yAxis: { gridIndex: 0 },
    grid: { top: "55%" },
    series: [
      ...series,
      {
        type: "pie",
        id: "pie",
        radius: "30%",
        center: ["50%", "25%"],
        emphasis: {
          focus: "self",
        },
        label: {
          formatter: "{b}: {@2012} ({d}%)",
        },
        encode: {
          itemName: "nombre",
          value: "2012",
          tooltip: "2012",
        },
      },
    ],
  };

  const invertirTabla = () => {
    setTableData(invertirXY(tableData));
  };

  const handleClick = (event: ECElementEvent) => {
    if(event.componentSubType !== "line") return;
    setSelectedPeriodo(event.name);
  };

  const irAMapa = () => {
    if (receivedForm.nombre === "departamento") {
      toast.warning(
        "No se puede realizar un análisis por departamento, por favor seleccione una variable diferente."
      );
      return;
    }

    navigate("/mapa-estadistico/" + receivedForm.nombre, {
      state: { validatedData: receivedForm },
    });
  };

  const irAAnalisis = () => {
    navigate("/analisis-avanzado/", {
      state: { params: receivedForm },
    });
  };

  useEffect(() => {
    if (
      !receivedForm ||
      !Array.isArray(receivedForm.variable)
    ) {
      navigate("/analisis-avanzado");
    } else {
      generarSerie();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedForm]);

  const generarSerie = () => {
    if (originalData.length > 0) {
      console.log("Datos ya cargados, no se vuelve a cargar");
      return;
    }

    StatsService.getTimeSeries(receivedForm)
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          setOriginalData(data.data.length > 0 ? data.data : []);
          setTotal(data.total);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    setData(
      originalData.length > 0 ? filtrarLista(originalData, total, 0.1) : []
    );

    setTableData(
      originalData.length > 0 ? agregarTotalLista(originalData) : []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalData]);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const dataKeys = Object.keys(data).splice(1);

    setSeries(
      dataKeys.map(() => ({
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      }))
    );
  }, [data]);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const keys = tableData[0];
      setColumns(
        keys.map((item, index) => ({
          accessorKey: index.toString(),
          header: (String(item) as string)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          enableSorting: true,
        }))
      );
    }
  }, [tableData]);

  const { mean, stdDev } = useMemo(() => {
    const stats = obtenerEstadisticas(tableData);
    return {
      mean: stats.mean || 0,
      stdDev: stats.stdDev || 0,
    };
  }, [tableData]);
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-end gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-row flex-wrap gap-2 items-center justify-center p-4 mb-4">
            <button
              onClick={() => irAMapa()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 shadow-md transition-all"
            >
              ir a Mapa Geográfico
            </button>
            <button
              onClick={() => irAAnalisis()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-pink-600 to-red-octopus-600 hover:from-pink-700 hover:to-red-octopus-800 shadow-md transition-all"
            >
              ir a Análisis X-Y
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Estadísticas Generales
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            {originalData.length > 0 && (
              <div className="font-bold text-xl text-blue-600 dark:text-blue-400">
                {originalData[0].length - 1}
              </div>
            )}
            <div className="text-gray-600 dark:text-gray-400">Periodos</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-green-600 dark:text-green-400">
              {total.toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Total Resoluciones
            </div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-purple-600 dark:text-purple-400">
              {(originalData.length - 1).toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Categorías</div>
          </div>
          <div className="text-center">
            {tableData.length > 0 && (
              <div className="font-bold text-xl text-orange-600 dark:text-orange-400">
                {mean.toLocaleString()}
              </div>
            )}
            <div className="text-gray-600 dark:text-gray-400">Promedio</div>
          </div>
          <div className="text-center">
            {tableData.length > 0 && (
              <div className="font-bold text-xl text-orange-600 dark:text-orange-400">
                {stdDev.toLocaleString()}
              </div>
            )}
            <div className="text-gray-600 dark:text-gray-400">
              Desviación Estándar
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          💡 <strong>Instrucciones:</strong> Haga clic en cualquier periodo de
          la serie de tiempo para ver su distribución detallada en el gráfico
          circular.
          {selectedPeriodo && (
            <span className="block mt-1">
              Mostrando datos de: <strong>{selectedPeriodo}</strong>
            </span>
          )}
        </p>
      </div>
      <div className="grid mt-4 grid-cols-1 sm:grid-cols-4 md:grid-cols-5 px-4 gap-2">
        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg border-2 dark:border-gray-700 flex flex-col gap-4">
          <button
            onClick={() => setShow((prev) => !prev)}
            className="p-2 mt-4 rounded-lg text-white bg-red-octopus-600 hover:bg-red-octopus-800 sm:w-full"
          >
            {show ? "Ver Tabla" : "Ver gráfico"}
          </button>

          {!show && (
            <button
              onClick={() => invertirTabla()}
              className="p-2 rounded-lg text-white bg-red-octopus-600 hover:bg-red-octopus-800 sm:w-full"
            >
              Invertir tabla
            </button>
          )}
        </div>
        <div className="sm:col-span-3 md:col-span-4">
          {show ? (
            <AnalisisChart option={option} handleClick={handleClick} />
          ) : (
            <TablaX data={tableData.slice(1)} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SerieTemporal;
