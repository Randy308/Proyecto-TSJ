import { useEffect, useState } from "react";
import { useVariablesContext } from "../../context/variablesContext";
import Filtros from "../../components/Filtros";
import {
  filterForm,
  obtenerFacetas,
  titulo,
  filterParams,
} from "../../utils/filterForm";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { ResolucionesService } from "../../services";
import PaginationData from "./PaginationData";
import Paginate from "../../components/tables/Paginate";
import { toast } from "react-toastify";
import {
  type DatosArray,
  type Facetas,
  type ListaData,
  type Resolucion,
  type FiltroBusqueda,
  type Variables,
  type Faceta,
} from "../../types";
import SimpleSearch from "../../components/SimpleSearch";
import type { SearchField, SimpleSearchFormData } from "../../types/search";
import { useNavigate } from "react-router-dom";
import MultiSearch from "../../components/MultiSearch";
const Busqueda = () => {
  const { data } = useVariablesContext();

  const navigate = useNavigate();
  const [formData, setFormData] = useState<DatosArray>({});
  const [selector, setSelector] = useState<Facetas>({} as Facetas);
  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchType, setSearchType] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [facetas, setFacetas] = useState<Facetas>({} as Facetas);
  // const [searchType, setSearchType] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<SimpleSearchFormData>(
    {} as SimpleSearchFormData
  );

  const removeItem = (value: number, nombre: keyof DatosArray) => {
    setFormData((prev) => {
      const newFormData = { ...prev };
      if (newFormData[nombre]) {
        const selectedIds = newFormData[nombre].filter((id) => id !== value);

        if (selectedIds.length > 0) {
          newFormData[nombre] = selectedIds;
        } else {
          delete newFormData[nombre];
        }
      }
      return newFormData;
    });
  };

  const handlePageClick = (page: number) => {
    const selectedPage = Math.min(page, lastPage);
    setActualPage(page);
    obtenerResoluciones(selectedPage);
  };

  const obtenerResoluciones = async (page: number = 1) => {
    if (Object.keys(selectedOptions).length < 1) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda");
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
          toast.warning("No existen datos");
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

  const obtenerCronologia = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (selectedIds.length <= 0) {
      toast.error("Debe agregar resoluciones");
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
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log("PDF URL:", pdfUrl);
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

  const [searchFields, setSearchFields] = useState<SearchField[]>([]);
  const advancedSearch = async (page: number = 1) => {
    if (Object.keys(searchFields).length < 1) {
      toast.warning("Debe seleccionar al menos un campo de búsqueda");
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
          toast.warning("No existen datos");
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

  useEffect(() => {
    setSelector(filterParams(formData, (data as Variables) || {}));
  }, [data, formData]);

  return (
    <div className="pt-20 text-black dark:text-white">
      <div className="sm:mx-auto container max-w-7xl p-1 md:p-3 border-2 rounded-lg my-4">
        <p className="text-2xl md:text-4xl uppercase titulo font-bold text-center">
          Búsqueda de Resoluciones
        </p>

        {searchType ? (
          <MultiSearch
            searchFields={searchFields}
            setSearchFields={setSearchFields}
          >
            <button
              type="button"
              onClick={() => advancedSearch(1)}
              className="p-2.5 ms-2 mt-4 flex gap-2 items-center text-sm font-medium text-white bg-red-octopus-700 rounded-lg border  hover:bg-red-octopus-800 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <IoMdSearch className="w-4 h-4" />
              <span className="">Buscar</span>
            </button>
          </MultiSearch>
        ) : (
          <SimpleSearch
            obtenerResoluciones={obtenerResoluciones}
            setFormData={setSelectedOptions}
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

      <div className="flex flex-col sm:grid sm:grid-cols-4 lg:grid-cols-5 gap-4 p-4 m-4">
        {facetas && Object.keys(facetas).length > 0 ? (
          <div className="rounded-lg py-3">
            <p className="text-2xl font-bold p-2">Filtros</p>
            <div className="grid grid-cols-1 gap-4 p-2 my-2">
              {Object.entries(facetas).map(
                ([name, contenido]) =>
                  !["materia", "tipo_jurisprudencia"].includes(name) && (
                    <Filtros
                      key={name}
                      nombre={name as FiltroBusqueda}
                      data={contenido as Faceta[]}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-500"></div>
        )}

        <div className="sm:col-span-3 lg:col-span-4">
          {selector && Object.keys(selector).length > 0 && (
            <div className="flex gap-4 items-center flex-wrap">
              <span className="text-lg font-bold">Filtrado por:</span>
              {Object.entries(selector).map(([name, contenido]) => (
                <div className="flex gap-4 items-center flex-wrap" key={name}>
                  <span className="uppercase text-xs font-bold">
                    {titulo(name)}:
                  </span>
                  <div className="flex gap-4 flex-wrap">
                    {contenido.map((item: ListaData, index: number) => (
                      <div
                        key={index}
                        className="text-xs p-1 rounded-md border hover:cursor-pointer border-gray-300 hover:border-red-400 flex gap-2 justify-between items-center group"
                        onClick={() =>
                          removeItem(item.id, name as keyof DatosArray)
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
          <div className="w-full">
            <div className="pt-4 ">
              <div className="sm:p-4 pt-4">
                {resoluciones.length > 0 ? (
                  <>
                    <PaginationData
                      resolutions={resoluciones}
                      setSelectedIds={setSelectedIds}
                      selectedIds={selectedIds}
                      isLoading={isLoading}
                      obtenerCronologia={obtenerCronologia}
                    />

                    <Paginate
                      handlePageClick={handlePageClick}
                      pageCount={pageCount}
                      actualPage={actualPage}
                      totalCount={totalCount}
                    />
                  </>
                ) : (
                  <div className="text-center">Realice una busqueda</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Busqueda;
