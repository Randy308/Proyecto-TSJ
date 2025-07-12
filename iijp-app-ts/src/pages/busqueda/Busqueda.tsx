import { useEffect, useState } from "react";
import { useVariablesContext } from "../../context/variablesContext";
import Filtros from "../../components/Filtros";
import { filterForm, filterParams, titulo } from "../../utils/filterForm";
import { IoMdClose } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { ResolucionesService } from "../../services";
import PaginationData from "./PaginationData";
import Paginate from "../../components/tables/Paginate";
import { toast } from "react-toastify";
import {
  type DatosArray,
  type Variable,
  type ListaData,
  type Resolucion,
  type FiltroBusqueda,
} from "../../types";
import { FaInfo } from "react-icons/fa6";
import MultiSelect from "../../components/MultiSelect";
const Busqueda = () => {
  const { data } = useVariablesContext();
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const [formData, setFormData] = useState<DatosArray>({});
  const [selector, setSelector] = useState<Variable>({} as Variable);
  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [termino, setTermino] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [facetas, setFacetas] = useState<Variable>({} as Variable);
  // const [searchType, setSearchType] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { value: "contenido", label: "Contenido" },
    { value: "proceso", label: "Proceso" },
    { value: "sintesis", label: "Síntesis" },
    { value: "maxima", label: "Maxima" },
    { value: "precedente", label: "Precedente" },
    { value: "demandado", label: "Demandado" },
    { value: "demandante", label: "Demandante" },
  ];

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

  const obtenerResoluciones = async (page: number) => {
    if (selectedOptions.length < 1) {
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
      term: termino,
      highlight: selectedOptions,
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
            filterParams(response.data.facets, (data as Variable) || {})
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
    setSelector(filterParams(formData, (data as Variable) || {}));
  }, [data, formData]);

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
      setTermino(valor);
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
    }
  };

  return (
    <div className="pt-20 text-black dark:text-white">
      <p className="text-4xl uppercase titulo font-bold text-center">
        Búsqueda de Resoluciones
      </p>

      <div className="flex items-center m-8 justify-center">
        <label htmlFor="simple-search" className="sr-only">
          Criterio de Búsqueda:
        </label>
        <MultiSelect
          options={options}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <input
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ingrese termino de búsqueda"
          value={termino}
          onChange={(e) => actualizarInput(e)}
        />
        <button
          type="button"
          onClick={() => obtenerResoluciones(1)}
          className="p-2.5 ms-2 flex gap-2 items-center text-sm font-medium text-white bg-red-octopus-700 rounded-lg border border-red-octopus-700 hover:bg-red-octopus-800 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <IoMdSearch className="w-4 h-4" />
          <span className="">Buscar</span>
        </button>
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
      <div className="flex flex-col sm:grid sm:grid-cols-4 lg:grid-cols-5 gap-4 p-4 m-4">
        <div className="rounded-lg py-3">
          <p className="text-2xl font-bold p-2">Filtros</p>
          <div className="gird grid-cols-1 gap-4 p-2 my-2">
            {Object.entries((facetas || data) as Variable).map(
              ([name, contenido]) =>
                !["materia", "tipo_jurisprudencia"].includes(name) && (
                  <Filtros
                    key={name}
                    nombre={name as FiltroBusqueda}
                    data={contenido as ListaData[]}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )
            )}
          </div>
        </div>

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
                          removeItem(item.id, name as keyof Variable)
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
                {resoluciones.length > 0 && (
                  <>
                    <PaginationData
                      resolutions={resoluciones}
                      termino={termino}
                    />

                    <Paginate
                      handlePageClick={handlePageClick}
                      pageCount={pageCount}
                      actualPage={actualPage}
                      totalCount={totalCount}
                    />
                  </>
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
