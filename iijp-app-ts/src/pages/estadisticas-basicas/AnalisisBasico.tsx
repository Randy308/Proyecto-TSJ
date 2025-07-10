import Loading from "../../components/Loading";
import SimpleChart from "../../components/charts/SimpleChart";
import TablaX from "../../components/tables/TablaX";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SwitchChart } from "../../components/charts/SwitchChart";
import Select from "../../components/Select";
import AsyncButton from "../../components/AsyncButton";
import { invertirXY } from "../../utils/math";
import { LuArrowLeftRight } from "react-icons/lu";
import { ResolucionesService } from "../../services";
import { useVariablesContext } from "../../context/variablesContext";
import { filterParams } from "../../utils/filterForm";
import { agregarTotalLista } from "../../utils/arrayUtils";
import type { ECElementEvent } from "echarts";
import type { Variable, AnalisisData, ListaX, ChartType } from "../../types";
import { OptionChart } from "../../components/OptionChart";
interface Columns {
  accessorKey: string;
  header: string;
}
const AnalisisBasico = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state?.data;
  const receivedForm = location.state?.validatedData;
  const [datos, setDatos] = useState<AnalisisData>([]);
  const [columna, setColumna] = useState(null);
  const [option, setOption] = useState({});
  const [params, setParams] = useState<Variable>({} as Variable);
  const [columns, setColumns] = useState<Columns[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [actual, setActual] = useState(true);
  const [multiVariable, setMultiVariable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useVariablesContext();

  const [tableData, setTableData] = useState<AnalisisData>([]);

  const memoizedParams = useMemo(() => params, [params]);
  const limite = useMemo(() => 1, []);
  const [listaX, setListaX] = useState<ListaX[]>([]);
  const [checkedX, setCheckedX] = useState(false);

  const createSeries = (length: number) => {
    const series = [];
    for (let index = 0; index < length; index++) {
      series.push({ type: "bar", seriesLayoutBy: "column" });
    }
    return series;
  };

  const handleChartTypeChange = (type: string) => {
    setSelected(type);
    setOption((prevOption) => SwitchChart(prevOption, type.toLowerCase()));
  };

  const updateCheck = () => {
    setCheckedX((change) => !change);
  };

  const realizarAnalisis = async () => {
    setIsLoading(true);

    const isMultiVariable = listaX.length > 0;

    const params = isMultiVariable
      ? { ...receivedForm, variableY: listaX[0].ids, nombreY: listaX[0].name }
      : {
          ...receivedForm,
        };

    const fetchStats = isMultiVariable
      ? ResolucionesService.realizarAnalisisXY(params)
      : ResolucionesService.realizarAnalisis(params);

    fetchStats
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          setDatos(data.data.length > 0 ? data.data : []);
          setMultiVariable(data.multiVariable);
          setTableData(
            data.data.length > 0 ? agregarTotalLista(data.data) : []
          );
          console.log("Datos de tabla:", data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setSelected("bar");
        setIsLoading(false);
      });
  };

  const invertirAxis = () => {
    setSelected("column");
    setOption((prevOption) => SwitchChart(prevOption, "column", true));
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
        }))
      );
    }
  }, [tableData]);

  useEffect(() => {
    if (datos && datos.length > 0) {
      setOption({
        legend: {},
        tooltip: { trigger: "item" },
        grid: { containLabel: true },
        dataset: { source: datos },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: { type: "category", boundaryGap: true },
        yAxis: {},
        series: createSeries(datos[0].length - 1),
      });
    }
  }, [datos]);

  useEffect(() => {
    if (receivedData === null || !Array.isArray(receivedData.data)) {
      navigate("/estadisticas-basicas");
    } else {
      const values = receivedData.data.length > 0 ? receivedData.data : [];
      setDatos(values);
      //setTableData(values);
      setTableData(agregarTotalLista(values));
      setColumna(receivedData.columna);
      setMultiVariable(receivedData.multiVariable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedData]);

  useEffect(() => {
    if (receivedForm) {
      ResolucionesService.obtenerFiltrosEstadisticos(receivedForm)
        .then((response) => {
          if (response.data) {
            setParams(filterParams(response.data, (data as Variable) || {}));
          }
        })
        .catch((err) => {
          console.log("Existe un error " + err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedForm]);

  const handleClick = useCallback(
    (params: ECElementEvent) => {
     
      if (multiVariable) {
        const newItem = {
          nameX: listaX[0].name,
          valueX: params.seriesName,
          nameY: columna,
          valueY: params.name,
        };

        console.log("Clicked on series:", newItem);
      } else {
        const newItem = {
          nameX: columna,
          valueX: params.name != "Cantidad" ? params.name : params.seriesName,
        };

        console.log("Clicked on series:", newItem);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiVariable]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 p-2 m-2 lg:grid-cols-5">
      <div className="p-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
        {columna && (
          <p className="text-black dark:text-white pb-4">
            Variable observada:
            <span className="italic font-bold capitalize"> {columna}</span>
          </p>
        )}
        <div>
          <div>
            <label
              htmlFor="charts"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tipo de gráficos
            </label>
            <select
              id="charts"
              value={selected}
              onChange={(e) => handleChartTypeChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option disabled defaultValue={""}>
                Elige un tipo de gráfico
              </option>
              <option value="bar">Barras</option>
              <option value="column">Columnas</option>
              <option value="area">Área</option>

              {multiVariable ? (
                <>
                  <option value="stacked-bar">Barras Apiladas</option>
                  <option value="stacked-column">Columnas Apiladas</option>
                </>
              ) : (
                <>
                  <option value="pie">Circular</option>
                  <option value="donut">Dona</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="inline-flex items-center flex-wrap-reverse cursor-pointer m-4">
              <input
                type="checkbox"
                checked={checkedX}
                onChange={() => updateCheck()}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>

              <span className="ms-3 text-xs font-medium text-gray-900 dark:text-gray-300">
                Cruce por una variable
              </span>
            </label>
          </div>
          <div className={` ${checkedX ? "" : "hidden"}  `}>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Variables
            </label>
            {memoizedParams && (
              <Select
                memoizedParams={memoizedParams}
                limite={limite}
                listaX={listaX}
                setListaX={setListaX}
              ></Select>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={() => invertirAxis()}
                className="inline-flex items-center text-white bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600  font-medium rounded-lg text-sm px-5 py-3 text-center"
              >
                <LuArrowLeftRight className="fill-current w-4 h-4 mr-2" />
                <span className="text-xs">Intercambio X-Y</span>
              </button>

              <AsyncButton
                name={"Analizar"}
                asyncFunction={realizarAnalisis}
                isLoading={isLoading}
                full={false}
              />
            </div>
          </div>
        </div>

        {datos && datos.length > 0 ? (
          <div className="max-w-sm mx-auto mt-4">
            <button
              onClick={() => setActual((prev) => !prev)}
              type="button"
              className="w-full mt-2 text-white bg-red-octopus-600 dark:bg-blue-600 hover:bg-red-octopus-800 hover:dark:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {actual ? "Mostrar Tabla " : "Mostrar Grafico"}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>

      {datos && datos.length > 0 ? (
        <div className="lg:col-span-4 md:col-span-3">
          {!actual ? (
            <TablaX data={tableData.slice(1)} columns={columns} />
            // <OptionChart dataset={datos} chartType={selected as ChartType} isMultiVariable={multiVariable} />
          ) : (
            <SimpleChart option={option} handleClick={handleClick} />
          )}
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default AnalisisBasico;
