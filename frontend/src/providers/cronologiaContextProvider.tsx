import React, { useEffect, useState, type FormEvent } from "react";
import { CronologiaContext } from "../context/cronologiaContext";
import type {
  AutoSupremo,
  ContextProviderProps,
  DatosArray,
  DatosArrayForm,
  Facetas,
  Nodos,
} from "../types";
import type { SearchField, SimpleSearchFormData } from "../types/search";
import { useLocation, useNavigate } from "react-router-dom";
import { JurisprudenciaService, ResolucionesService } from "../services";
import { toast } from "react-toastify";
import { filterForm, obtenerFacetas } from "../utils/filterForm";
import { useVariablesContext } from "../context";

export interface ResultadosBusqueda {
  descriptor: string;
  cantidad: number;
}

export interface CronologiaContextType {
  clearData: () => void;
  currentID: number | null;
  setCurrentID: React.Dispatch<React.SetStateAction<number | null>>;
  arbol: Nodos[];
  setArbol: React.Dispatch<React.SetStateAction<Nodos[]>>;
  facetas: Facetas;
  resoluciones: AutoSupremo[];
  // Pagination
  lastPage: number;
  actualPage: number;
  pageCount: number;
  totalCount: number;
  searchType: boolean;
  setSearchType: React.Dispatch<React.SetStateAction<boolean>>;
  formData: DatosArray;
  setFormData: React.Dispatch<React.SetStateAction<DatosArray>>;
  searchFields: SearchField[];
  setSearchFields: React.Dispatch<React.SetStateAction<SearchField[]>>;
  selector: Facetas;
  setSelector: React.Dispatch<React.SetStateAction<Facetas>>;
  selectedOptions: SimpleSearchFormData;
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<SimpleSearchFormData>
  >;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;
  pdfBlob: Blob | null;
  errorBusqueda: string;
  vaciarNodo: () => void;
  resultados: ResultadosBusqueda[];
  setResultados: React.Dispatch<React.SetStateAction<ResultadosBusqueda[]>>;
  search: (e: FormEvent) => Promise<void>;
  actualizarNodos: (descriptor: string) => Promise<void>;
  obtenerCronologia: () => Promise<void>;
  isLoading: boolean;

  obtenerCronologiabyIds: () => Promise<void>;
  removeItem: <K extends keyof DatosArray>(
    nombre: K,
    value: DatosArray[K] extends (infer U)[] ? U : number | string
  ) => void;
  clearList: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  selectAll: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  handleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  advancedSearch: (page: number) => Promise<void>;
  obtenerResoluciones: (page: number) => Promise<void>;
  limite: number;
  handlePage: (page: number) => number;
  descargarBaseDatos: () => Promise<void>;
  advancedSearchBusqueda: (page: number) => Promise<void>;
  obtenerResolucionesBusqueda: (page: number) => Promise<void>;
  obtenerCronologiaBusqueda: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
  searchNodes: boolean;
  setSearchNodes: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CronologiaContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [currentID, setCurrentID] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = useVariablesContext();

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const [path, setPath] = useState<string>("");
  const [arbol, setArbol] = useState<Nodos[]>([]);

  const [facetas, setFacetas] = useState<Facetas>({} as Facetas);
  const [resoluciones, setResoluciones] = useState<AutoSupremo[]>([]);

