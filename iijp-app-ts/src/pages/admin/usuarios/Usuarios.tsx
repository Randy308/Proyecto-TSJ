import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import  { useEffect, useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import { FaRegEye } from "react-icons/fa";
import PortalButton from "../../../components/modal/PortalButton";
import CrearUsuario from "./CrearUsuario";
import EliminarUsuario from "./EliminarUsuario";
import VerUsuario from "./VerUsuario";
import EditarUsuario from "./EditarUsuario";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/userContext";
import Paginate from "../../../components/tables/Paginate";
import { FaCircleUser } from "react-icons/fa6";
import { AuthUser } from "../../../auth";
import Loading from "../../../components/Loading";
const Usuarios = () => {
  const { can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!can("ver_usuarios")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  const { users, pageCount, obtenerUsers, totalUser, current } =
    useUserContext();

  const handlePageClick = (page?: number) => {
    const newPage = Math.min(page || 1, pageCount);
    obtenerUsers(newPage);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="md:px-10 px-2 pt-4">
      <div className="mx-0 my-4 md:mx-4 py-4 px-0 md:px-4 flex flex-row gap-4 md:justify-between justify-center flex-wrap">
        <div className="md:text-3xl text-2xl font-extrabold dark:text-white">
          Lista de usuarios
        </div>

        {can("crear_usuarios") && (
          <div>
            <PortalButton
              name="Crear nuevo usuario"
              Icon={TiUserAdd}
              title="Crear usuario"
              content={(_showModal, setShowModal) => (
                <CrearUsuario setShowModal={setShowModal} />
              )}
            />
          </div>
        )}
      </div>

      <div className="md:p-8">
        {users && users.length > 0 && (
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
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 capitalize">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th scope="row" className="px-6 py-4">
                        {item.id}
                      </th>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize">
                        {item.name}
                      </td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4 capitalize">{item.roleName}</td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        {can("eliminar_usuarios") && (
                          <div>
                            <PortalButton
                              Icon={MdDeleteForever}
                              color="red"
                              content={(_showModal, setShowModal) => (
                                <EliminarUsuario
                                  id={item.id}
                                  setShowModal={setShowModal}
                                />
                              )}
                            />
                          </div>
                        )}
                        {can("ver_usuario") && (
                          <div>
                            <PortalButton
                              Icon={FaRegEye}
                              color="green"
                              title="Ver usuario"
                              content={() => (
                                <VerUsuario id={item.id} />
                              )}
                            />
                          </div>
                        )}
                        {can("actualizar_usuarios") && (
                          <div>
                            <PortalButton
                              Icon={FaEdit}
                              title="Editar usuario"
                              color="yellow"
                              content={(_showModal, setShowModal) => (
                                <EditarUsuario
                                  id={item.id}
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
                {users.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {item.id}</div>
                    <a className="flex items-center justify-center gap-2 mt-2 mb-2">
                      <FaCircleUser className="h-24 w-24" />
                    </a>
                    <div className="text-md text-center">{item.name}</div>
                    <div className="text-sm">
                      <strong>Email:</strong> {item.email}
                    </div>
                    <div className="text-sm">
                      <strong>Rol:</strong>{" "}
                      <span className="uppercase">{item.roleName}</span>
                    </div>

                    <div className="mt-2 flex gap-4 justify-center">
                      {can("eliminar_usuarios") && (
                        <div>
                          <PortalButton
                            Icon={MdDeleteForever}
                            color="red"
                            name={"Eliminar"}
                            content={(_showModal, setShowModal) => (
                              <EliminarUsuario
                                id={item.id}
                                setShowModal={setShowModal}
                              />
                            )}
                          />
                        </div>
                      )}

                      {can("actualizar_usuarios") && (
                        <div>
                          <PortalButton
                            Icon={FaEdit}
                            name="Editar"
                            color="yellow"
                            content={(_showModal, setShowModal) => (
                              <EditarUsuario
                                id={item.id}
                                setShowModal={setShowModal}
                              />
                            )}
                          />
                        </div>
                      )}
                      {can("ver_usuarios") && (
                        <div>
                          <PortalButton
                            Icon={FaRegEye}
                            color="green"
                            title="Ver usuario"
                            name={"Ver"}
                            content={() => (
                              <VerUsuario
                                id={item.id}
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

            <Paginate
              handlePageClick={handlePageClick}
              totalCount={totalUser}
              pageCount={pageCount}
              actualPage={current}
            ></Paginate>
          </>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
