import { FaInfo } from "react-icons/fa6";
import Loading from "../../../components/Loading";
import React, { useState } from "react";
import AsyncButton from "../../../components/AsyncButton";
import { IoMdClose } from "react-icons/io";
import Filtros from "../../../components/Filtros";
import Resoluciones from "./Resoluciones";

const InputEscenciales = ({
  formData,
  setFormData,
  resultado,
  ids,
  isLoading,
  obtenerCronologia,
}) => {
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const checkSearch = (valor) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s'’-]+$/;

    if (regex.test(valor) || valor === "") {
      return true;
    } else {
      return false;
    }
  };

  const actualizarInput = (e) => {
    const valor = e.target.value;
    if (checkSearch(valor)) {
      setParametros("subtitulo", valor);
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
    }
  };

  const setParametros = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (
    typeof resultado !== "object" ||
    resultado === null ||
    Object.keys(resultado).length === 0
  ) {
    return <Loading />;
  }

  return (
    <div className="sm:p-4 grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5">
      <div>
        <div className="mb-2">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Subtitulo
          </label>
          <input
            type="text"
            id="text"
            value={formData.subtitulo}
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Agregar un subtitulo"
            required
          />
        </div>
        {errorBusqueda.length > 0 && (
          <div
            id="alert-2"
            class="flex items-center p-2 mb-6 text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <FaInfo class="shrink-0 w-4 h-4" />
            <div class="ms-3 text-sm font-medium">{errorBusqueda}</div>
          </div>
        )}

        <div className="text-b font-bold text-lg rounded-t-lg">
          <p className="titulo text-xl">Filtros</p>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-1">
          {Object.entries(resultado).map(([name, contenido]) => (
            <Filtros
              key={name}
              nombre={name}
              data={contenido}
              formData={formData}
              setFormData={setFormData}
            />
          ))}

          <div className="flex items-center mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={formData.seccion}
                onChange={(e) => setParametros("seccion", e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Incluir Sección de "Por tanto"
              </span>
            </label>
          </div>

          <div className="flex items-center mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={formData.recorrer}
                onChange={(e) => setParametros("recorrer", e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Excluir nodos hijos
              </span>
            </label>
          </div>
        </div>
        <div className="p-4">
          <label
            htmlFor="default-range"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cantidad: <output id="value">{formData.cantidad}</output>
          </label>
          <input
            id="default-range"
            type="range"
            min="1"
            max="30"
            value={formData.cantidad}
            step="1"
            onChange={(e) => setParametros("cantidad", e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg accent-blue-700 cursor-pointer dark:bg-gray-700 "
          />
        </div>
        <div className="p-4 flex items-center justify-center">
          <AsyncButton
            asyncFunction={obtenerCronologia}
            name={"Obtener Resoluciones"}
            isLoading={isLoading}
            full={false}
          />
        </div>
      </div>
      <div className="md:col-span-3 lg:col-span-4">
        <Resoluciones
          ids={ids}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>
    </div>
  );
};

export default InputEscenciales;
