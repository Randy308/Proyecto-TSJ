import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import AuthUser from "../../../auth/AuthUser";
import RoleService from "../../../services/RoleService";
import axios from "axios";

const EditarRol = ({ id, permissions, setCounter }) => {
  const { getToken } = AuthUser();
  const token = getToken();
  const [formData, setFormData] = useState([]);

  const setParams = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const removeParam = (name) => {
    setFormData((prevData) => {
      const { [name]: _, ...rest } = prevData;
      return rest;
    });
  };

  const actualizarInput = (event) => {
    setParams(event.target.name, event.target.value);
  };

  const actualizarPermisos = (e) => {
    const { value, checked } = e.target;
    const permisoId = parseInt(value, 10);

    setFormData((prevData) => {
      const currentPermissions = prevData.permissions;

      if (checked) {
        return {
          ...prevData,
          permissions: [...currentPermissions, permisoId],
        };
      } else {
        return {
          ...prevData,
          permissions: currentPermissions.filter((id) => id !== permisoId),
        };
      }
    });
  };

  useEffect(() => {
    RoleService.getRole(id, token)
      .then(({ data }) => {
        console.log(data);
        setFormData(data);
      })
      .catch((error) => console.error("Error al obtener el rol:", error));
  }, [token]);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      console.log("CSRF token retrieved successfully.");

      await RoleService.updateRole(
        id,
        {
          ...formData,
        },
        token
      )
        .then(({ data }) => {
          if (data) {
            console.log(data);
            setCounter((prev) => prev + 1);
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        console.error("Network Error: No response received from the server.");
      } else {
        console.error("Error Setting Up Request:", error.message);
      }
    }
  };

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
            {permissions.map((item) => (
              <li key={item.id}>
                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id={`checkbox-item-${item.name}`}
                    type="checkbox"
                    value={item.id}
                    checked={formData.permissions.includes(item.id)}
                    onChange={(e) => actualizarPermisos(e)}
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
        <button
          type="submit"
          onClick={submitForm}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Actualizar información
        </button>
      </form>
    </div>
  );
};

export default EditarRol;
