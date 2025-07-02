import { useEffect, useState } from "react";
import RoleService from "../../../services/RoleService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleContext } from "../../../context/roleContext";
import { AuthUser } from "../../../auth";
import type { Permission, RoleData } from "../../../types";

interface CrearRolProps {
  permissions: Permission[] | undefined;
  showModal: boolean;
  setShowModal: (val:boolean) => void;
}
const CrearRol = ({ permissions, showModal, setShowModal }: CrearRolProps) => {
  const { can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<RoleData>({});
  const { obtenerRoles } = useRoleContext();

  useEffect(() => {
    if (!can("crear_roles")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  const setParams = (name: string, value: string | number | boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actualizarInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParams(event.target.name, event.target.value);
  };

  const actualizarPermisos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const permisoId = parseInt(value, 10);

    setFormData((prevData) => {
      // Ensure permissions is always an array
      const currentPermissions = Array.isArray(prevData.permissions)
        ? prevData.permissions
        : [];

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

  const submitForm = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await RoleService.createRole({
        ...formData,
      })
        .then(({ data }) => {
          if (data) {
            console.log(data);
            setShowModal(false);
            obtenerRoles();
            toast.success("El rol ha sido creado exitosamente");
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
    } catch (error: unknown) {
      console.error("Error Setting Up Request:", error);
    }
  };

  return (
    <div className="container mx-auto pt-4 mt-4">
      <form>
        <div className="mb-6">
          <label
            htmlFor="roleName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre del rol
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
          onClick={() => submitForm}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Crear rol
        </button>
      </form>
    </div>
  );
};

export default CrearRol;