  const [lastPage, setLastPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  const [searchType, setSearchType] = useState(false); // false = simple, true = avanzada

  const [formData, setFormData] = useState<DatosArray>({});

  const [isLoading, setIsLoading] = useState(false);

  const [searchFields, setSearchFields] = useState<SearchField[]>([]);

  const [selector, setSelector] = useState<Facetas>({} as Facetas);

  const [selectedOptions, setSelectedOptions] = useState<SimpleSearchFormData>(
    {} as SimpleSearchFormData
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [busqueda, setBusqueda] = useState<string>("");

  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [resultados, setResultados] = useState<ResultadosBusqueda[]>([]);

  const [searchNodes, setSearchNodes] = useState<boolean>(false);
  const limite = 40;

  const clearData = () => {
    setCurrentID(null);
    setArbol([]);
    setFacetas({} as Facetas);
    setResoluciones([]);
    setLastPage(1);
    setActualPage(1);
    setPageCount(1);
    setTotalCount(1);
    setSearchType(false);
    setFormData({});
    setSearchFields([]);
    setSelector({} as Facetas);
    setSelectedOptions({} as SimpleSearchFormData);
    setSelectedIds([]);
    setBusqueda("");
  };

  const vaciarNodo = () => {
    setArbol([]);
    setCurrentID(null);
  };

  const descargarBaseDatos = async () => {
    try {
      const response = await JurisprudenciaService.importExcel({
        ids: selectedIds,
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "base-de-datos.xlsx"; // Set your desired filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  const obtenerCronologia = async () => {
    if (isLoading) {
      return;
    }
    if (arbol.length <= 0) {
      toast.error("Seleccione una materia primero", { toastId: "samed" });
      return;
    }
    const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");

    const validatedData = filterForm({
      tema_id: arbol[arbol.length - 1].id,
      descriptor: nombresTemas,
    });
    setIsLoading(true);
    JurisprudenciaService.obtenerCronologia(validatedData)
      .then(({ data }) => {
        const pdfBlob = new Blob([data], {
          type: "application/pdf",
        });
        setPdfBlob(pdfBlob);
        navigate("/cronojuridicas/resultados");
      })
      .catch(async (error) => {
        const text = await error.response.data.text(); // convierte Blob → string
        const json = JSON.parse(text);
        if (json.message) {
          toast.error(json.message, { toastId: "samed" });
          return;
        }
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
        if (error.response?.status === 429) {
          toast.error("Demasiadas solicitudes. Por favor, intente más tarde.", {
            toastId: "samed",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actualizarNodos = async (descriptor: string) => {
    try {
      JurisprudenciaService.actualizarNodo({
        busqueda: descriptor,
      })
        .then(({ data }) => {
          if (data) {
            setArbol(data.nodos);
            setCurrentID(data.last);
            setResultados([]);
          }
        })
        .catch(({ err }) => {
          console.error("Existe un error " + err);
        });
    } catch (error: unknown) {
      let message = "Ocurrió un error";
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-expect-error: We are checking for response property
        message = error.response?.data?.error || message;
      }
      console.error("Error fetching data:", message);
      console.error("Error :", error);
    }
  };

  const search = async (e: FormEvent) => {
    // if (!checkSearch(busqueda)) {
    //   return;
    // }
    e.preventDefault();
    try {
      const nombresTemas = arbol.map(({ nombre }) => nombre).join(" / ");

      const validatedData = filterForm({
        busqueda: busqueda,
        ...(searchNodes ? { descriptor: nombresTemas } : {}),
      });
      JurisprudenciaService.busquedaRapida(validatedData)
        .then(({ data }) => {
          if (data) {
            setResultados(data);
            setErrorBusqueda("");
          }
        })
        .catch(({ err }) => {
          console.error("Existe un error " + err);
          setErrorBusqueda("No se encontraron resultados");
          setResultados([]);
        });
    } catch (error: unknown) {
      let message = "Ocurrió un error";
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-expect-error: We are checking for response property
        message = error.response?.data?.error || message;
      }
      console.error("Error fetching data:", message);
      console.error("Error :", error);
    }
  };

  const advancedSearch = async (page: number = 1) => {
    if (Object.keys(searchFields).length < 1) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda", {
        toastId: "samed",
      });
      return;
    }
    if (isLoading) {
      toast.warning("Ya se está realizando una búsqueda", { toastId: "samed" });
      return;
    }
    setIsLoading(true);

    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    if (validPage === 1) {
      setActualPage(1);
    }

    const validatedData = filterForm(searchFields);
    const validatedFilters = filterForm(formData);

    setResoluciones([]);
    JurisprudenciaService.busquedaAvanzada({
      filtros: {
        ...validatedData,
      },
      ...validatedFilters,

      page: validPage,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          setResoluciones(response.data.data);
          setLastPage(response.data.last_page);
          setPageCount(response.data.last_page);

          setFacetas(
            obtenerFacetas(response.data.facets, (data as Facetas) || {})
          );
          setTotalCount(response.data.total);
        } else {
          toast.warning("No existen datos", { toastId: "samed" });
        }
      })
      .catch((error: unknown) => {
        console.error("Error fetching data:", error);
        setResoluciones([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const obtenerCronologiabyIds = async () => {
    if (selectedIds.length <= 0) {
      toast.error("Debe agregar resoluciones", { toastId: "samed" });
      return;
    }

    const validatedData = filterForm({
      ids: selectedIds,
      ...formData,
    });
    setIsLoading(true);
    JurisprudenciaService.obtenerCronologiabyIds(validatedData)
      .then(({ data }) => {
        const pdfBlob = new Blob([data], {
          type: "application/pdf",
        });
        setPdfBlob(pdfBlob);
        navigate("/cronojuridicas/resultados");
      })
      .catch(async (error) => {
        const text = await error.response.data.text(); // convierte Blob → string
        const json = JSON.parse(text);
        if (json.message) {
          toast.error(json.message, { toastId: "samed" });
          return;
        }

        const message = error.response?.data?.message || "Ocurrió un error";
        console.error("Error fetching data:", message);

        if (error.response?.status === 429) {
          toast.error(message, { toastId: "samed" }); // usamos el mensaje real del backend
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const obtenerResoluciones = async (page = 1) => {
    if (!selectedOptions.busqueda || !selectedOptions.campo) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda", {
        toastId: "samed",
      });
      return;
    }
    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    const validatedData = filterForm({
      page: validPage,
      ...selectedOptions,
      strategy: false,
      ...formData,
    });

    setResoluciones([]);
    setLastPage(1);
    setPageCount(1);
    setTotalCount(1);

    JurisprudenciaService.obtenerResoluciones(validatedData as DatosArrayForm)
      .then((response) => {
        if (response.data.data.length > 0) {
          setResoluciones(response.data.data);
          setFacetas(
            obtenerFacetas(response.data.facets, (data as Facetas) || {})
          );
          setLastPage(response.data.last_page);
          setPageCount(response.data.last_page);
          setTotalCount(response.data.total);
        } else {
          toast.warning("No existen datos", { toastId: "samed" });
        }
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      });
  };
  const handlePage = (page: number) => {
    const selectedPage = Math.min(page, lastPage);
    setActualPage(page);
    return selectedPage;
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newID = Number(e.target.value);

    setSelectedIds((prev) => {
      if (prev.includes(newID)) {
        // Eliminar el ID
        return prev.filter((id) => id !== newID);
      } else {
        if (selectedIds.length >= limite) {
          toast.error(
            `No puede seleccionar más de ${limite} resoluciones. Por favor, deseleccione algunas antes de continuar.`
          );
          return prev;
        }
        // Agregar el ID
        return [...prev, newID];
      }
    });
  };

  const selectAll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const disponiblesIds = resoluciones.map((item) =>
      Number(item.resolution_id)
    );
    const nuevasAAgregar = disponiblesIds.filter(
      (id) => !selectedIds.includes(id)
    );
    const capacidadRestante = limite - selectedIds.length;

    if (capacidadRestante <= 0) {
      toast.error("Ya alcanzaste el límite de resoluciones seleccionadas", {
        toastId: "samed",
      });
      return;
    }

    const idsAAgregar = nuevasAAgregar.slice(0, capacidadRestante);
    setSelectedIds((prev) => {
      const allIds = new Set([...prev, ...idsAAgregar]);
      return Array.from(allIds); // evita duplicados
    });
  };

  const clearList = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedIds((prev) =>
      prev.filter(
        (id) => !resoluciones.some((item) => Number(item.resolution_id) === id)
      )
    );
  };

  const removeItem = <K extends keyof DatosArray>(
    nombre: K,
    value: DatosArray[K] extends (infer U)[] ? U : number | string
  ) => {
    console.log("Removing item:", nombre, value);
    setFormData((prev) => {
      const newFormData = { ...prev };
      const current = newFormData[nombre];
      if (current) {
        const selectedIds = current.filter(
          (id) => id !== value
        ) as DatosArray[K];
        if ((selectedIds ?? []).length > 0) {
          newFormData[nombre] = selectedIds;
        } else {
          delete newFormData[nombre];
        }
      }
      return newFormData;
    });
  };

  const obtenerResolucionesBusqueda = async (page: number = 1) => {
    if (Object.keys(selectedOptions).length < 1) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda", {
        toastId: "samed",
      });
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    if (validPage === 1) {
      setActualPage(1);
    }

    const validatedData = filterForm({
      ...selectedOptions,
      ...searchFields,
      ...formData,
    });
    setResoluciones([]);
    ResolucionesService.buscarResoluciones({
      ...validatedData,
      page: validPage,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          setResoluciones(response.data.data);
          setLastPage(response.data.last_page);
          setPageCount(response.data.last_page);
          setFacetas(
            obtenerFacetas(response.data.facets, (data as Facetas) || {})
          );
          setTotalCount(response.data.total);
        } else {
          toast.warning("No existen datos", { toastId: "samed" });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setResoluciones([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const obtenerCronologiaBusqueda = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (selectedIds.length <= 0) {
      toast.error("Debe agregar resoluciones", { toastId: "samed" });
      return;
    }

    const validatedData = filterForm({
      ids: selectedIds,
    });
    setIsLoading(true);
    ResolucionesService.obtenerCronologiabyIds(validatedData)
      .then(({ data }) => {
        const pdfBlob = new Blob([data], {
          type: "application/pdf",
        });

        setPdfBlob(pdfBlob);
        navigate("/cronojuridicas/resultados");
      })
      .catch(async (error) => {
        const text = await error.response.data.text(); // convierte Blob → string
        const json = JSON.parse(text);
        if (json.message) {
          toast.error(json.message, { toastId: "samed" });
          return;
        }
        if (error.response?.status === 403) {
          toast.error("No tiene permiso para realizar esta acción", {
            toastId: "samed",
          });
        }
        if (error.response?.status === 429) {
          toast.error("Demasiadas solicitudes. Por favor, intente más tarde.", {
            toastId: "samed",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const advancedSearchBusqueda = async (page: number = 1) => {
    if (Object.keys(searchFields).length < 1) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda", {
        toastId: "samed",
      });
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    if (validPage === 1) {
      setActualPage(1);
    }

    const validatedData = filterForm(searchFields);
    const validatedFilters = filterForm(formData);
    setResoluciones([]);
    ResolucionesService.busquedaAvanzada({
      filtros: {
        ...validatedData,
      },
      ...validatedFilters,

      page: validPage,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          setResoluciones(response.data.data);
          setLastPage(response.data.last_page);
          setPageCount(response.data.last_page);
          setFacetas(
            obtenerFacetas(response.data.facets, (data as Facetas) || {})
          );
          setTotalCount(response.data.total);
        } else {
          toast.warning("No existen datos", { toastId: "samed" });
        }
      })
      .catch((error: unknown) => {
        console.error("Error fetching data:", error);
        setResoluciones([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const valor: CronologiaContextType = {
    clearData,
    currentID,
    setCurrentID,
    pdfBlob,
    arbol,
    setArbol,
    facetas,
    resoluciones,
    lastPage,
    actualPage,
    pageCount,
    totalCount,
    searchType,
    setSearchType,
    formData,
    setFormData,
    searchFields,
    setSearchFields,
    selector,
    setSelector,
    selectedOptions,
    setSelectedOptions,
    selectedIds,
    setSelectedIds,
    busqueda,
    setBusqueda,

    errorBusqueda,
    vaciarNodo,
    resultados,
    search,
    actualizarNodos,
    obtenerCronologia,
    setResultados,
    isLoading,

    obtenerCronologiabyIds,
    removeItem,
    clearList,
    selectAll,
    handleCheckbox,
    advancedSearch,
    obtenerResoluciones,
    limite,
    handlePage,
    descargarBaseDatos,
    advancedSearchBusqueda,
    obtenerResolucionesBusqueda,
    obtenerCronologiaBusqueda,
    searchNodes,
    setSearchNodes,
  };

  useEffect(() => {
    const prev = path;
    if (
      location.pathname !== "/cronojuridicas/resultados" &&
      location.pathname !== "/cronojuridicas/resolucion/:id"
    ) {
      setPath(location.pathname);
    }
    if (
      prev !== location.pathname &&
      location.pathname !== "/cronojuridicas/resultados" &&
      location.pathname !== "/cronojuridicas/resolucion/:id"
    ) {
      clearData();
    }
  }, [location, path]);

  return (
    <CronologiaContext.Provider value={valor}>
      {children}
    </CronologiaContext.Provider>
  );
};
