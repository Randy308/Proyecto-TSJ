import { useEffect, useState } from "react";
import { FaRegCircle } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import { JurisprudenciaService } from "../../services";
import {
  filterAtributte,
  filterForm,
  filterParams,
  filterTitle,
  obtenerFacetas,
  titulo,
} from "../../utils/filterForm";
import { useVariablesContext } from "../../context/variablesContext";
import Filtros from "../../components/Filtros";
import PortalButton from "../../components/modal/PortalButton";
import Paginate from "../../components/tables/Paginate";
import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import { IoMdClose } from "react-icons/io";
import AsyncButton from "../../components/AsyncButton";
import { useIcons } from "../../components/icons/Icons";
import type {
  DatosArray,
  DatosArrayForm,
  FiltroBusqueda,
  Facetas,
  Faceta,
  Resolucion,
  Variables,
  ListaData,
} from "../../types";
import SimpleSearchForm from "./SimpleSearchForm";
import MultiSearch from "../../components/MultiSearch";
import type { SearchField, SimpleSearchFormData } from "../../types/search";

interface Resultado {
  descriptor: string;
  id: number;
  nro_resolucion: string;
  periodo: string;
  ratio: string;
  resolution_id: string;
  restrictor: string;

  nro_expediente?: string;
  fecha_emision?: string;

  departamento?: string;
  sala?: string;
  magistrado?: string;
  forma_resolucion?: string;
  proceso?: string;
  demandante?: string;
  demandado?: string;
  maxima?: string;
  sintesis?: string;
  contenido?: string;

  tipo_resolucion: string;
}

interface TerminoBusqueda {
  cantidad: string;
  descriptor: string;
  descriptor_id: string;
  root_id: string;
}

