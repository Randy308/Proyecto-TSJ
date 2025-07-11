import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncButton from "../../components/AsyncButton";
import { useLocation, useNavigate } from "react-router-dom";
import { StatsService } from "../../services";
import TablaX from "../../components/tables/TablaX";
import Loading from "../../components/Loading";
import { useVariablesContext } from "../../context/variablesContext";
import Select from "../../components/Select";
import { invertirXY } from "../../utils/math";
import TerminoClave from "./TerminoClave";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { toast } from "react-toastify";
import { agregarTotalLista } from "../../utils/arrayUtils";
import type { AnalisisData, ChartType, ListaX, Variable } from "../../types";
import type { ECElementEvent } from "echarts";
import { OptionChart } from "../../components/OptionChart";

type AccessorKey = string;

interface Column {
  accessorKey: AccessorKey;
  header: string;
}

const AnalisisAvanzado = () => {
  const limite = useMemo(() => 2, []);
  const [listaX, setListaX] = useState<ListaX[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();
  const { data } = useVariablesContext();

  const [selected, setSelected] = useState<string | undefined>("bar");
  const [contenido, setContenido] = useSessionStorage<AnalisisData>(
    "analisis_xy",
    []
  );
  const [columns, setColumns] = useState<Column[]>([]);

  const [, setSerie] = useSessionStorage<AnalisisData>("serie", []);
  const [, setMapa] = useSessionStorage<AnalisisData>("mapa", []);

  const [actual, setActual] = useState(true);
  const [multiVariable, setMultiVariable] = useState(false);
  const [tableData, setTableData] = useState<AnalisisData>([]);

  const location = useLocation();

  const receivedForm = location.state?.params;

  const memoizedParams: Variable = useMemo(() => {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { periodo, ...rest } = data; // Remove 'periodo' if not needed
      return rest as Variable;
    }
    // Provide default empty arrays for all Variable properties
    return {
      departamento: [],
      sala: [],
      tipo_jurisprudencia: [],
      tipo_resolucion: [],
      forma_resolucion: [],
      magistrado: [],
      materia: [],
    };
  }, [data]);

  const handleChartTypeChange = (type: string) => {
    setSelected(type);
  };

  const invertirAxis = () => {
    setSelected("column");
    setTableData(invertirXY(tableData));
  };

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const keys = tableData[0];
      setColumns(
        keys.map((item, index) => ({
          accessorKey: index.toString(),
          header: String(item)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          enableSorting: true,
        }))
      );
    }
    console.log(tableData);
  }, [tableData]);

  ///end
  const getDatos = async () => {
    if (listaX.length === 0) {
      return;
    }
    setIsLoadingData(true); // Start loading

    const isMultiVariable = listaX.length > 1;

    const params = isMultiVariable
      ? {
          nombre: listaX[0].name,
          variable: listaX[0].ids,
          nombreY: listaX[1].name,
          variableY: listaX[1].ids,
        }
      : {
          nombre: listaX[0].name,
          variable: listaX[0].ids,
        };
    const fetchStats = isMultiVariable
      ? StatsService.getStatsXY(params)
      : StatsService.getStatsX(params);

    fetchStats
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          setContenido(data.data.length > 0 ? data.data : []);
          setMultiVariable(data.multiVariable);
          setTableData(
            data.data.length > 0 ? agregarTotalLista(data.data) : []
          );

          setMapa([]);
          setSerie([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setSelected("bar");
        setIsLoadingData(false);
      });
  };

  const generarSerie = () => {
    if (listaX.length === 0) {
      return;
    }
    const params = {
      nombre: listaX[0].name,
      variable: listaX[0].ids,
    };

    navigate(`/serie-temporal/${params.nombre}`, {
      state: { params },
    });
  };
  const memoizedJSX = useMemo(
    () => (
      <Select
        memoizedParams={memoizedParams}
        limite={limite}
        listaX={listaX}
        setListaX={setListaX}
      ></Select>
    ),
    [memoizedParams, limite, listaX]
  );

  const memoTerminoClave = useMemo(() => {
    return <TerminoClave setListaX={setListaX} listaX={listaX} />;
  }, [listaX]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoGetDatos = useMemo(() => getDatos, [listaX]);
  const irAMapa = () => {
    if (listaX.length === 0) {
      return;
    }
    const params = {
      nombre: listaX[0].name,
      variable: listaX[0].ids,
    };

    if (params.nombre === "departamento") {
      toast.warning(
        "No se puede realizar un análisis por departamento, por favor seleccione una variable diferente."
      );
      return;
    }

    navigate("/mapa-estadistico/" + params.nombre, {
      state: { validatedData: params },
    });
  };

  useEffect(() => {
    if (receivedForm && Array.isArray(receivedForm.variable)) {
      const newItem = {
        name: receivedForm.nombre,
        ids: receivedForm.variable,
      };

      setListaX([newItem]);

      if (contenido && contenido.length > 0) {
        return;
      }

      setIsLoadingData(true); // Start loading

      StatsService.getStatsX(receivedForm)
        .then(({ data }) => {
          console.log("Datos cargados desde API", data);
          if (data) {
            setContenido(data.data.length > 0 ? data.data : []);
            setMultiVariable(data.multiVariable);
            setTableData(
              data.data.length > 0 ? agregarTotalLista(data.data) : []
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    } else {
      setContenido([]);
      setMapa([]);
      setSerie([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedForm]);

  const handleClick = useCallback(
    (params: ECElementEvent) => {
      if (
        multiVariable &&
        params.seriesName !== "Cantidad" &&
        params.name !== "Cantidad"
      ) {
        const newItem = {
          nameX: listaX[0].name,
          valueX: params.name,
          nameY: listaX[1].name,
          valueY: params.seriesName,
        };

        console.log("Clicked on series:", newItem);
      } else if (
        params.seriesName === "Cantidad" ||
        params.name === "Cantidad"
      ) {
        const newItem = {
          nameX: listaX[0].name,
          valueX: params.name != "Cantidad" ? params.name : params.seriesName,
        };

        console.log("Clicked on series:", newItem);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiVariable]
  );

  return (
    <div className="p-4 space-y-4">
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
              onClick={() => generarSerie()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-md transition-all"
            >
              ir a Serie de Tiempo
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
          💡 <strong>Instrucciones:</strong> Seleccione una o dos{" "}
          <strong>categorías</strong> para generar el análisis estadístico.
          Puede agregar hasta <strong>6 variables</strong> por cada dimensión
          del análisis (X o Y).
          {listaX && listaX.length > 0 && (
            <span className="block mt-2">
              Muestras seleccionadas:{" "}
              <strong className="capitalize">
                {listaX.map((item) => item.name).join(", ")}
              </strong>
            </span>
          )}
        </p>
      </div>
      <div className="p-2 relative flex flex-col md:flex-row gap-4">
        <div className="p-2 md:w-[300px] border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
          {contenido && contenido.length > 0 && (
            <div className="px-4 mb-4">
              <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tipo de gráficos
              </div>
              <select
                id="charts"
                value={selected}
                onChange={(e) => handleChartTypeChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option disabled defaultValue={""}>
                  Elige un tipo de gráfico
                </option>
                {multiVariable ? (
                  <>
                    <option value="bar">Barras Agrupadas</option>
                    <option value="stackedBar">Barras Apiladas</option>
                    <option value="stackedColumn">Columnas Apiladas</option>
                    <option value="column">Columnas Agrupadas</option>
                    <option value="multiLine">Lineas Multiples</option>
                    <option value="stackedArea">Área Apilada</option>
                    <option value="polar">Polar</option>
                    <option value="radar">Radar</option>
                  </>
                ) : (
                  <>
                    <option value="bar">Barras</option>
                    <option value="column">Columnas</option>
                    <option value="area">Área</option>
                    <option value="scatter">Dispersión</option>
                    <option value="line">Lineas</option>
                    <option value="pie">Circular</option>
                    <option value="donut">Dona</option>
                  </>
                )}
              </select>
            </div>
          )}

          <div className={`overflow-y-auto max-h-[450px] flex-1`}>
            {memoizedParams && memoizedJSX}
            {memoTerminoClave}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 justify-end">
            <AsyncButton
              name={"Realizar analisis"}
              asyncFunction={memoGetDatos}
              isLoading={isLoadingData}
              full={true}
            />
            <div className="max-w-sm mx-auto mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setActual((prev) => !prev)}
                type="button"
                className="mt-2 text-white bg-gradient-to-r  dark:bg-blue-700 dark:to-blue-800 bg-red-octopus-500 hover:bg-red-octopus-700 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                {actual ? "Ver Tabla " : "Ver Grafico"}
              </button>
              <button
                type="button"
                onClick={() => invertirAxis()}
                className="mt-2 text-white bg-gradient-to-r  dark:bg-blue-700 dark:to-blue-800 bg-red-octopus-500 hover:bg-red-octopus-700 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Invertir Axis
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {contenido && contenido.length > 0 ? (
            <div className="col-span-3 grid grid-cols-1">
              {!actual ? (
                <TablaX data={tableData.slice(1)} columns={columns} />
              ) : (
                <OptionChart
                  dataset={contenido}
                  chartType={selected as ChartType}
                  isMultiVariable={multiVariable}
                  handleClick={handleClick}
                />
                //<SimpleChart option={option} handleClick={handleClick} />
                // <OptionChart
                //   dataset={data}
                //   chartType={selected}
                //   isMultiVariable={multiVariable}
                // />
              )}
            </div>
          ) : (
            <div className="h-full flex border-2 rounded-lg bg-white items-center">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalisisAvanzado;
