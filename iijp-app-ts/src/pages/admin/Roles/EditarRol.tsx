import React, { useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import RoleService from "../../../services/RoleService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleContext } from "../../../context/roleContext";
import { AuthUser } from "../../../auth";

interface Props {
  id: number;
  permissions: number[];
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditarRol = ({
  id,
  permissions,
  setCounter,
  showModal,
  setShowModal,
}: Props) => {
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const [formData, setFormData] = useState([]);
  const { roles, obtenerRoles } = useRoleContext();

  useEffect(() => {
    if (!can("actualizar_roles")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  const setParams = (name:string, value:string | number | boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const removeParam = (name:string) => {
    setFormData((prevData) => {
      const { [name]: _, ...rest } = prevData;
      return rest;
    });
  };

  const actualizarInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams(event.target.name, event.target.value);
  };

  const actualizarPermisos = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setFormData(roles.find((item) => item.id === id));
  }, [roles]);

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
            setShowModal(false);
            obtenerRoles();
            setCounter((prev) => prev + 1);
            toast.success(
              "La información del rol ha sido actualizado exitosamente"
            );
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
                <label className="inline-flex items-center my-2 cursor-pointer">
                  <input
                    id={`checkbox-item-${item.name}`}
                    type="checkbox"
                    value={item.id}
                    checked={
                      (formData.permissions &&
                        formData.permissions.includes(item.id)) ||
                      false
                    }
                    onChange={(e) => actualizarPermisos(e)}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {item.name}
                  </span>
                </label>
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
