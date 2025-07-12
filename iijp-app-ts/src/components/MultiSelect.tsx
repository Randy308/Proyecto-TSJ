import { set } from "date-fns";
import React, { useState } from "react";

import { IoIosArrowDown, IoMdClose } from "react-icons/io";
interface MultiSelectProps {
  options: { label: string; value: string }[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}
const MultiSelect = ({
  options,
  selectedOptions,
  setSelectedOptions,
}: MultiSelectProps) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredOptions, setFilteredOptions] = useState(options);

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    if (value === "") {
      setFilteredOptions(options);
      return;
    }
    const filtered = options.filter((f) =>
      f.label.toLowerCase().startsWith(value)
    );
    setFilteredOptions(filtered);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue === "all") {
      return;
    }
    setShow(false);
    setSelectedOptions((prev) => [...prev, newValue]);
  };

  return (
    <div className="flex dark:bg-gray-600 relative m-2 justify-between items-center gap-2 border rounded-md py-2 w-auto lg:w-96">
      <div className="ps-1">
        {selectedOptions.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <div
                  key={option}
                  className="text-xs dark:bg-gray-900 capitalize p-1 rounded-md border hover:cursor-pointer border-gray-300 hover:border-red-400 flex gap-2 justify-between items-center group"
                  onClick={() =>
                    setSelectedOptions((prev) =>
                      prev.filter((item) => item !== option)
                    )
                  }
                >
                  <span>{option}</span>
                  <IoMdClose className="group-hover:text-red-400" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-xs ps-2">
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
          <input
            type="text" onChange={search} value={searchTerm}
            placeholder="Buscar..."
            className="p-2 m-2 border rounded-lg"
          />
          {filteredOptions.map(
            (option) =>
              !selectedOptions.includes(option.value) && (
                <label className="group w-full flex" key={option.value}>
                  <input
                    name={option.value}
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
