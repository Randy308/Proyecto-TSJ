import React, { useEffect, useState } from "react";
import AuthUser from "../../auth/AuthUser";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import UserService from "../../services/UserService";
import { ImWarning } from "react-icons/im";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const EliminarUsuario = ({ id, setCounter, showModal, setShowModal }) => {
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState([]);
  const token = getToken();

  useEffect(() => {
    if (!can("eliminar_usuarios")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  useEffect(() => {
    UserService.getUser(id, token)
      .then(({ data }) => {
        console.log(data);
        setFormData(data);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [token]);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      console.log("CSRF token retrieved successfully.");

      await UserService.deleteUser(id, token)
        .then(({ data }) => {
          if (data) {
            console.log(data);
            setShowModal(false);
            setCounter((prev) => prev + 1);
            toast.success("El usuario ha sido eliminado exitosamente");
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
