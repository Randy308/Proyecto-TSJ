import { useCallback, useEffect, useState } from "react";
import type {
  AnalisisData,
  ChartType,
  ContextProviderProps,
  Faceta,
  Facetas,
  FiltroAnalisis,
  FiltroNombre,
  ListaX,
  Registro,
  Variables,
} from "../types";
import { AnalisisContext, useVariablesContext } from "../context";
import { invertirXY, reducirArray } from "../utils/math";
import { ResolucionesService, StatsService } from "../services";
import { filterForm, filterFormData, filterParams } from "../utils/filterForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface AnalisisContextType {
  datos: AnalisisData;
  setDatos: React.Dispatch<React.SetStateAction<AnalisisData>>;
  chartType: ChartType;
  setChartType: React.Dispatch<React.SetStateAction<ChartType>>;
  pares: string[];
  setPares: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  names: FiltroNombre[];
  handlePair: (newPair: string, tipo?: string) => void;
  obtenerParametros: () => Promise<void>;
  invertirGrafico: () => void;
  columna: string | null;
  isMultiVariable: boolean;
  setIsMultiVariable: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerEstadisticas: () => Promise<void>;
  handleClick: (params: echarts.ECElementEvent) => void;
  setNames: React.Dispatch<React.SetStateAction<FiltroNombre[]>>;
  realizarAnalisis: () => Promise<void>;
  params: Facetas;
  tableData: Registro[];
  departamentos: Faceta[];
  setDepartamentos: React.Dispatch<React.SetStateAction<Faceta[]>>;
  periodos: Faceta[];
  setPeriodos: React.Dispatch<React.SetStateAction<Faceta[]>>;
  listaX: ListaX[];
  setId: React.Dispatch<React.SetStateAction<number[]>>;
  setListaX: React.Dispatch<React.SetStateAction<ListaX[]>>;
  procesados: string[];
  setProcesados: React.Dispatch<React.SetStateAction<string[]>>;
  updateParams: (variable: string) => Promise<void>;
  limite: number;
  groupByPeriodo?: boolean;
  groupByDepartamento?: boolean;
  setGroupByPeriodo?: React.Dispatch<React.SetStateAction<boolean>>;
  setGroupByDepartamento?: React.Dispatch<React.SetStateAction<boolean>>;
  clearData: () => void;
}

