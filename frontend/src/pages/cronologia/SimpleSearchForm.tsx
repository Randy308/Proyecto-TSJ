import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import SimpleSelect from "../../components/SimpleSelect";
import type { SimpleSearchFormData } from "../../types/search";
import { FaInfo } from "react-icons/fa6";

interface Props {
  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;
  searchDescriptors: (checked: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<SimpleSearchFormData>>;
  actualizarInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const SimpleSearchForm = ({
  busqueda,
  setBusqueda,
  searchDescriptors,
  setFormData,
}: Props) => {
  const [checked, setChecked] = useState(true);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const [termino, setTermino] = useState("");

  const searchIcon = useMemo(() => <FaSearch className="w-4 h-4 " />, []);

  const clearIcon = useMemo(() => <MdClear className="w-4 h-4 " />, []);

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
    searchDescriptors(checked);
    setChecked(true);
  };

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
          <label className="absolute capitalize left-2 -top-1 px-3 bg-white dark:bg-[#242e42] text-gray-400 text-xs">
            {label}
          </label>
          <input
            type="text"
            id="voice-search"
            value={termino}
            onChange={(e) => actualizarInput(e)}
            className="bg-gray-50 outline-none h-full border focus:border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-octopus-500 focus:border-red-octopus-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-octopus-500 dark:focus:border-red-octopus-500"
            placeholder="Búsqueda de jurisprudencia...."
            required
          />
          {busqueda.length > 0 && (
            <a
              className="absolute inset-y-0 end-0 flex items-center justify-center pe-3 hover:cursor-pointer"
              onClick={() => setBusqueda("")}
            >
              {clearIcon}
            </a>
          )}
        </div>
        <button
          type="submit"
          className="flex items-center bg-red-octopus-600 p-4 text-white rounded-lg hover:bg-red-octopus-700 focus:ring-4 focus:ring-red-octopus-300 dark:focus:ring-red-octopus-800"
        >
          {searchIcon}{" "}
        </button>
      </form>
      {/* <div className="flex flex-row flex-wrap items-center md:justify-end gap-4 mt-2 text-lg text-black dark:text-gray-300">
        <div className="flex items-center">
          {" "}
          <input
            type="radio"
            value={"res"}
            id="checkbox-res"
            checked={checked}
            onChange={() => setChecked(true)}
            className="peer"
          />
          <label htmlFor="checkbox-res">Buscar resoluciones</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            value={"desc"}
            id="checkbox-desc"
            checked={!checked}
            onChange={() => setChecked(false)}
            className="peer"
          />
          <label htmlFor="checkbox-desc">Buscar descriptores</label>
        </div>
      </div> */}
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
