import Loading from "../../components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/Select";
import AsyncButton from "../../components/AsyncButton";
import { ResolucionesService, StatsService } from "../../services";
import { useVariablesContext } from "../../context/variablesContext";
import { filterForm, filterParams } from "../../utils/filterForm";
import type {
  Facetas,
  AnalisisData,
  ListaX,
  ChartType,
  FiltroNombre,
  Variables,
  BaseData,
  FiltroAnalisis,
} from "../../types";
import { OptionChart } from "../../components/OptionChart";
import Tab from "../../components/Tab";
import { TablaMultivariable } from "../../components/TablaMultivariable";
import { toast } from "react-toastify";

const AnalisisBasico = () => {
  const { id } = useParams();

  const { data } = useVariablesContext();

  const [datos, setDatos] = useState<AnalisisData>([]);
  const [columna, setColumna] = useState<FiltroNombre | null>(null);
  const [params, setParams] = useState<Facetas>({} as Facetas);
  const [selected, setSelected] = useState<string>("bar");
  const [actual, setActual] = useState(true);
  const [multiVariable, setMultiVariable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [searchParams, setSearchParams] = useState<SearchParams>();
  const [tableData, setTableData] = useState<BaseData[]>([]);

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [periodos, setPeriodos] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const obtenerEstadisticas = async (
    periodo: string[],
    departamentos: string[]
  ) => {
    setIsLoading(true);
    const validatedData = filterForm({
      sala: id,
      departamento: departamentos,
      periodos: periodo,
    });

    ResolucionesService.realizarAnalisisSala(validatedData)
      .then((response) => {
        if (response.data) {
          const values =
            response.data.data.length > 0 ? response.data.data : [];
          console.log("Datos de análisis:", values);
          setDatos(values);
          setTableData(values);
          obtenerParametros(periodo, departamentos);
        }
      })
      .catch((err) => {
        console.log("Existe un error " + err);
        toast.error("Error al obtener los datos de análisis.");
        navigate("/analisis");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const memoizedParams = useMemo(() => params, [params]);
  const limite = useMemo(() => 3, []);
  const [listaX, setListaX] = useState<ListaX[]>([]);
  const [checkedX, setCheckedX] = useState(false);

  const updateCheck = () => {
    setCheckedX((change) => !change);
  };

  const realizarAnalisis = async () => {
    setIsLoading(true);

    const isMultiVariable = listaX.length > 1;

    const validatedData = filterForm({
      sala: id,
      departamento: departamentos,
      periodos: periodos,
    });

    const params: FiltroAnalisis = {
      filtros: { ...listaX },
      sala: id,
      serie:"series-temporales",
    };
    const fetchStats = StatsService.getMultivariableSala(params);

    // const params = isMultiVariable
    //   ? {
    //       ...validatedData,
    //       variable: listaX[0].ids,
    //       nombre: listaX[0].name,
    //       variableY: listaX[1].ids,
    //       nombreY: listaX[1].name,
    //     }
    //   : {
    //       ...validatedData,
    //       variable: listaX[0].ids,
    //       nombre: listaX[0].name,
    //     };

    // const fetchStats = isMultiVariable
    //   ? ResolucionesService.realizarAnalisisXY(params)
    //   : ResolucionesService.realizarAnalisis(params);

    fetchStats
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          setDatos(data.chart.length > 0 ? data.chart : []);
          setMultiVariable(data.multiVariable);
          setTableData(data.data.length > 0 ? data.data : []);
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

  const obtenerParametros = (periodos: string[], departamentos: string[]) => {
    const validatedData = filterForm({
      sala: id,
      departamento: departamentos,
      periodos: periodos,
    });

    ResolucionesService.obtenerFiltrosEstadisticos(validatedData)
      .then((response) => {
        if (response.data) {
          setParams(filterParams(response.data, (data as Variables) || {}));
        }
      })
      .catch((err) => {
        console.log("Existe un error " + err);
      });
  };

  const handleClick = useCallback(
    (params: echarts.ECElementEvent) => {
      if (!columna) {
        return;
      }

      if (multiVariable) {
        const newItem = {
          nameX: listaX[0].name,
          valueX: params.seriesName,
          nameY: columna,
          valueY: params.name,
        };

        console.log(newItem);
      } else {
        const newItem = {
          nameX: columna,
          valueX: params.name != "Cantidad" ? params.name : params.seriesName,
        };
        console.log(newItem);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiVariable]
  );

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelection = e.target.value;
    if (selected != newSelection) {
      setSelected(newSelection);
    }
  };

  useEffect(() => {
    const receivedForm = location.state;
    const periodos = receivedForm?.periodo || [];
    const periodoArray = Array.isArray(periodos) ? periodos : [periodos];
    const departamentos = receivedForm?.departamento || [];
    setDepartamentos(departamentos);
    setPeriodos(periodoArray);
    obtenerEstadisticas(periodoArray, departamentos);
  }, [location.state]);

  //   useEffect(() => {
  //   if (receivedForm) {
  //     ResolucionesService.obtenerFiltrosEstadisticos(receivedForm)
  //       .then((response) => {
  //         if (response.data) {
  //           setParams(filterParams(response.data, (data as Variables) || {}));
  //         }
  //       })
  //       .catch((err) => {
  //         console.log("Existe un error " + err);
  //       });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [receivedForm]);

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
          {/* <div>
            <button type="button" onClick={search}>
              Obtener resoluciones
            </button>
          </div> */}
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
              onChange={(e) => handleSelect(e)}
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
                  {/* <option value="area">Área</option>
                  <option value="scatter">Dispersión</option>
                  <option value="line">Lineas</option> */}
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
              <AsyncButton
                name={"Analizar"}
                asyncFunction={realizarAnalisis}
                isLoading={isLoading}
                full={false}
              />
            </div>
          </div>
        </div>
      </div>

      {datos && datos.length > 0 ? (
        <Tab actual={actual} setActual={setActual}>
          {actual ? (
            <TablaMultivariable records={tableData} />
          ) : (
            <OptionChart
              dataset={datos}
              chartType={selected as ChartType}
              isMultiVariable={multiVariable}
              handleClick={handleClick}
            />
          )}
        </Tab>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default AnalisisBasico;
