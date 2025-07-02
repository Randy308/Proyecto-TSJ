import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import AuthUser from "../../../auth/AuthUser";
import RoleService from "../../../services/RoleService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRoleContext } from "../../../context/roleContext";

const VerRol = ({ id, permissions, setCounter, showModal, setShowModal }) => {
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const [formData, setFormData] = useState([]);
  const { roles } = useRoleContext();
  useEffect(() => {
    if (!can("ver_rol")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  useEffect(() => {
    setFormData(roles.find((item) => item.id === id));
  }, [roles]);

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
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                      <input
                        type="checkbox"
                        value={item.id}
                        disabled
                        checked={true}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {item.name}
                      </span>
                    </label>
                  </li>
                ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default VerRol;
