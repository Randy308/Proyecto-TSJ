import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { useAuthContext } from "../../../context";
import { AuthService } from "../../../services";
import EditarSala from "./EditarSala";
import PortalButton from "../../../components/modal/PortalButton";
import { FaEdit } from "react-icons/fa";

export interface Sala {
  id: number;
  nombre: string;
  grupo_sala_id?: number;
  grupo_sala?: string;
}
export interface GrupoSala {
  id: number;
  nombre: string;
}
const Salas = () => {
  const { can } = useAuthContext();
  const navigate = useNavigate();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [grupoSalas, setGrupoSalas] = useState<GrupoSala[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!can("ver_salas")) {
      navigate("/");
    } else {
      setLoading(false);
      fetchSalas().then(() => {
        AuthService.getGrupoSalas().then((response) => {
          if (response.data && Array.isArray(response.data)) {
            setGrupoSalas(response.data);
          } else {
            console.error("Invalid data format for grupoSalas");
          }
        });
      });
    }
  }, [can, navigate]);

  const fetchSalas = async () => {
    try {
      const { data } = await AuthService.getSalas();
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid data format");
      }
      setSalas(data);
    } catch (error) {
      console.error("Failed to fetch salas:", error);
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
        {salas && salas.length > 0 && (
          <>
            <div className="relative overflow-x-auto mx-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:table">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Grupo Sala
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salas.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4">
                        {item.id}
                      </th>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                        {item.nombre}
                      </td>
                      <td className="px-6 py-4">{item.grupo_sala}</td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        {can("actualizar_salas") && (
                          <div>
                            <PortalButton
                              Icon={FaEdit}
                              title="Editar sala"
                              color="yellow"
                              content={(_showModal, setShowModal) => (
                                <EditarSala
                                  sala={item}
                                  grupo_salas={grupoSalas}
                                  setGrupoSalas={setGrupoSalas}
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

              <div className="flex flex-col gap-4 md:hidden text-gray-800 dark:text-gray-400">
                {salas.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.nombre}
                    </div>{" "}
                    <div className="text-md text-center">{item.grupo_sala}</div>
                    <div className="mt-2 flex gap-4 justify-center">
                      {can("actualizar_salas") && (
                        <div>
                          <PortalButton
                            Icon={FaEdit}
                            title="Editar sala"
                            color="yellow"
                            content={(_showModal, setShowModal) => (
                              <EditarSala
                                sala={item}
                                grupo_salas={grupoSalas}
                                setGrupoSalas={setGrupoSalas}
                                setShowModal={setShowModal}
                              />
                            )}
                          />
                        </div>
                      )}
                    </div>
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

export default Salas;
