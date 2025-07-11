import React, { useEffect, useState } from "react";
import axios from "axios";
import {RoleService} from "../../../services";
import Loading from "../../../components/Loading";
import { ImWarning } from "react-icons/im";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleContext } from "../../../context/roleContext";
import { type RoleData  } from "../../../types";
import { useAuthContext } from "../../../context";

interface Props {
  id: number;
  showModal?: boolean;
  setShowModal: (val:boolean) => void;
}
const EliminarRol = ({ id, setShowModal }: Props) => {
  const { can } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<RoleData>({});
  const { roles, obtenerRoles } = useRoleContext();
  useEffect(() => {
    if (!can("eliminar_roles")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);



  useEffect(() => {
      const foundRole = (roles || []).find((item) => item.id === id);
    setFormData(foundRole || {});
  }, [id, roles]);

  const submitForm = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.get(`${import.meta.env.VITE_REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      console.log("CSRF token retrieved successfully.");

      await RoleService.deleteRole(id)
        .then(({ data }) => {
          if (data) {
            console.log(data);
            setShowModal(false);
            obtenerRoles();
            toast.success("El rol ha sido eliminado exitosamente");
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        console.error("Server Error:", error.response?.data);
        console.error("Status Code:", error.response?.status);
      } else if (typeof error === "object" && error !== null && "request" in error) {
        console.error("Network Error: No response received from the server.");
      } else if (typeof error === "object" && error !== null && "message" in error) {
        console.error("Error Setting Up Request:", (error as { message: string }).message);
      }
    }
  };

  if (Object.keys(formData).length <= 0) {
    return (
      <div className="h-[200px]">
        <Loading></Loading>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto pt-6 mt-6 max-w-4xl">
      <form>
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 text-xl text-red-700">
            <ImWarning className="w-6 h-6" />
            <h2 className="text-3xl font-semibold dark:text-white">
              Eliminar Rol del Sistema
            </h2>
          </div>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Asegúrese de que desea eliminar este rol. Esta acción no se puede
            deshacer.
          </p>
        </div>

        {/* Role Name Section */}
        <div className="mb-6 flex gap-4 justify-center items-center">
          <FaUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            readOnly
            id="role-name"
            name="roleName"
            value={formData.roleName || ""}
            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-3 w-full sm:w-[400px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
          />
        </div>

        {/* Delete Role Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            onClick={() =>submitForm}
            className="w-full sm:w-auto text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Eliminar Rol
          </button>
        </div>
      </form>
    </div>
  );
};

export default EliminarRol;
