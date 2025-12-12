import React, { useMemo, useState } from "react";
import type { Faceta } from "../../types";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";

interface Props {
  faceta: Faceta[];
  setSelectedValues: React.Dispatch<React.SetStateAction<Faceta[]>>;
  selectedValues: Faceta[];
  nombre: string;
}
export const MultipleSelect = ({
  faceta,
  selectedValues,
  setSelectedValues,
  nombre,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleChange = (faceta: Faceta) => {
    if (selectedValues.some((option) => option.id === faceta.id)) {
      return;
    }
    setShow(false);
    setSelectedValues((prev) => [...prev, faceta]);
  };

  const clearList = () => {
    setSelectedValues([]);
    setShow(false);
  };
  const close = useMemo(() => <IoMdClose className="group-hover:text-red-400" />, []);
  const closeIcon = useMemo(() => <IoMdClose className="h-5 w-5" />, []);
  const arrowDownIcon = useMemo(() => <IoIosArrowDown className="h-5 w-5" />, []);

  return (
    <div className="flex flex-col" onMouseLeave={() => setShow(false)}>
      <p className="dark:text-white">{nombre}</p>
      <div className="relative flex flex-row justify-between items-center border-2 my-2 p-2 rounded-xl md:max-w-60">
        <div className="flex flex-row gap-2 items-center flex-wrap mt-2">
          {selectedValues.length > 0 ? (
            selectedValues.map((periodo) => (
              <div
                key={periodo.nombre}
                className="text-xs dark:text-white dark:bg-gray-800 capitalize p-1 rounded-md border border-gray-500 hover:cursor-pointer hover:border-red-400 flex gap-2 justify-between items-center group"
                onClick={() =>
                  setSelectedValues((prev) =>
                    prev.filter((item) => item.id !== periodo.id)
                  )
                }
              >
                <span>{periodo.nombre}</span>
                {close}
              </div>
            ))
          ) : (
            <div className="text-gray-900 dark:text-gray-300 text-xs ps-2">
              Analizar en todos los campos
            </div>
          )}
        </div>

        <div className="text-xs p-1 rounded-md group hover:border-red-400  border-gray-300 flex gap-2 justify-between items-center">
          {selectedValues.length > 0 && (
            <a
              className="hover:text-gray-400 hover:cursor-pointer"
              onClick={() => setSelectedValues([])}
            >
              {closeIcon}
            </a>
          )}
          <a
            className="hover:text-gray-400 hover:cursor-pointer border-l-2 pl-2"
            onClick={() => setShow(!show)}
          >
           {arrowDownIcon}
          </a>
          <div
            className={`absolute my-2 rounded-lg flex flex-col border shadow-lg top-full w-full left-0 bg-white dark:bg-gray-800 z-10 ${
              show ? "block" : "hidden"
            }`}
          >
            {faceta.length > 0 && faceta.length != selectedValues.length && (
              <div>
                <div className="flex flex-row flex-wrap p-2 sm:text-xs">
                  <a
                    onClick={() => clearList()}
                    className="flex-1 dark:bg-gray-800 dark:border-gray-700 inline-flex items-center justify-between border hover:cursor-pointer border-gray-200 p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="ps-1 text-[9px]">Seleccionar todos</span>
                  </a>
                  <a
                    onClick={() => clearList()}
                    className="flex-1 dark:bg-gray-800 dark:border-gray-700 inline-flex justify-center items-center border hover:cursor-pointer border-gray-200 p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <span className="ps-1 text-[9px]">Quitar Selección</span>
                  </a>
                </div>

                {faceta.map(
                  (option) =>
                    !selectedValues.some(
                      (selected) => selected.nombre === option.nombre
                    ) && (
                      <label className="group text-black dark:text-white w-full flex" key={option.nombre}>
                        <input
                          name={String(option.id)}
                          key={option.nombre}
                          type="checkbox"
                          className="hidden group"
                          value={option.nombre}
                          onChange={() => handleChange(option)}
                        />
                        <span className="flex-1 py-2 text-md ps-4 dark:bg-gray-700 hover:dark:bg-gray-950 hover:bg-red-octopus-300 hover:text-white w-full">
                          {option.nombre}
                        </span>
                      </label>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
