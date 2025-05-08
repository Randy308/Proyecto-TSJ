import React, { useEffect, useState } from "react";

import axios from "axios";

import NameInput from "../../../components/form/NameInput";
import AuthUser from "../../../auth/AuthUser";
import { useMagistradosContext } from "../../../context/magistradosContext";
import MagistradoService from "../../../services/MagistradoService";
import Loading from "../../../components/Loading";
import { toast } from "react-toastify";

const EditarMagistrado = ({ id, setShowModal }) => {
  const { getToken } = AuthUser();
  const { magistrados } = useMagistradosContext();
  const [name, setName] = useState("");
  const endpoint = process.env.REACT_APP_IMAGE_SERVER;
  const [nameError, setNameError] = useState("");

  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);

  useEffect(() => {
    const magistrado = magistrados.find((item) => item.id === id);
    setName(magistrado.nombre);
    if (magistrado.ruta_imagen) {
      setImgData(endpoint + "/" + magistrado.ruta_imagen);
    }
  }, [magistrados]);

  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onload = () => setImgData(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const checkFields = () => {
    return name.trim().length < 3 || nameError;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (checkFields()) return;

    try {
      axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const formData = new FormData();
      formData.append("nombre", name);
      if (picture) {
        formData.append("image", picture);
      }

      const token = getToken();
      if (!token) {
        console.error("Token no disponible");
        return;
      }

      const { data } = await MagistradoService.updateMagistrado(
        id,
        formData,
        getToken()
      );

      if (data) {
        setShowModal(false);
        toast.success(
          "La información del magistrado se ha actualizado exitosamente"
        );
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };
  if (name === "") {
    return <Loading></Loading>
  }

  return (
    <div className="pt-4 mt-4">
      <form
        onSubmit={submitForm}
        encType="multipart/form-data"
        className="max-w-sm mx-auto p-4 m-4 bg-white dark:bg-gray-700 dark:border-gray-900 border border-gray-300 rounded-md"
      >
        <NameInput
          input={name}
          setInput={setName}
          inputError={nameError}
          setInputError={setNameError}
          titulo="Nombre"
        />

        <label
          htmlFor="file_input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Subir imagen
        </label>
        <input
          id="file_input"
          type="file"
          accept="image/*"
          onChange={onChangePicture}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />

        {imgData && (
          <div className="p-4 m-4">
            <img
              className="rounded-lg shadow-md"
              src={imgData}
              alt="Vista previa"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={checkFields()}
          className={` mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${checkFields()
              ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
              : ""
            }`}
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default EditarMagistrado;
