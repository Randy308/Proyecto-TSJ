import React, { useEffect, useState } from "react";
import NameInput from "../../components/form/NameInput";
import TextInput from "../../components/form/TextInput";
import PostService from "../../services/PostService";
import axios from "axios";
import AuthUser from "../../auth/AuthUser";

const Post = () => {
  const { getToken } = AuthUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);

  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onload = () => setImgData(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    console.log(picture);
  }, [picture]);

  const checkFields = () => {
    return (
      name.trim().length < 3 ||
      description.trim().length < 3 ||
      nameError ||
      descriptionError
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (checkFields()) return;

    try {
      // Laravel maneja el token CSRF automáticamente si la cookie está presente
      axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const formData = new FormData();
      formData.append("titulo", name);
      formData.append("description", description);
      if (picture) {
        formData.append("image", picture);
      }

      const { data } = await PostService.createPost(formData, getToken());

      if (data) {
        console.log("Publicación guardada:", data.message);
        console.log(data);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };

  return (
    <div className="pt-4 mt-4">
      <h2 className="text-center text-black dark:text-white text-4xl font-bold">
        Crear Publicación
      </h2>
      <form
        onSubmit={submitForm}
        className="max-w-sm mx-auto p-4 m-4 bg-white dark:bg-gray-700 dark:border-gray-900 border border-gray-300 rounded-md"
      >
        <NameInput
          input={name}
          setInput={setName}
          inputError={nameError}
          setInputError={setNameError}
          titulo="Título"
        />

        <TextInput
          input={description}
          setInput={setDescription}
          inputError={descriptionError}
          setInputError={setDescriptionError}
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
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
            checkFields()
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

export default Post;
