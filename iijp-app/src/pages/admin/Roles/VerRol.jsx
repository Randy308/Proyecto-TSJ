import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import AuthUser from "../../../auth/AuthUser";
import RoleService from "../../../services/RoleService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerRol = ({ id, permissions, setCounter }) => {
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    if (!can("ver_rol")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);
  useEffect(() => {
    RoleService.getRole(id, token)
      .then(({ data }) => {
        console.log(data);
        setFormData(data);
      })
      .catch((error) => console.error("Error al obtener el rol:", error));
  }, [token]);

  if (formData.length <= 0) {
    return (
      <div className="h-[400px]">
        <Loading></Loading>
      </div>
    );
  }
  return (
    <div className="container mx-auto pt-4 mt-4">
      <form>
        <div className="mb-6">
          <label
            htmlFor="roleName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="roleName"
            name="roleName"
            value={formData.roleName || ""}
            disabled
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <div>
            <span className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Lista de permisos
            </span>
          </div>
          <ul
            className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownSearchButton"
          >
            {permissions &&
              permissions
                .filter((item) => formData.permissions.includes(item.id)) // Filter permissions the role has
                .map((item) => (
                  <li key={item.id}>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id={`checkbox-item-${item.name}`}
                        type="checkbox"
                        value={item.id}
                        disabled
                        checked={true} // Always checked since this is read-only for permissions the role has
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor={`checkbox-item-${item.name}`}
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        {item.name}
                      </label>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default VerRol;
