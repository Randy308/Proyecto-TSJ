import { useEffect } from "react";
import { useVariablesContext } from "../../context/variablesContext";
import Filtros from "../../components/Filtros";
import { titulo, filterParams } from "../../utils/filterForm";
import { IoMdClose } from "react-icons/io";
import PaginationData from "./PaginationData";
import Paginate from "../../components/tables/Paginate";
import {
  type DatosArray,
  type ListaData,
  type FiltroBusqueda,
  type Variables,
  type Faceta,
} from "../../types";
import SimpleSearch from "../../components/SimpleSearch";
import MultiSearch from "../../components/MultiSearch";
import { useCronologiaContext } from "../../context/cronologiaContext";
const Busqueda = () => {
  const { data } = useVariablesContext();

  const {
    resoluciones,
    facetas,
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
    removeItem,
    handlePage,
    isLoading,
    advancedSearchBusqueda,
    obtenerCronologiaBusqueda,
    obtenerResolucionesBusqueda,
  } = useCronologiaContext();

  const handlePageClick = (page: number) => {
    const selectedPage = handlePage(page);
    if (searchType) {
      advancedSearchBusqueda(selectedPage);
      return;
    }
    obtenerResolucionesBusqueda(selectedPage);
  };

  useEffect(() => {
    setSelector(filterParams(formData, (data as Variables) || {}));
    if (searchType) {
      if (Object.keys(searchFields).length < 1) {
        console.warn("Debe seleccionar al menos un campo de búsqueda");
        return;
      }
      advancedSearchBusqueda(1);
    } else {
      if (Object.keys(selectedOptions).length < 1) {
        console.warn("Debe seleccionar al menos un campo de búsqueda");
        return;
      }
      obtenerResolucionesBusqueda(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, formData]);

  return (
    <div className="pt-20 text-black dark:text-white">
      <div className="sm:mx-auto container max-w-7xl p-1 md:p-3 border-2 rounded-lg my-4">
        <p className="text-2xl md:text-3xl titulo font-bold text-center">
          {searchType ? "Búsqueda Avanzada" : "Búsqueda Simple"}
        </p>

        {searchType ? (
          <MultiSearch
            searchFields={searchFields}
            setSearchFields={setSearchFields}
            advancedSearch={advancedSearchBusqueda}
          />
        ) : (
          <SimpleSearch
            obtenerResoluciones={obtenerResolucionesBusqueda}
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
          <div className="w-full">
            <div className="pt-4 ">
              <div className="sm:p-4 pt-4">
                {resoluciones.length > 0 ? (
                  <>
                    <Paginate handlePageClick={handlePageClick}>
                      <PaginationData
                        resolutions={resoluciones}
                        setSelectedIds={setSelectedIds}
                        selectedIds={selectedIds}
                        isLoading={isLoading}
                        obtenerCronologia={obtenerCronologiaBusqueda}
                      />
                    </Paginate>
                  </>
                ) : (
                  <div className="text-gray-500 text-center">
                    No hay resoluciones para mostrar
                  </div>
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
