import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import React, { useEffect, useState } from "react";

import { TiUserAdd } from "react-icons/ti";
import { FaRegEye } from "react-icons/fa";
import PortalButton from "../../../components/PortalButton";

import RoleService from "../../../services/RoleService";
import AuthUser from "../../../auth/AuthUser";
import EliminarRol from "./EliminarRol";
import VerRol from "./VerRol";
import EditarRol from "./EditarRol";
import CrearRol from "./CrearRol";
import { useNavigate } from "react-router-dom";

const ListaRoles = () => {
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = getToken();

  const [counter, setCounter] = useState(1);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!can("ver_roles")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  useEffect(() => {
    RoleService.getPermissions(token)
      .then(({ data }) => {
        console.log(data);
        setPermissions(data);
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }, [token]);

  useEffect(() => {
    RoleService.getAllRoles(token)
      .then(({ data }) => {
        console.log(data);
        setRoles(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [token, counter]);

  return (
    <div>
      <div className="container mx-auto my-4 p-4 flex flex-row gap-4 justify-between">
        <div>Lista de roles</div>

        {can("crear_roles") && (
          <div>
            <PortalButton
              name="Crear nuevo rol"
              Icon={TiUserAdd}
              title="Crear rol"
              content={
                <CrearRol setCounter={setCounter} permissions={permissions} />
              }
            />
          </div>
        )}
      </div>

      <div>
        {roles && roles.length > 0 && (
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
                        {item.name}
                      </td>
                      <td className="px-6 py-4 flex flex-row gap-2 items-center">
                        {can("eliminar_roles") && (
                          <div>
                            <PortalButton
                              Icon={MdDeleteForever}
                              color="red"
                              content={
                                <EliminarRol
                                  setCounter={setCounter}
                                  id={item.id}
                                />
                              }
                            />
                          </div>
                        )}

                        {can("ver_rol") && (
                          <div>
                            <PortalButton
                              Icon={FaRegEye}
                              color="green"
                              title="Ver usuario"
                              content={
                                <VerRol
                                  setCounter={setCounter}
                                  id={item.id}
                                  permissions={permissions}
                                />
                              }
                            />
                          </div>
                        )}

                        {can("actualizar_roles") && (
                          <div>
                            <PortalButton
                              Icon={FaEdit}
                              title="Editar usuario"
                              color="yellow"
                              content={
                                <EditarRol
                                  permissions={permissions}
                                  setCounter={setCounter}
                                  id={item.id}
                                />
                              }
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListaRoles;
