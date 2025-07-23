import Loading from "../../components/Loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SelectType } from "../components";
import AsyncButton from "../../components/AsyncButton";
import { ResolucionesService, StatsService } from "../../services";
import { useVariablesContext } from "../../context/variablesContext";
import {
  filterForm,
  filterFormData,
  filterParams,
  titulo,
} from "../../utils/filterForm";
import type {
  Facetas,
  AnalisisData,
  ListaX,
  ChartType,
  FiltroNombre,
  Variables,
  FiltroAnalisis,
  Registro,
} from "../../types";
import { OptionChart } from "../../components/OptionChart";
import Tab from "../../components/Tab";
import { TablaMultivariable } from "../../components/TablaMultivariable";
import { toast } from "react-toastify";
import Select from "../../components/Select";
import { invertirXY, reducirArray } from "../../utils/math";

const AnalisisBasico = () => {
  const { id } = useParams();

  const { data } = useVariablesContext();

  const [datos, setDatos] = useState<AnalisisData>([]);
  const [columna, setColumna] = useState<FiltroNombre | null>(null);
  const [params, setParams] = useState<Facetas>({} as Facetas);
  const [selected, setSelected] = useState<string>("bar");
  const [actual, setActual] = useState(true);
  const [pares, setPares] = useState<string[]>([]);
  const [multiVariable, setMultiVariable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState<FiltroNombre[]>([]);
  // const [searchParams, setSearchParams] = useState<SearchParams>();
  const [tableData, setTableData] = useState<Registro[]>([]);

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
          setDatos(values);
          setTableData(values);
          setColumna(response.data.tabla);
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
  const limite = 4;
  const [listaX, setListaX] = useState<ListaX[]>([]);

  const handlePair = (newPair: string) => {
    console.log("Nuevo par seleccionado:", newPair);
    if (pares.includes(newPair)) {
      return;
    }
    if (pares.length < 2) {
      return;
    }
    const newPares = [...pares.slice(1), newPair];
    if (newPares.length != 2) {
      return;
    }
    console.log("Pares seleccionados:", newPares);
    setPares(newPares);
    setDatos(reducirArray(tableData, newPares));
  };
  const realizarAnalisis = async () => {
    setIsLoading(true);

    const validatedData: Partial<FiltroAnalisis> = filterFormData({
      sala: id,
      departamento: departamentos,
      periodos: periodos,
    });

    const params: FiltroAnalisis = {
      filtros: { ...listaX },
      ...validatedData,
      serie: "series-temporales",
    };
    StatsService.getMultivariableSala(params)
      .then(({ data }) => {
        if (data) {
          const nombres = data.names || [];
          setPares(nombres.slice(0, 2));
          if (nombres.length > 2) {
            setDatos(reducirArray(data.chart, nombres.slice(0, 2)));
          } else {
            setDatos(data.chart.length > 0 ? data.chart : []);
          }

          setNames(data.names || []);
          setMultiVariable(data.multiVariable);
          setTableData(data.data.length > 0 ? data.data : []);
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

  const invertirGrafico = () => {
    if (datos.length === 0) return;
    setDatos(invertirXY(datos));
  };

  useEffect(() => {
    const receivedForm = location.state;
    const periodos = receivedForm?.periodo || [];
    const periodoArray = Array.isArray(periodos) ? periodos : [periodos];
    const departamentos = receivedForm?.departamento || [];
    setDepartamentos(departamentos);
    setPeriodos(periodoArray);
    obtenerEstadisticas(periodoArray, departamentos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 p-2 m-2 lg:grid-cols-5">
      <div className="p-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
        {columna && (
          <p className="text-black dark:text-white pb-4">
            Sala observada:
            <span className="italic font-bold capitalize"> {columna}</span>
          </p>
        )}

        <div></div>
        <div>
          <SelectType
            selected={selected}
            handleSelect={handleSelect}
            multiVariable={multiVariable}
          />
          <div>
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
            <div>
              {names && names.length > 2 && (
                <div className="flex flex-wrap justify-around gap-2 mb-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {" "}
                      Selecciona los pares a graficar:
                    </p>
                    {names.map((name) => (
                      <button
                        type="button"
                        onClick={() => handlePair(name)}
                        className={`p-2 rounded-lg text-white ${
                          pares.includes(name)
                            ? "bg-blue-600"
                            : "bg-blue-400 hover:bg-blue-500"
                        }`}
                        key={name}
                      >
                        {titulo(name)}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => invertirGrafico()}
                      className="p-2 bg-red-500 rounded-lg text-white"
                    >
                      Invertir grafico
                    </button>
                  </div>
                </div>
              )}
              <OptionChart
                dataset={datos}
                chartType={selected as ChartType}
                isMultiVariable={multiVariable}
                handleClick={handleClick}
              />
            </div>
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
