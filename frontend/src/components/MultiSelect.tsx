import React, { useMemo, useState } from "react";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import type { SearchField } from "../types/search";

interface MultiSelectProps {
  type?: string;
  selectedOptions: SearchField[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<SearchField[]>>;
}

const MultiSelect = ({
  type = "resoluciones",
  selectedOptions,
  setSelectedOptions,
}: MultiSelectProps) => {
  const [show, setShow] = useState(false);
  const [idCounter, setIdCounter] = useState(1);

  const options = useMemo(() => {
    const lista = [
      { value: "ratio", nombre: "Ratio" },
      { value: "descriptor", nombre: "Descriptor" },
      { value: "restrictor", nombre: "Restrictor" },
      { value: "proceso", nombre: "Proceso" },
      { value: "sintesis", nombre: "Síntesis" },
      { value: "maxima", nombre: "Máxima" },
      { value: "precedente", nombre: "Precedente" },
      { value: "nro_resolucion", nombre: "Número de Resolución" },
      { value: "nro_expediente", nombre: "Número de Expediente" },
    ];

    const list = [
      { value: "contenido", nombre: "Contenido" },
      { value: "proceso", nombre: "Proceso" },
      { value: "sintesis", nombre: "Síntesis" },
      { value: "maxima", nombre: "Maxima" },
      { value: "precedente", nombre: "Precedente" },
      { value: "nro_resolucion", nombre: "Número de Resolución" },
      { value: "nro_expediente", nombre: "Número de Expediente" },
    ];

    return type === "jurisprudencia" ? lista : list;
  }, [type]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === "all") return;

    if (selectedOptions.length >= 3) {
      toast.warning("Solo puedes seleccionar hasta 3 campos");
      return;
    }

    setShow(false);
    setSelectedOptions((prev) => [
      ...prev,
      { value: "", id: idCounter, operator: "AND", field: newValue },
    ]);
    setIdCounter(idCounter + 1);
  };

  const closeIcon = useMemo(
    () => (
      <IoMdClose className="group-hover:text-red-400 text-black dark:text-white" />
    ),
    []
  );

  const arrowIcon = useMemo(() => <IoIosArrowDown className="h-5 w-5" />, []);
  const secondaryCloseIcon = useMemo(
    () => <IoMdClose className="h-5 w-5" />,
    []
  );

  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="flex dark:bg-gray-700 relative m-1 justify-between items-center gap-2 border border-gray-500 rounded-md py-2 w-auto"
    >
      {/* Etiquetas seleccionadas */}
      <div className="ps-1">
        {selectedOptions.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <div
                key={option.id}
                className="text-xs dark:bg-gray-800 capitalize p-1 rounded-md border border-gray-500 hover:cursor-pointer hover:border-red-400 flex gap-2 justify-between items-center group"
                onClick={() =>
                  setSelectedOptions((prev) =>
                    prev.filter((item) => item.id !== Number(option.id))
                  )
                }
              >
                <span className="text-black dark:text-white">
                  {option.field}
                </span>
                {closeIcon}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-300 text-xs ps-2">
            Seleccione los campos donde buscar
          </div>
        )}
      </div>

      {/* Controles + Dropdown */}
      <div className="text-xs p-1 rounded-md group hover:border-red-400 border-gray-300 flex gap-2 justify-between items-center">
        {selectedOptions.length > 0 && (
          <a
            className="hover:text-gray-400 hover:cursor-pointer"
            onClick={() => setSelectedOptions([])}
          >
            {secondaryCloseIcon}
          </a>
        )}
        <a className="hover:text-gray-400 hover:cursor-pointer border-l-2 pl-2">
          {arrowIcon}
        </a>

        {/* Lista desplegable */}
        <div
          className={`absolute flex flex-col border shadow-lg top-full w-full left-0 bg-white dark:bg-gray-800 z-10 transition-opacity duration-200 ${
            show ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {options.map((option) => (
            <label className="group w-full flex" key={option.value}>
              <input
                name={option.value}
                type="checkbox"
                className="hidden"
                value={option.value}
                onChange={handleChange}
              />
              <span className="flex-1 py-2 text-md ps-4 dark:text-white dark:bg-gray-700 hover:dark:bg-gray-950 hover:bg-red-octopus-300 hover:text-white w-full">
                {option.nombre}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
