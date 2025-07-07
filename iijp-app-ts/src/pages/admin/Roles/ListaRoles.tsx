import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import  { useEffect, useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import { FaRegEye } from "react-icons/fa";
import PortalButton from "../../../components/modal/PortalButton";
import EliminarRol from "./EliminarRol";
import VerRol from "./VerRol";
import EditarRol from "./EditarRol";
import CrearRol from "./CrearRol";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../../../context/roleContext";
import { usePermissionContext } from "../../../context/permissionContext";
import { AuthUser } from "../../../auth";
import Loading from "../../../components/Loading";

export function ListaRoles () {
  const { can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { roles } = useRoleContext();
  const { permisos } = usePermissionContext();

  useEffect(() => {
    if (!can("ver_roles")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);


  if (loading) {
    return <Loading />;
  }

  return (
    <div className="md:px-20 px-2">
      <div className="container mx-auto my-4 p-4 flex flex-row gap-4 md:justify-between justify-center flex-wrap">
        <div className="text-3xl font-extrabold dark:text-white">
          Lista de roles
        </div>

        {can("crear_roles") && (
          <div>
            <PortalButton
              name="Crear nuevo rol"
              Icon={TiUserAdd}
              title="Crear rol"
              content={(showModal, setShowModal) => (
                <CrearRol
                  permissions={permisos}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              )}
            />
          </div>
        )}
      </div>

      <div className="md:p-8">
        {roles && roles.length > 0 && (
          <>
            <div className="relative container overflow-x-auto mx-auto">
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
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4">
                        {item.id}
                      </th>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                        {item.roleName}
                      </td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        {can("eliminar_roles") && (
                          <div>
                            <PortalButton
                              Icon={MdDeleteForever}
                              color="red"
                              content={(showModal, setShowModal) => (
                                <EliminarRol
                                  id={item.id}
                                  showModal={showModal}
                                  setShowModal={setShowModal}
                                />
                              )}
                            />
                          </div>
                        )}

                        {can("ver_rol") && (
                          <div>
                            <PortalButton
                              Icon={FaRegEye}
                              color="green"
                              title="Ver usuario"
                              content={(showModal, setShowModal) => (
                                <VerRol
                                  id={item.id}
                                  permissions={permisos}
                                  showModal={showModal}
                                  setShowModal={setShowModal}
                                />
                              )}
                            />
                          </div>
                        )}

                        {can("actualizar_roles") && (
                          <div>
                            <PortalButton
                              Icon={FaEdit}
                              title="Editar usuario"
                              color="yellow"
                              content={(showModal, setShowModal) => (
                                <EditarRol
                                  id={item.id}
                                  permissions={permisos}
                                  showModal={showModal}
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
              <div className="flex flex-col gap-4 md:hidden">
                {roles.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                  >
                    <span className="text-sm text-gray-500">ID: {item.id}</span>
                    <div className="text-lg capitalize font-bold text-gray-900 dark:text-white text-center">
                      {item.roleName}
                    </div>


                    <div className="mt-2 flex flex-wrap gap-4 justify-center">
                      {can("eliminar_roles") && (
                        <div>
                          <PortalButton
                            Icon={MdDeleteForever}
                            color="red"
                            name="Eliminar"
                            content={(showModal, setShowModal) => (
                              <EliminarRol
                                id={item.id}
                                showModal={showModal}
                                setShowModal={setShowModal}
                              />
                            )}
                          />
                        </div>
                      )}

                      {can("ver_rol") && (
                        <div>
                          <PortalButton
                            Icon={FaRegEye}
                            color="green"
                            title="Ver rol"
                            name="Ver rol"
                            content={(showModal, setShowModal) => (
                              <VerRol
                                id={item.id}
                                permissions={permisos}
                                showModal={showModal}
                                setShowModal={setShowModal}
                              />
                            )}
                          />
                        </div>
                      )}

                      {can("actualizar_roles") && (
                        <div>
                          <PortalButton
                            Icon={FaEdit}
                            title="Editar rol"
                            name="Editar rol"
                            color="yellow"
                            content={(showModal, setShowModal) => (
                              <EditarRol
                                id={item.id}
                                permissions={permisos}
                                showModal={showModal}
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
