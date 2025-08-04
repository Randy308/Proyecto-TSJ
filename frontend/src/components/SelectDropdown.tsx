import { IoMdArrowDropdown } from "react-icons/io";
import type { Faceta } from "../types";
import { useState } from "react";

interface Select {
  id: string;
  nombre: string;
}
interface SelectDropdownProps {
  list: Faceta[] | Select[];
  handleSelect: (item: Faceta | Select) => void;
}

const SelectDropdown = ({
  list,
  handleSelect,
}: SelectDropdownProps) => {
  const [selected, setSelected] = useState<null | string>(null);

  const handleClick = (item: Select | Faceta) => {
    if (item.nombre) {
      setSelected(item.nombre);
      handleSelect(item);
    }
  };
  return (
    <a className="relative group border-2 p-2 rounded-lg flex justify-between items-center">
      {selected ? (
        <span className="text-sm capitalize text-gray-500 dark:text-white">
          {selected}
        </span>
      ) : (
        <span className="text-sm capitalize text-gray-500">Buscar en...</span>
      )}
      <IoMdArrowDropdown className="ms-3 h-5 w-16 dark:text-white" />
      <div className="absolute top-full z-40 scale-y-0 border-2 w-full m-2 p-2 group-hover:scale-y-100 origin-top duration-200 left-1/2 dark:text-white -translate-x-1/2 bg-white dark:bg-gray-600 rounded-lg text-black shadow-lg">
        <div className="flex flex-col gap-2 justify-start items-start  max-h-36 md:max-h-44 overflow-y-auto">
          {list.map((item) => (
            <span
              key={item.id}
              onClick={() => handleClick(item)}
              className="w-full text-left p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.nombre}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};

export default SelectDropdown;
