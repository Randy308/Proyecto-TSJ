import React, { useEffect, useState } from "react";
import AuthUser from "../../auth/AuthUser";
import axios from "axios";
import UserService from "../../services/UserService";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

const EditarUsuario = ({ id, setCounter, roles }) => {
  const { getToken ,can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (!can("actualizar_usuarios")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);
  
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

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== "all"
        )
      );
      await UserService.updateUser(
        id,
        {
          ...filteredData,
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
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contraseña
          </label>
          <input
            type="password"
            value={formData.password || ""}
            id="password"
            name="password"
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="rol"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Seleccionar un rol
          </label>
          <select
            id="role"
            name="role"
            value={formData.role || ""}
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 capitalize"
          >
            <option disabled defaultValue={""} value={""}>
              Escoge un rol
            </option>
            {roles.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
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

export default EditarUsuario;
