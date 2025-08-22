import React from "react";
import { AuthService } from "../../../services";
import Loading from "../../../components/Loading";
import { useAuthContext } from "../../../context";
import { useNavigate } from "react-router-dom";
import PortalButton from "../../../components/modal/PortalButton";
import EditarForma from "./EditarForma";
import { FaEdit } from "react-icons/fa";

export interface FormaDecision {
  id: number;
  nombre: string;
  resuelve_fondo_id: number;
  resuelve_fondo?: string;
  sala_nombre: string;
  sala_id: number;
  tipo: number;
}
const FormaDecision = () => {
  const [loading, setLoading] = React.useState(true);
  const [formas, setFormas] = React.useState<FormaDecision[]>([]);
  const { can } = useAuthContext(); // Placeholder for actual auth context or service
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!can("ver_forma_decisiones")) {
      // Redirect or show unauthorized message
      navigate("/");
    } else {
      fetchFormas();
    }
  }, [can, navigate]);

  const fetchFormas = async () => {
    try {
      const { data } = await AuthService.getDecideForma();
      if (data && data.data && Array.isArray(data.data)) {
        setFormas(data.data || []);
      } else {
        console.error("Invalid data format for formas de decision");
      }
    } catch (error) {
      console.error("Failed to fetch formas de decision:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="md:px-10 px-2 pt-4">
      <div className="md:p-8">
        {formas && formas.length > 0 && (
          <>
            <div className="relative overflow-x-auto mx-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:table">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Sala
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Tipo de decisión
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formas.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4">
                        {item.id}
                      </th>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                        {item.tipo}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                        {item.nombre}
                      </td>
                      <td className="px-6 py-4">{item.sala_nombre}</td>
                      <td className="px-6 py-4">
                        {item.resuelve_fondo ? item.resuelve_fondo : "N/A"}
                      </td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        {can("actualizar_salas") && (
                          <div>
                            <PortalButton
                              Icon={FaEdit}
                              title="Editar sala"
                              color="yellow"
                              content={(_showModal, setShowModal) => (
                                <EditarForma
                                  sala={item}
                                  setShowModal={setShowModal}
                                />
                              )}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
                {formas.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Badge con el ID */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        ID: {item.id}
                      </span>
                      {item.resuelve_fondo ? (
                        <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                          {item.resuelve_fondo}
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                          N/A
                        </span>
                      )}
                    </div>

                    {/* Título principal */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                      {item.tipo}
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium capitalize">
                      {item.nombre}
                    </p>

                    {/* Sala */}
                    <div className="mt-3 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Sala:</span>
                      <span>{item.sala_nombre}</span>
                    </div>

                    {/* Botón de acción */}
                    {can("actualizar_salas") && (
                      <div className="mt-4 flex justify-end">
                        <PortalButton
                          Icon={FaEdit}
                          title="Editar sala"
                          color="yellow"
                          content={(_showModal, setShowModal) => (
                            <EditarForma
                              sala={item}
                              setShowModal={setShowModal}
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormaDecision;
