import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import UserService from "../../../services/UserService";
import { ImWarning } from "react-icons/im";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../../../context/userContext";
import { AuthUser } from "../../../auth";
import type { CreateUser } from "../../../types";

interface UsuarioProps {
  setShowModal: (val: boolean) => void;
  id: number;
}

const EliminarUsuario = ({ id, setShowModal }: UsuarioProps) => {
  const { can } = AuthUser();
  const navigate = useNavigate();
  const { users, obtenerUsers } = useUserContext();
  const [formData, setFormData] = useState<CreateUser>({} as CreateUser);

  useEffect(() => {
    if (!can("eliminar_usuarios")) {
      navigate("/");
    }
  }, [can, navigate]);
  useEffect(() => {
    if (users) {
      setFormData((users as CreateUser[]).find((item) => item.id === id) || {} as CreateUser);
    }

  }, [users]);

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {

      await UserService.deleteUser(id)
        .then(({ data }) => {
          if (data) {
            setShowModal(false);
            obtenerUsers(1);
            toast.success("El usuario ha sido eliminado exitosamente");
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        console.error("Server Error:", error.response?.data);
        console.error("Status Code:", error.response?.status);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "request" in error
      ) {
        console.error("Network Error: No response received from the server.");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        console.error(
          "Error Setting Up Request:",
          (error as { message: string }).message
        );
      }
    }
  };

  if (formData === null || Object.keys(formData).length === 0) {
    return (
      <div className="h-[200px]">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-4 mt-4">
      <form>
        <div className="mb-6 flex gap-4 justify-center items-center text-2xl">
          <ImWarning className="w-4 h-4 text-red-700" />
          <label
            htmlFor="name"
            className="block mb-2font-medium text-gray-900 dark:text-white"
          >
            Eliminar usuario del sistema
          </label>
        </div>
        <div className="w-full mb-4 flex gap-2 items-center justify-center">
          <FaUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="flex-grow-1 text-gray-900 dark:text-white">
            {formData.name || ""}
          </span>
          <input
            type="email"
            readOnly
            id="voice-search"
            value={formData.email || ""}
            className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  
            p-2.5 flex-grow-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            onClick={submitForm}
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Eliminar usuario
          </button>

          <button
            type="submit"
            onClick={submitForm}
            className="bg-white text-red-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:text-red-600  dark:hover:bg-gray-300 dark:focus:ring-red-800"
          >
            Eliminar usuario y su contenido
          </button>
        </div>
      </form>
    </div>
  );
};

export default EliminarUsuario;