export const AnalisisContextProvider = ({ children }: ContextProviderProps) => {
  const { data } = useVariablesContext();
  const limite = 4;
  const navigate = useNavigate();
  const [id, setId] = useState<number[]>([]);
  const [groupByPeriodo, setGroupByPeriodo] = useState<boolean>(false);
  const [groupByDepartamento, setGroupByDepartamento] =
    useState<boolean>(false);
  const [datos, setDatos] = useState<AnalisisData>([]);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [pares, setPares] = useState<string[]>([]);
  const [isMultiVariable, setIsMultiVariable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState<FiltroNombre[]>([]);
  const [tableData, setTableData] = useState<Registro[]>([]);
  const [departamentos, setDepartamentos] = useState<Faceta[]>([]);
  const [periodos, setPeriodos] = useState<Faceta[]>([]);
  const [listaX, setListaX] = useState<ListaX[]>([]);
  const [columna, setColumna] = useState<FiltroNombre | null>(null);
  const [params, setParams] = useState<Facetas>({} as Facetas);
  const [procesados, setProcesados] = useState<string[]>([]);

  const clearData = () => {
    setDatos([]);
    setTableData([]);
    setNames([]);
    setPares([]);
    setColumna(null);
    setIsMultiVariable(false);
    setParams({} as Facetas);
    setProcesados([]);
    setListaX([]);
    setChartType("bar");
    setGroupByDepartamento(false);
    setGroupByPeriodo(false);
  };
  const handleClick = useCallback(
    (params: echarts.ECElementEvent) => {
      if (!columna) {
        return;
      }

      if (isMultiVariable) {
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
    [isMultiVariable]
  );

  const realizarAnalisis = async () => {
    setIsLoading(true);

    if (listaX.length === 0) {
      toast.warning("Debe seleccionar al menos una variable para el análisis.");
      setIsLoading(false);
      return;
    }
    const validatedData: Partial<FiltroAnalisis> = filterFormData({
      salas: id,
      departamentos: departamentos.map((item: Faceta) => Number(item.id)),
      periodos: periodos.map((item: Faceta) => String(item.nombre)),
    });

    const params: FiltroAnalisis = {
      filtros: { ...listaX },
      ...validatedData,
      //serie: "series-temporales",
      // mapa: "mapa",
    };
    if (groupByDepartamento) {
      params.mapa = "mapa";
    }
    if (groupByPeriodo) {
      params.serie = "series-temporales";
    }
    StatsService.getMultivariableSala(params)
      .then(({ data }) => {
        if (data.data.length > 0) {
          const nombres = data.names || [];
          setPares(nombres.slice(0, 2));
          if (nombres.length > 2) {
            setDatos(reducirArray(data.chart, nombres.slice(0, 2)));
          } else {
            setDatos(data.chart.length > 0 ? data.chart : []);
          }

          setNames(data.names || []);
          setIsMultiVariable(data.multiVariable);
          setTableData(data.data.length > 0 ? data.data : []);
        } else {
          toast.warning("No se encontraron datos para el análisis.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setChartType("bar");
        setIsLoading(false);
      });
  };

  const updateParams = async (variable: string) => {
    if (listaX.length >= limite) {
      return;
    }

    const validatedData = filterForm({
      salas: id,
      variable: variable,
      filtros: listaX,
      departamento: departamentos.map((item) => item.id),
      periodos: periodos.map((item) => String(item.nombre)),
    });
    ResolucionesService.actualizarFiltros(validatedData)
      .then((response) => {
        if (response.data) {
          setParams((prev) => ({
            ...prev,
            [variable]: response.data.resultado,
          }));
        }
      })
      .catch((err) => {
        console.log("Existe un error " + err);
        toast.error("Error al obtener los datos de análisis.");
        setParams((prev) => ({
          ...prev,
          [variable]: [],
        }));
      })
      .finally(() => {
        setProcesados((prev) => [...prev, variable]);
      });
  };
  const obtenerEstadisticas = async () => {
    setIsLoading(true);
    const validatedData = filterForm({
      salas: id,
      departamento: departamentos.map((item) => item.id),
      periodos: periodos.map((item) => String(item.nombre)),
    });

    ResolucionesService.realizarAnalisisSala(validatedData)
      .then((response) => {
        if (response.data) {
          const values =
            response.data.data.length > 0 ? response.data.data : [];
          setDatos(response.data.chart.length > 0 ? response.data.chart : []);
          setTableData(values);
          setPares(["Salas"]);
          setIsMultiVariable(false);
          setColumna(response.data.columna || null);
          obtenerParametros();
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

  const handlePair = (newPair: string, tipo = "normal") => {
    if (pares.includes(newPair)) {
      return;
    }
    if (pares.length < 2) {
      return;
    }
    if (tipo === "normal" || newPair === "fecha") {
      const newPares = [...pares.slice(1), newPair];
      if (newPares.length != 2) {
        return;
      }
      setPares(newPares);
      setDatos(reducirArray(tableData, newPares));
    } else if (tipo === "serie") {
      const newPares = ["fecha", newPair];
      setPares(newPares);
      setDatos(reducirArray(tableData, newPares));
    }
  };

  const obtenerParametros = async () => {
    const validatedData = filterForm({
      salas: id,
      departamento: departamentos.map((item) => item.id),
      periodos: periodos.map((item) => String(item.nombre)),
    });

    ResolucionesService.obtenerFiltrosEstadisticos(validatedData)
      .then((response) => {
        if (response.data) {
          setParams(filterParams(response.data, (data as Variables) || {}));
          setProcesados(Object.keys(response.data));
        }
      })
      .catch((err) => {
        console.log("Existe un error " + err);
      });
  };

  // const obtenerParametros = (periodos: string[], departamentos: string[]) => {
  //   const validatedData = filterForm({
  //     sala: id,
  //     departamento: departamentos,
  //     periodos: periodos,
  //   });

  //   ResolucionesService.obtenerFiltrosEstadisticos(validatedData)
  //     .then((response) => {
  //       if (response.data) {
  //         setParams(filterParams(response.data, (data as Variables) || {}));
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Existe un error " + err);
  //     });
  // };

  const invertirGrafico = () => {
    if (datos.length === 0) return;
    setDatos(invertirXY(datos));
  };

  useEffect(() => {
    if (id.length > 0) {
      obtenerEstadisticas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setProcesados([]);
  }, [listaX]);

  const valor: AnalisisContextType = {
    datos,
    setDatos,
    chartType,
    setChartType,
    setId,
    pares,
    setPares,
    isLoading,
    setIsLoading,
    isMultiVariable,
    setIsMultiVariable,
    names,
    obtenerEstadisticas,
    handleClick,
    setNames,
    invertirGrafico,
    realizarAnalisis,
    params,
    columna,
    tableData,
    departamentos,
    setDepartamentos,
    periodos,
    handlePair,
    setPeriodos,
    listaX,
    obtenerParametros,
    setListaX,
    updateParams,
    procesados,
    setProcesados,
    limite,
    groupByPeriodo,
    groupByDepartamento,
    setGroupByPeriodo,
    setGroupByDepartamento,
    clearData,
  };

  return (
    <AnalisisContext.Provider value={valor}>
      {children}
    </AnalisisContext.Provider>
  );
};
