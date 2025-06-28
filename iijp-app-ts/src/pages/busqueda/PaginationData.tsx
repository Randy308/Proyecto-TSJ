import React from "react";
import "../../styles/tabla.css";
import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import PortalButton from "../../components/modal/PortalButton";
import { filterAtributte, filterTitle, titulo } from "../../utils/filterForm";

import { format } from "date-fns";
import { es } from "date-fns/locale";

const PaginationData = ({ resolutions, data }) => {
  return (
    <div className="relative overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resolutions.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg transition hover:shadow-xl p-6 space-y-4"
          >
            <div className="text-center">
              <PortalButton
                title="Auto Supremo"
                color="link"
                withIcon={false}
                full={false}
                name={`${filterAtributte(
                  item.tipo_resolucion,
                  "tipo_resolucion",
                  data
                )} Nº${filterTitle(item.nro_resolucion)}`}
                large={true}
                content={(setShowModal) => <ResolucionTSJ id={item.id} />}
              />
            </div>

            <div className="space-y-2 text-sm">
              {Object.keys(item).map(
                (key) =>
                  !["id", "contenido", "demandante", "demandado",'nro_resolucion','tipo_resolucion'].includes(
                    key
                  ) &&
                  item[key] && (
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
                              item.fecha_emision,
                              "d 'de' MMMM 'de' yyyy",
                              {
                                locale: es,
                              }
                            )
                          : filterAtributte(item[key], key, data)}
                      </span>
                    </div>
                  )
              )}

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
