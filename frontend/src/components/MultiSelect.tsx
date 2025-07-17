import React, { useMemo, useState } from "react";

import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
interface MultiSelectProps {
  type?: string;
  selectedOptions: { value: string; id: string }[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<{ value: string; id: string }[]>>;
}
const MultiSelect = ({
  type = "resoluciones",
  selectedOptions,
  setSelectedOptions,
}: MultiSelectProps) => {
  const [show, setShow] = useState(false);

  const options = useMemo(() => {
    const lista = [
      { value: "ratio", label: "Ratio" },
      { value: "descriptor", label: "Descriptor" },
      { value: "restrictor", label: "Restrictor" },
      { value: "contenido", label: "Contenido" },
      { value: "proceso", label: "Proceso" },
      { value: "sintesis", label: "Síntesis" },
      { value: "maxima", label: "Máxima" },
      { value: "precedente", label: "Precedente" },
    ];

    const list = [
      { value: "contenido", label: "Contenido" },
      { value: "proceso", label: "Proceso" },
      { value: "sintesis", label: "Síntesis" },
      { value: "maxima", label: "Maxima" },
      { value: "precedente", label: "Precedente" },
      // { value: "demandado", label: "Demandado" },
      // { value: "demandante", label: "Demandante" },
    ];

    if (type === "jurisprudencia") {
      return lista;
    }
    return list;
  }, [type]);

  // const [searchTerm, setSearchTerm] = useState("");

  // const [filteredOptions, setFilteredOptions] = useState(options);

  // const search = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value.toLowerCase();
  //   setSearchTerm(e.target.value);
  //   if (value === "") {
  //     setFilteredOptions(options);
  //     return;
  //   }
  //   const filtered = options.filter((f) =>
  //     f.label.toLowerCase().startsWith(value)
  //   );
  //   setFilteredOptions(filtered);
  // };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const id = event.target.name;
    if (newValue === "all") {
      return;
    }
    if (selectedOptions.find((option) => option.value === newValue)) {
      return;
    }

    if (selectedOptions.length >= 3) {
      toast.warning("Solo puedes seleccionar hasta 3 campos");
      return;
    }
    setShow(false);
    setSelectedOptions((prev) => [...prev, { value:newValue, id:id }]);
  };

  return (
    <div className="flex dark:bg-gray-800 relative m-2 justify-between items-center gap-2 border rounded-md py-2 w-auto">
      <div className="ps-1">
        {selectedOptions.length > 0 ? (
          <>
            <div className="flex flex-row sm:flex-col flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <div
                  key={option.id}
                  className="text-xs dark:bg-gray-900 capitalize p-1 rounded-md border hover:cursor-pointer border-gray-300 hover:border-red-400 flex gap-2 justify-between items-center group"
                  onClick={() =>
                    setSelectedOptions((prev) =>
                      prev.filter((item) => item !== option)
                    )
                  }
                >
                  <span>{option.value}</span>
                  <IoMdClose className="group-hover:text-red-400" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-500 dark:text-gray-300 text-xs ps-2">
            Seleccione los campos donde buscar
          </div>
        )}
      </div>

      <div className="text-xs p-1 rounded-md group hover:border-red-400  border-gray-300 flex gap-2 justify-between items-center">
        {selectedOptions.length > 0 && (
          <a
            className="hover:text-gray-400"
            onClick={() => setSelectedOptions([])}
          >
            <IoMdClose className="h-5 w-5" />
          </a>
        )}
        <a className="hover:text-gray-400" onClick={() => setShow(!show)}>
          <IoIosArrowDown className="h-5 w-5" />
        </a>
        <div
          className={`absolute flex flex-col border shadow-lg top-full w-full left-0 bg-white dark:bg-gray-800 z-10 ${
            show ? "block" : "hidden"
          }`}
        >
          {/* <input
            type="text"
            onChange={search}
            value={searchTerm}
            placeholder="Buscar..."
            className="p-2 m-2 dark:text-black border rounded-lg"
          /> */}
          {options.map(
            (option,index) =>
              !selectedOptions.some((selected) => selected.value === option.value) && (
                <label className="group w-full flex" key={option.value}>
                  <input
                    name={`${index}-${option.value}`}
                    key={option.value}
                    type="checkbox"
                    className="hidden group"
                    value={option.value}
                    onChange={handleChange}
                  />
                  <span className="flex-1 py-2 text-md ps-4 dark:bg-gray-700 hover:dark:bg-gray-950 hover:bg-red-octopus-300 hover:text-white w-full">
                    {option.label}
                  </span>
                </label>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