const CronologiasAvanzadas = () => {
  const { data } = useVariablesContext();
  const limite = 40;
  const [isLoading, setIsLoading] = useState(false);

  const [descriptor, setDescriptor] = useState<number | null>(null);
  const [descriptorName, setDescriptorName] = useState<string>("");
  const [facetas, setFacetas] = useState<Facetas>({} as Facetas);
  const [searchType, setSearchType] = useState(false); // false = simple, true = avanzada
  const [formData, setFormData] = useState<DatosArray>({});

  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] = useState<SimpleSearchFormData>(
    {} as SimpleSearchFormData
  );

  const [lastPage, setLastPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [selector, setSelector] = useState<Facetas>({} as Facetas);
  const [totalCount, setTotalCount] = useState(1);
  const [resoluciones, setResoluciones] = useState<Resultado[]>([]);

  const { removeAllIcon, checkAllIcon } = useIcons();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const [busqueda, setBusqueda] = useState<string>("");
  const [resultados, setResultados] = useState<TerminoBusqueda[]>([]);

  const [searchFields, setSearchFields] = useState<SearchField[]>([]);
  const advancedSearch = async (page: number = 1) => {
    if (Object.keys(searchFields).length < 1) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda");
      return;
    }
    if (isLoading) {
      console.log("Ya se está realizando una búsqueda");
      return;
    }
    setIsLoading(true);

    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    if (validPage === 1) {
      setActualPage(1);
    }

    const validatedData = filterForm(searchFields);
    const validatedFilters = filterForm(formData);
    console.log("Datos validados:", { ...validatedData, ...validatedFilters });

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
          const { proceso_facet } = response.data.facets;
          console.log("Facetas recibidas:", proceso_facet);

          setFacetas(
            obtenerFacetas(response.data.facets, (data as Facetas) || {})
          );
          setTotalCount(response.data.total);
        } else {
          toast.warning("No existen datos");
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

  const checkSearch = (valor: string) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s'"’-]+$/;

    if (regex.test(valor) || valor === "") {
      return true;
    } else {
      return false;
    }
  };
  const actualizarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (checkSearch(valor)) {
      setBusqueda(valor);
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
    }
  };

  const agregarResoluciones = (item: TerminoBusqueda) => {
    setDescriptor(Number.parseInt(item.descriptor_id));
    setDescriptorName(item.descriptor);
    //setMateria(Number.parseInt(item.root_id));
    setResultados([]);
    setFormData((prev) => ({
      ...prev,
      ["materia"]: [Number.parseInt(item.root_id)],
    }));
    //obtenerResoluciones()
  };

  const obtenerCronologia = async () => {
    if (selectedIds.length <= 0) {
      toast.error("Debe agregar resoluciones");
      return;
    }

    const validatedData = filterForm({
      descriptor: descriptor,
      ids: selectedIds,
      ...formData,
    });
    setIsLoading(true);
    JurisprudenciaService.obtenerCronologiabyIds(validatedData)
      .then(({ data }) => {
        console.log(data);
        const pdfBlob = new Blob([data], {
          type: "application/pdf",
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        navigate("/Jurisprudencia/Cronologias/Resultados", {
          state: { pdfUrl: pdfUrl },
        });
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const searchDescriptors = async (checked: boolean) => {
    if (!checkSearch(busqueda)) {
      return;
    }
    if (checked) {
      obtenerResoluciones();
      return;
    }
    if (busqueda.length < 1) {
      setErrorBusqueda("Debe ingresar un término de búsqueda");
      return;
    }

    const validatedData = filterForm({
      busqueda: busqueda,
    });
    try {
      JurisprudenciaService.searchTermino(validatedData)
        .then(({ data }) => {
          if (data.length > 0) {
            setResultados(data);
            setErrorBusqueda("");
          } else {
            setErrorBusqueda("No se encontraron resultados");
            setResultados([]);
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
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

  const obtenerResoluciones = async (page = 1) => {
    if (!selectedOptions.busqueda || !selectedOptions.campo) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda");
      return;
    }
    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    const validatedData = filterForm({
      page: validPage,
      ...selectedOptions,
      descriptor: descriptor,
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
          toast.warning("No existen datos");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      });
  };
  const handlePageClick = (page: number) => {
    const selectedPage = Math.min(page, lastPage);

    setActualPage(page);
    if (searchType) {
      advancedSearch(selectedPage);
    } else {
      obtenerResoluciones(selectedPage);
    }
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
      toast.error("Ya alcanzaste el límite de resoluciones seleccionadas");
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

  useEffect(() => {
    setSelector(filterParams(formData, (data as Variables) || {}));

    if (searchType) {
      if (Object.keys(searchFields).length < 1) {
        console.warn("Debe seleccionar al menos un campo de búsqueda");
        return;
      }
      advancedSearch(1);
    } else {
      if (Object.keys(selectedOptions).length < 1) {
        console.warn("Debe seleccionar al menos un campo de búsqueda");
        return;
      }
      obtenerResoluciones(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, formData]);

  return (
    <div id="cronologia-container" className="sm:p-4 sm:m-4 m-2 p-2">
      <div className="header-container">
        <div>
          <div className="sm:mx-auto container max-w-7xl p-1 md:p-3 border-2 rounded-lg my-4">
            <p className="text-bold text-2xl md:text-3xl text-center my-4 titulo font-bold text-black dark:text-white">
              Generación de Cronojurídicas
            </p>

            {searchType ? (
              <MultiSearch
                type="jurisprudencia"
                searchFields={searchFields}
                setSearchFields={setSearchFields}
                advancedSearch={advancedSearch}
              />
            ) : (
              <SimpleSearchForm
                busqueda={busqueda}
                setFormData={setSelectedOptions}
                setBusqueda={setBusqueda}
                searchDescriptors={searchDescriptors}
                actualizarInput={actualizarInput}
              />
            )}

            <div className="p-0 m-2 md:p-2 md:m-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onClick={() => setSearchType(!searchType)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Busqueda Avanzada
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          {errorBusqueda.length > 0 && (
            <div
              id="alert-2"
              className="flex items-center p-4 mb-4 text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <FaInfo className="shrink-0 w-4 h-4" />
              <div className="ms-3 text-sm font-medium">{errorBusqueda}</div>
            </div>
          )}
        </div>
      </div>
      {descriptor && descriptorName && (
        <div className="py-4 flex items-center justify-end gap-4 flex-wrap">
          <div className="text-sm flex flex-row items-center flex-wrap gap-2">
            <span className="text-black dark:text-white">Descriptor:</span>
            <div
              onClick={() => {
                setDescriptor(null);
                setDescriptorName("");
              }}
              className="bg-white group flex gap-4 items-center justify-between hover:cursor-pointer rounded-lg p-2 font-bold m-4 border hover:border-red-500 text-xs dark:bg-gray-500"
            >
              <span>{descriptorName}</span>
              <IoMdClose className="group-hover:text-red-500" />
            </div>
          </div>
        </div>
      )}
      {selectedIds && selectedIds.length > 0 && (
        <div className="py-4 flex items-center justify-end gap-4 flex-wrap">
          <div className="text-sm flex flex-row items-center flex-wrap gap-2">
            <span className="text-black dark:text-white">
              Resoluciones seleccionadas:
            </span>
            <div
              onClick={() => setSelectedIds([])}
              className="bg-white group flex gap-4 items-center justify-between hover:cursor-pointer rounded-lg p-2 font-bold m-4 border hover:border-red-500 text-xs dark:bg-gray-500"
            >
              <span>{selectedIds.length + "/" + limite} </span>
              <IoMdClose className="group-hover:text-red-500" />
            </div>
          </div>
          <AsyncButton
            asyncFunction={obtenerCronologia}
            name={"Obtener Resoluciones"}
            isLoading={isLoading}
            full={false}
          />
        </div>
      )}

      <div>
        <div className="mt-4 pt-4">
          {resultados && resultados.length > 0 ? (
            <>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-md p-3 my-2">
                <span>
                  La búsqueda genero:{" "}
                  {resultados.length > 1
                    ? resultados.length + " resultados"
                    : "un resultado"}
                </span>
                <span
                  onClick={() => setResultados([])}
                  className="cursor-pointer underline"
                >
                  Limpiar Resultados
                </span>
              </div>
              {resultados.map((item, index) => (
                <div
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 hover:dark:bg-gray-700 hover:bg-gray-200 rounded-md p-3 my-2 cursor-pointer transition-all ease-in-out duration-200"
                  key={index}
                  onClick={() => agregarResoluciones(item)}
                >
                  <span className="text-black font-semibold dark:text-white ">
                    {item.descriptor}
                  </span>
                  <span className="text-gray-600 text-sm dark:text-gray-400">
                    {item.cantidad}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-row flex-wrap gap-4">
              <div className="w-auto md:w-52">
                {Object.entries(facetas).map(([name, contenido]) => (
                  <Filtros
                    key={name}
                    nombre={name as FiltroBusqueda}
                    data={contenido as Faceta[]}
                    formData={formData}
                    setFormData={setFormData}
                  />
                ))}
              </div>
              <div className="md:flex-1">
                <>
                  {selector && Object.keys(selector).length > 0 && (
                    <div className="flex gap-4 items-center flex-wrap">
                      <span className="text-lg font-bold">Filtrado por:</span>
                      {Object.entries(selector).map(([name, contenido]) => (
                        <div
                          className="flex gap-4 items-center flex-wrap"
                          key={name}
                        >
                          <span className="uppercase text-xs font-bold">
                            {titulo(name)}:
                          </span>
                          <div className="flex gap-4 flex-wrap">
                            {contenido.map((item: ListaData, index: number) => (
                              <div
                                key={index}
                                className="text-xs p-1 rounded-md border hover:cursor-pointer border-gray-300 hover:border-red-400 flex gap-2 justify-between items-center group"
                                onClick={() =>
                                  removeItem(name as keyof DatosArray, item.id)
                                }
                              >
                                <span>{item.nombre}</span>
                                <IoMdClose className="group-hover:text-red-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {resoluciones.length > 0 ? (
                    <div className="mt-6">
                      <Paginate
                        handlePageClick={handlePageClick}
                        pageCount={pageCount}
                        actualPage={actualPage}
                        totalCount={totalCount}
                      >
                        <div className="relative overflow-x-auto space-y-4">
                          {/* Selector global */}
                          <div className="flex items-center gap-2 px-2">
                            <a
                              onClick={(e) => selectAll(e)}
                              className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center justify-between border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {checkAllIcon}
                              <span className="ms-2 text-xs">
                                Seleccionar todos
                              </span>
                            </a>
                            <a
                              onClick={(e) => clearList(e)}
                              className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                              {removeAllIcon}
                              <span className="ms-2 text-xs">
                                Quitar Selección
                              </span>
                            </a>
                          </div>

                          {/* Tarjetas */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {resoluciones.map((item, index) => (
                              <div
                                key={index}
                                className={`relative p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-md border-2 hover:shadow-lg transition ${
                                  selectedIds.includes(
                                    Number(item.resolution_id)
                                  )
                                    ? "border-blue-400 dark:border-blue-900"
                                    : "border-gray-100"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id={`checkbox-${item.resolution_id}`}
                                  value={item.resolution_id}
                                  checked={selectedIds.includes(
                                    Number(item.resolution_id)
                                  )}
                                  onChange={handleCheckbox}
                                  className="hidden peer"
                                  aria-label={`Seleccionar resolución ${item.nro_resolucion}`}
                                />
                                {selectedIds.includes(
                                  Number(item.resolution_id)
                                ) ? (
                                  <label
                                    htmlFor={`checkbox-${item.resolution_id}`}
                                    className="hover:cursor-pointer text-blue-700"
                                  >
                                    <FaCheckCircle className="h-7 w-7" />
                                  </label>
                                ) : (
                                  <label
                                    htmlFor={`checkbox-${item.resolution_id}`}
                                    className="hover:cursor-pointer text-gray-400 dark:text-gray-500"
                                  >
                                    <FaRegCircle className="h-7 w-7" />
                                  </label>
                                )}

                                {/* Botón de ver resolución */}
                                <div className="mt-2 flex justify-center text-center text-xl">
                                  <PortalButton
                                    withIcon={false}
                                    title="Auto Supremo"
                                    name={`${filterAtributte(
                                      String(item.tipo_resolucion),
                                      "tipo_resolucion",
                                      (data as Facetas) || {}
                                    )} Nº${filterTitle(item.nro_resolucion)}`}
                                    color="link"
                                    full={false}
                                    large={true}
                                    content={() => (
                                      <ResolucionTSJ
                                        id={Number(item.resolution_id)}
                                      />
                                    )}
                                  />
                                </div>

                                {Object.keys(item)
                                  .filter(
                                    (key) =>
                                      [
                                        "contenido",
                                        "demandante",
                                        "demandado",
                                        "sintesis",
                                        "maxima",
                                        "highlight",
                                        "precedente",
                                        "proceso",
                                        "ratio",
                                        "descriptor",
                                        "restrictor",
                                        "periodo",
                                      ].includes(key) &&
                                      item[key as keyof Resolucion]
                                  )
                                  .map((key) => (
                                    <div
                                      key={key}
                                      className="flex flex-col sm:flex-row sm:items-start"
                                    >
                                      <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[140px]">
                                        {titulo(key)}:
                                      </span>
                                      <div
                                        className="text-gray-600 text-sm dark:text-gray-400 mt-1"
                                        dangerouslySetInnerHTML={{
                                          __html: (
                                            item[key as keyof Resolucion] || ""
                                          ).toString(),
                                        }}
                                      />
                                    </div>
                                  ))}

                                {/* Información detallada */}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Paginate>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center">
                      No hay resoluciones para mostrar
                    </div>
                  )}
                </>
              </div>
            </div>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CronologiasAvanzadas;
