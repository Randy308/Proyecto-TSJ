import { useEffect, useMemo, useState } from "react";
import { FaRegCircle } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import JurisprudenciaService from "../../services/JurisprudenciaService";
import { filterAtributte, filterForm, filterParams, filterTitle } from "../../utils/filterForm";
import { useVariablesContext } from "../../context/variablesContext";
import Filtros from "../../components/Filtros";
import PortalButton from "../../components/modal/PortalButton";
import { MdClear } from "react-icons/md";
import Paginate from "../../components/tables/Paginate";
import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import { IoMdClose, IoMdRefresh } from "react-icons/io";
import AsyncButton from "../../components/AsyncButton";
import { useIcons } from "../../components/icons/Icons";

const CronologiasAvanzadas = () => {
  const { data } = useVariablesContext();
  const limite = 40;
  const [isLoading, setIsLoading] = useState(false);

  const searchIcon = useMemo(() => <FaSearch className="w-4 h-4 " />, []);

  const refreshIcon = useMemo(() => <IoMdRefresh className="w-4 h-4" />, []);
  const [descriptor, setDescriptor] = useState([]);
  const [descriptorName, setDescriptorName] = useState("");
  const [resultado, setResultado] = useState([]);
  const [checked, setChecked] = useState(true);
  const [formData, setFormData] = useState({
    subtitulo: "",
    seccion: false,
  });

  const navigate = useNavigate();

  const [lastPage, setLastPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [resoluciones, setResoluciones] = useState([]);

  const { removeAllIcon, checkAllIcon } = useIcons();
  const [selectedAll, setSelectedAll] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);

  const checkSearch = (valor) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s'’-]+$/;

    if (regex.test(valor) || valor === "") {
      return true;
    } else {
      return false;
    }
  };
  const actualizarInput = (e) => {
    const valor = e.target.value;
    if (checkSearch(valor)) {
      setBusqueda(valor);
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
    }
  };

  const agregarResoluciones = (item) => {
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

  const obtenerCronologia = async (e) => {
    e.preventDefault();

    if (selectedIds.length <= 0) {
      toast.error("Debe agregar resoluciones");
      return;
    }

    const validatedData = filterForm({
      descriptor: descriptor,
      ids: selectedIds,
      materia: checked,
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

  const search = async () => {
    if (!checkSearch(busqueda)) {
      return;
    }
    if (checked) {
      obtenerResoluciones();
      return;
    }

    if(busqueda.length < 1 ) {
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
    } catch (error) {
      const message = error.response?.data?.error || "Ocurrió un error";
      console.error("Error fetching data:", message);
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    obtenerResoluciones();
  }, [formData]);

  const obtenerResoluciones = async (page = 1) => {
    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    const validatedData = filterForm({
      busqueda: busqueda,
      page: validPage,
      descriptor: descriptor,
      ...formData,
    });

    setResoluciones([]);
    setLastPage(1);
    setPageCount(1);
    setTotalCount(1);

    JurisprudenciaService.obtenerResoluciones(validatedData)
      .then((response) => {
        if (response.data.data.length > 0) {
          setResoluciones(response.data.data);
          setResultado(filterParams(response.data.facets, data));
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
      })
      .finally(() => {
        setSelectedAll(false);
      });
  };
  const handlePageClick = (page) => {
    const selectedPage = Math.min(page, lastPage);
    setActualPage(page);
    obtenerResoluciones(selectedPage);
  };

  const handleCheckbox = (e) => {
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

  const selectAll = (e) => {
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
    setSelectedAll(true);
  };

  const clearList = (e) => {
    e.preventDefault();
    setSelectedIds((prev) =>
      prev.filter(
        (id) => !resoluciones.some((item) => Number(item.resolution_id) === id)
      )
    );
  };

  return (
    <div id="cronologia-container" className="sm:p-4 sm:m-4 m-2 p-2">
      <div className="header-container">
        <div>
          <p className="text-bold text-3xl text-center my-4 titulo uppercase font-bold text-black dark:text-white">
            Generación de Cronojurídicas
          </p>
          <div className="flex justify-end items-center flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <div className="flex gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="voice-search"
                    value={busqueda}
                    onChange={(e) => actualizarInput(e)}
                    className="bg-gray-50 h-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-octopus-500 focus:border-red-octopus-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-octopus-500 dark:focus:border-red-octopus-500"
                    placeholder="Búsqueda de jurisprudencia...."
                    required
                  />
                  {busqueda.length > 0 && (
                    <a
                      className="absolute inset-y-0 end-0 flex items-center justify-center pe-3 hover:cursor-pointer"
                      onClick={() => setBusqueda("")}
                    >
                      <MdClear />
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => search()}
                  className="flex items-center bg-red-octopus-600 p-4 text-white rounded-lg hover:bg-red-octopus-700 focus:ring-4 focus:ring-red-octopus-300 dark:focus:ring-red-octopus-800"
                >
                  {searchIcon}{" "}
                </button>
                {resoluciones.length > 0 && (
                  <button
                    type="button"
                    onClick={() => obtenerResoluciones()}
                    className="flex items-center bg-red-octopus-600 p-4 text-white rounded-lg hover:bg-red-octopus-700 focus:ring-4 focus:ring-red-octopus-300 dark:focus:ring-red-octopus-800"
                  >
                    {refreshIcon}{" "}
                  </button>
                )}
              </div>
              <div className="flex flex-row flex-wrap items-center md:justify-end gap-4 mt-2 text-lg text-black dark:text-gray-300">
                <div className="flex items-center">
                  {" "}
                  <input
                    type="radio"
                    value={"res"}
                    id="checkbox-res"
                    checked={checked}
                    onChange={() => setChecked(true)}
                    className="peer"
                  />
                  <label htmlFor="checkbox-res">Buscar resoluciones</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    value={"desc"}
                    id="checkbox-desc"
                    checked={!checked}
                    onChange={() => setChecked(false)}
                    className="peer"
                  />
                  <label htmlFor="checkbox-desc">Buscar descriptores</label>
                </div>
              </div>
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
              onClick={() => setDescriptor(null) && setDescriptorName("")}
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
              <div className="lg:w-auto w-full">
                {Object.entries(resultado).map(([name, contenido]) => (
                  <Filtros
                    key={name}
                    nombre={name}
                    data={contenido}
                    formData={formData}
                    setFormData={setFormData}
                  />
                ))}
              </div>
              <div className="lg:flex-1">
                <>
                  {resoluciones.length > 0 && (
                    <>
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
                                selectedIds.includes(Number(item.resolution_id))
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
                                    item.tipo_resolucion,
                                    "tipo_resolucion",
                                    data
                                  )} Nº${filterTitle(item.nro_resolucion)}`}
                                  color="link"
                                  full={false}
                                  large={true}
                                  content={(setShowModal) => (
                                    <ResolucionTSJ id={item.resolution_id} />
                                  )}
                                />
                              </div>

                              {/* Información detallada */}
                              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                                <div className="mb-1">
                                  <span className="font-medium">Periodo:</span>{" "}
                                  {item.periodo}
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <span className="font-medium">Ratio:</span>
                                    <div
                                      className="pl-2 mt-1 border-l-4 border-blue-500 dark:border-blue-400"
                                      dangerouslySetInnerHTML={{
                                        __html: item.ratio,
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Descriptor:
                                    </span>
                                    <div
                                      className="pl-2 mt-1 border-l-4 border-green-500 dark:border-green-400"
                                      dangerouslySetInnerHTML={{
                                        __html: item.descriptor,
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Restrictor:
                                    </span>
                                    <div
                                      className="pl-2 mt-1 border-l-4 border-red-500 dark:border-red-400"
                                      dangerouslySetInnerHTML={{
                                        __html: item.restrictor,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Paginación */}
                      <div className="mt-6">
                        <Paginate
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                          actualPage={actualPage}
                          totalCount={totalCount}
                          lastPage={lastPage}
                        />
                      </div>
                    </>
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
