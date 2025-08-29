import React from "react";
import { IoMdSearch } from "react-icons/io";
import { FaInfo } from "react-icons/fa6";
import SimpleSelect from "./SimpleSelect";
import type { SimpleSearchFormData } from "../types/search";

interface SimpleSearchProp {
  setFormData: React.Dispatch<React.SetStateAction<SimpleSearchFormData>>;
  obtenerResoluciones: (page: number) => void;
}
const SimpleSearch = ({
  obtenerResoluciones,
  setFormData,
}: SimpleSearchProp) => {
  const [termino, setTermino] = React.useState("");
  const [errorBusqueda, setErrorBusqueda] = React.useState("");
  const [label, setLabel] = React.useState("");
  const checkSearch = (valor: string) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s'"’-]+$/;

    if (regex.test(valor) || valor === "") {
      return true;
    } else {
      return false;
    }
  };

  const actualizarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (checkSearch(valor)) {
      setTermino(valor);
      setFormData((prevData) => ({
        ...prevData,
        busqueda: valor,
      }));

      //updateFormData("busqueda", valor);
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
    }
  };

  const updateFormData = (key: keyof SimpleSearchFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    setLabel(value);
  };

  const handleFormClick = (event: React.FormEvent) => {
    event.preventDefault();
    obtenerResoluciones(1);
  };

  return (
    <div>
      <div className="flex flex-col md:items-end sm:flex-row flex-wrap gap-4 p-2 m-2">
        <label htmlFor="simple-search" className="sr-only">
          Criterio de Búsqueda:
        </label>
        <SimpleSelect updateFormData={updateFormData} />
        <form
          onSubmit={handleFormClick}
          className="flex-1 flex flex-col sm:flex-row gap-4 relative"
        >
          <input
            type="text"
            id="simple-search"
            className="mt-4 bg-gray-50 peer border border-gray-300 text-gray-900 text-sm outline-none rounded-lg focus:border-2 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Ingrese termino de búsqueda"
            value={termino}
            onChange={(e) => actualizarInput(e)}
          />
          <label
            htmlFor="simple-search"
            className="absolute text-gray-400 capitalize peer-focus:text-blue-400 left-2 top-1 px-3 bg-white dark:bg-[#242e42]  text-xs"
          >
            {label}
          </label>
          <button
            type="button"
            onClick={() => obtenerResoluciones(1)}
            className="p-2.5 ms-2 mt-4 flex gap-2 items-center text-sm font-medium text-white bg-red-octopus-700 rounded-lg border hover:bg-red-octopus-800 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <IoMdSearch className="w-4 h-4" />
            <span className="">Buscar</span>
          </button>
        </form>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          {errorBusqueda.length > 0 && (
            <div
              id="alert-2"
              className="flex items-center p-4 mb-4 text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <FaInfo className="shrink-0 w-4 h-4" />
              <div className="ms-3 text-sm font-medium">{errorBusqueda}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSearch;
