import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



import AuthUser from "../../../auth/AuthUser";
import { useUserContext } from "../../../context/userContext";
import Loading from "../../../components/Loading";
const VerUsuario = ({ id }) => {
  const { can } = AuthUser();
  const navigate = useNavigate();
  const { users } = useUserContext();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (!can("ver_usuario")) {
      navigate("/");
    }
  }, [can, navigate]);

  useEffect(() => {
    setFormData(users.find((item) => item.id === id));
  }, [users]);

  if (formData.length <= 0) {
    return (
      <div className="h-[300px]">
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
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white capitalize"
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            disabled
            value={formData.name || ""}
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
            disabled
            value={formData.email || ""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="roles"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rol
          </label>
          <input
            type="text"
            value={formData.role || ""}
            id="roles"
            disabled
            name="roles"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 capitalize"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default VerUsuario;
