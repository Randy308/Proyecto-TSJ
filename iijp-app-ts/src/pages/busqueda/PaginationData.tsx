import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import PortalButton from "../../components/modal/PortalButton";
import {
  filterAtributte,
  filterForm,
  filterTitle,
  titulo,
} from "../../utils/filterForm";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useIcons } from "../../components/icons/Icons";
import ResolucionesService from "../../services/ResolucionesService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import type { Resolucion, Variable } from "../../types";
import { useVariablesContext } from "../../context";

interface PaginationDataProps {
  resolutions: Resolucion[];
  termino: string;
}
const PaginationData = ({ resolutions, termino }: PaginationDataProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const limite = 40;

  const { data } = useVariablesContext();
  const { removeAllIcon, checkAllIcon } = useIcons();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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

  const obtenerCronologia = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (selectedIds.length <= 0) {
      toast.error("Debe agregar resoluciones");
      return;
    }

    const validatedData = filterForm({
      ids: selectedIds,
      term: termino,
    });
    setIsLoading(true);
    ResolucionesService.obtenerCronologiabyIds(validatedData)
      .then(({ data }) => {
        console.log(data);
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

  useEffect(() => {
    console.log("Selected IDs:", selectedIds);
  }, [selectedIds]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="relative overflow-x-auto flex flex-col gap-4 p-4">
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

        <a
          onClick={(e) => obtenerCronologia(e)}
          className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <span className="ms-2 text-xs"> Obtener Resoluciones</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="text-center">
              <PortalButton
                title="Auto Supremo"
                color="link"
                withIcon={false}
                full={false}
                name={`${filterAtributte(
                  (String(item.tipo_resolucion) || "").toLowerCase(),
                  "tipo_resolucion",
                  (data || {}) as Variable
                )} Nº${filterTitle(item.nro_resolucion || "")}`}
                large={true}
                content={() => <ResolucionTSJ id={Number(item.id)} />}
              />
            </div>

            <div className="space-y-2 text-sm">
              {Object.keys(item)
                .filter(
                  (key) =>
                    ![
                      "id",
                      "contenido",
                      "demandante",
                      "demandado",
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
                            key as keyof Variable,
                            (data || {}) as Variable
                          )}
                    </span>
                  </div>
                ))}

              {item.demandante && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Demandante:
                  </span>
                  <div
                    className="text-gray-600 dark:text-gray-400 mt-1"
                    dangerouslySetInnerHTML={{ __html: item.demandante }}
                  />
                </div>
              )}

              {item.demandado && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Demandado:
                  </span>
                  <div
                    className="text-gray-600 dark:text-gray-400 mt-1"
                    dangerouslySetInnerHTML={{ __html: item.demandado }}
                  />
                </div>
              )}

              {item.contenido && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Resumen:
                  </span>
                  <div
                    className="text-gray-600 dark:text-gray-400 mt-1 text-justify"
                    dangerouslySetInnerHTML={{ __html: item.contenido }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginationData;
