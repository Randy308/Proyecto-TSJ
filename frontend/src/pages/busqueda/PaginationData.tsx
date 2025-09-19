import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import { filterAtributte, filterTitle, titulo } from "../../utils/filterForm";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useIcons } from "../../components/icons/Icons";
import { toast } from "react-toastify";
import type { Resolucion, Facetas } from "../../types";
import { useVariablesContext } from "../../context";
import { IoMdClose } from "react-icons/io";
import AsyncButton from "../../components/AsyncButton";
import ConfirmModal from "../../components/modal/ConfirmModal";
import Modal from "../../components/modal/Modal";
import { useState } from "react";

interface PaginationDataProps {
  resolutions: Resolucion[];
  selectedIds: number[];
  isLoading: boolean;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  obtenerCronologia: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
const PaginationData = ({
  resolutions,
  selectedIds,
  isLoading,
  setSelectedIds,
  obtenerCronologia,
}: PaginationDataProps) => {
  const limite = 40;

  const { data } = useVariablesContext();
  const { removeAllIcon, checkAllIcon } = useIcons();

  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState<number | null>(null);

  const onClose = (id: number | null) => {
    setConfirmModalOpen(null);
    if (id) {
      setShowDetails(id);
    }
    console.log(id);
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
    const disponiblesIds = resolutions.map((item) => Number(item.id));
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
      prev.filter((id) => !resolutions.some((item) => Number(item.id) === id))
    );
  };

  return (
    <div className="relative overflow-x-auto flex flex-col gap-4 p-4">
      <Modal
        isOpen={showDetails !== null}
        onClose={() => setShowDetails(null)}
        title="Detalle de la Resolución"
        size="xl"
      >
        <ResolucionTSJ id={Number(showDetails)} />
      </Modal>

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

      <div className="flex items-center gap-2 px-2">
        <a
          onClick={(e) => selectAll(e)}
          className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center justify-between border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {checkAllIcon}
          <span className="ms-2 text-xs">Seleccionar todos</span>
        </a>
        <a
          onClick={(e) => clearList(e)}
          className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          {removeAllIcon}
          <span className="ms-2 text-xs">Quitar Selección</span>
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resolutions.map((item, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-md border-2 hover:shadow-lg transition ${
              selectedIds.includes(Number(item.id))
                ? "border-blue-400 dark:border-blue-900"
                : "border-gray-100"
            }`}
          >
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              value={item.id}
              checked={selectedIds.includes(Number(item.id))}
              onChange={handleCheckbox}
              className="hidden peer"
              aria-label={`Seleccionar resolución ${item.nro_resolucion}`}
            />
            {selectedIds.includes(Number(item.id)) ? (
              <label
                htmlFor={`checkbox-${item.id}`}
                className="hover:cursor-pointer text-blue-700"
              >
                <FaCheckCircle className="h-7 w-7" />
              </label>
            ) : (
              <label
                htmlFor={`checkbox-${item.id}`}
                className="hover:cursor-pointer text-gray-400 dark:text-gray-500"
              >
                <FaRegCircle className="h-7 w-7" />
              </label>
            )}

            <div className="flex flex-col items-center">
              <a
                className="text-xl font-bold text-center text-blue-600 hover:underline hover:cursor-pointer dark:text-blue-400"
                onClick={() => setConfirmModalOpen(Number(item.id))}
              >
                {`${filterAtributte(
                  String(item.tipo_resolucion),
                  "tipo_resolucion",
                  (data as Facetas) || {}
                )} Nº${filterTitle(String(item.nro_resolucion))}`}
              </a>
              <ConfirmModal
                isOpen={confirmModalOpen === Number(item.id) ? true : false}
                setIsOpen={() => setConfirmModalOpen(null)}
                onClose={onClose}
                id={Number(item.id)}
              />
            </div>
            <div className="space-y-2 pt-4 text-sm">
              {Object.keys(item)
                .filter(
                  (key) =>
                    ![
                      "id",
                      "contenido",
                      "demandante",
                      "demandado",
                      "sintesis",
                      "maxima",
                      "precedente",
                      "proceso",
                      "highlight",
                      "nro_resolucion",
                      "tipo_resolucion",
                    ].includes(key) && item[key as keyof Resolucion]
                )
                .map((key) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-start"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[140px]">
                      {titulo(key)}:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 sm:ml-2">
                      {key === "fecha_emision"
                        ? format(
                            item.fecha_emision || new Date(),
                            "d 'de' MMMM 'de' yyyy",
                            { locale: es }
                          )
                        : filterAtributte(
                            (item[key as keyof Resolucion] || "").toString(),
                            key as keyof Facetas,
                            (data || {}) as Facetas
                          )}
                    </span>
                  </div>
                ))}

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
                    ].includes(key) && item[key as keyof Resolucion]
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
                      className="text-gray-600 dark:text-gray-400 mt-1"
                      dangerouslySetInnerHTML={{
                        __html: (
                          item[key as keyof Resolucion] || ""
                        ).toString(),
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginationData;
