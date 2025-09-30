import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import SimpleSelect from "../../components/SimpleSelect";
import type { SimpleSearchFormData } from "../../types/search";
import { FaInfo } from "react-icons/fa6";
import { useCronologiaContext } from "../../context/cronologiaContext";

interface Props {
  searchDescriptors: (page: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<SimpleSearchFormData>>;
}
const SimpleSearchForm = ({
  searchDescriptors,
  setFormData,
}: Props) => {
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const {busqueda:termino , setBusqueda:setTermino} = useCronologiaContext();

  const searchIcon = useMemo(() => <FaSearch className="w-4 h-4" />, []);

  const [label, setLabel] = useState("");

  const updateFormData = (key: keyof SimpleSearchFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    setLabel(value);
  };

  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();
    searchDescriptors(1);
  };

  const checkSearch = (valor: string) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s/'"’-]+$/;

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
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
    }
  };

  return (
    <div className="flex-1">
      <form onSubmit={handleClick} className="flex gap-2">
        <SimpleSelect updateFormData={updateFormData} type="jurisprudencia" />
        <div className="relative w-full">
          <input
            type="text"
            id="voice-search"
            value={termino}
            onChange={(e) => actualizarInput(e)}
            className="bg-white peer dark:bg-[#242e42] outline-none h-full border focus:border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-octopus-500 focus:border-red-octopus-500 dark:focus:ring-blue-500 dark: block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue-500"
            placeholder="Búsqueda de jurisprudencia...."
            required
          />
          <label className="absolute dark:peer-focus:text-blue-500 peer-focus:text-red-octopus-800 capitalize left-2 -top-1 px-3 bg-white dark:bg-[#242e42] text-gray-400 text-xs">
            {label}
          </label>
         
        </div>
        <button
          type="submit"
          className="flex items-center bg-red-octopus-600 p-4 text-white rounded-lg hover:bg-red-octopus-700 focus:ring-4 focus:ring-red-octopus-300 dark:focus:ring-red-octopus-800"
        >
          {searchIcon}{" "}
        </button>
      </form>
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

export default SimpleSearchForm;
