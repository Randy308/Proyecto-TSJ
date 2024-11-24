import Paginate from "../../components/Paginate";
import AuthUser from "../../auth/AuthUser";
import UserService from "../../services/UserService";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { FaRegEye } from "react-icons/fa";
import PortalButton from "../../components/PortalButton";
import CrearUsuario from "./CrearUsuario";
import EliminarUsuario from "./EliminarUsuario";
import VerUsuario from "./VerUsuario";
import RoleService from "../../services/RoleService";
import EditarUsuario from "./EditarUsuario";
const Usuarios = () => {
  const { getToken } = AuthUser();
  const token = getToken();
  const [users, setUsers] = useState([]);

  const [counter, setCounter] = useState(1);

  const [lastPage, setLastPage] = useState(1);
  const [totalUser, setTotalUsers] = useState(0);

  const [pageCount, setPageCount] = useState(1);
  const [roles, setRoles] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);

  const handlePageClick = (e) => {
    selectedPage(Math.min(e.selected + 1, lastPage));
  };

  useEffect(() => {
    RoleService.getAllRoles(token)
      .then(({ data }) => {
        console.log(data);
        setRoles(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [token]);

  useEffect(() => {
    UserService.getAllUsers(token, selectedPage)
      .then(({ data }) => {
        setUsers(data.data);
        setLastPage(data.last_page);
        setPageCount(data.last_page);
        setTotalUsers(data.total);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [token, counter]);

  useEffect(() => {
    console.log(counter);
  }, [counter]);

  return (
    <div>
      <div className="container mx-auto my-4 p-4 flex flex-row gap-4 justify-between">
        <div>Usuarios</div>

        <div>
          <PortalButton
            name="Crear nuevo usuario"
            Icon={TiUserAdd}
            title="Crear usuario"
            content={<CrearUsuario setCounter={setCounter} roles={roles} />}
          />
        </div>
      </div>

      <div>
        {users && users.length > 0 && (
          <>
            <div className="relative container overflow-x-auto mx-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                      <td className="px-6 py-4 capitalize">{item.role}</td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        <div>
                          <PortalButton
                            Icon={MdDeleteForever}
                            color="red"
                            content={
                              <EliminarUsuario
                                setCounter={setCounter}
                                id={item.id}
                              />
                            }
                          />
                        </div>
                        <div>
                          <PortalButton
                            Icon={FaRegEye}
                            color="green"
                            title="Ver usuario"
                            content={
                              <VerUsuario
                                setCounter={setCounter}
                                id={item.id}
                              />
                            }
                          />
                        </div>
                        <div>
                          <PortalButton
                            Icon={FaEdit}
                            title="Editar usuario"
                            color="yellow"
                            content={
                              <EditarUsuario
                                roles={roles}
                                setCounter={setCounter}
                                id={item.id}
                              />
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Paginate
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            ></Paginate>
          </>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
