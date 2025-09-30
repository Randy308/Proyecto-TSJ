import { useEffect, useState } from "react";
import { FaRegCircle } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import {
  filterAtributte,
  filterParams,
  filterTitle,
  titulo,
} from "../../utils/filterForm";
import { useVariablesContext } from "../../context/variablesContext";
import Filtros from "../../components/Filtros";
import Paginate from "../../components/tables/Paginate";
import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import { IoMdClose } from "react-icons/io";
import AsyncButton from "../../components/AsyncButton";
import { useIcons } from "../../components/icons/Icons";
import type {
  DatosArray,
  FiltroBusqueda,
  Facetas,
  Faceta,
  Resolucion,
  Variables,
  ListaData,
} from "../../types";
import SimpleSearchForm from "./SimpleSearchForm";
import MultiSearch from "../../components/MultiSearch";
import { useCronologiaContext } from "../../context/cronologiaContext";
import Modal from "../../components/modal/Modal";
import ConfirmModal from "../../components/modal/ConfirmModal";


const CronologiasAvanzadas = () => {
  const { data } = useVariablesContext();

  const {
    resoluciones,
    facetas,
    isLoading,
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
    advancedSearch,
    obtenerResoluciones,
    limite,
    selectAll,
    clearList,
    removeItem,
    handleCheckbox,
    obtenerCronologiabyIds,
    handlePage,
  } = useCronologiaContext();

  const { removeAllIcon, checkAllIcon } = useIcons();

  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState<number | null>(null);

  const onClose = (id: number | null) => {
    setConfirmModalOpen(null);
    if (id) {
      setShowDetails(id);
    }
  };
  const handlePageClick = (page: number) => {
    const selectedPage = handlePage(page);
    if (searchType) {
      advancedSearch(selectedPage);
    } else {
      obtenerResoluciones(selectedPage);
    }
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

            <Modal
              isOpen={showDetails !== null}
              onClose={() => setShowDetails(null)}
              title="Detalle de la Resolución"
              size="xl"
            >
              <ResolucionTSJ id={Number(showDetails)} />
            </Modal>

            {searchType ? (
              <MultiSearch
                type="jurisprudencia"
                searchFields={searchFields}
                setSearchFields={setSearchFields}
                advancedSearch={advancedSearch}
              />
            ) : (
              <SimpleSearchForm
                setFormData={setSelectedOptions}
                searchDescriptors={obtenerResoluciones}
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
            asyncFunction={obtenerCronologiabyIds}
            name={"Obtener Resoluciones"}
            isLoading={isLoading}
            full={false}
          />
        </div>
      )}

      <div>
        <div className="mt-4 pt-4">
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
                    <Paginate handlePageClick={handlePageClick}>
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

                              <div className="flex flex-col items-center">
                                <a
                                  className="text-xl font-bold text-center text-blue-600 hover:underline hover:cursor-pointer dark:text-blue-400"
                                  onClick={() =>
                                    setConfirmModalOpen(Number(item.id))
                                  }
                                >
                                  {`${filterAtributte(
                                    String(item.tipo_resolucion),
                                    "tipo_resolucion",
                                    (data as Facetas) || {}
                                  )} Nº${filterTitle(
                                    String(item.nro_resolucion)
                                  )}`}
                                </a>
                                <ConfirmModal
                                  isOpen={
                                    confirmModalOpen === Number(item.id)
                                      ? true
                                      : false
                                  }
                                  setIsOpen={() => setConfirmModalOpen(null)}
                                  onClose={onClose}
                                  id={Number(item.resolution_id)}
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
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CronologiasAvanzadas;
