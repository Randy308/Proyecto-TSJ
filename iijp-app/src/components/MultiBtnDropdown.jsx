import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
const MultiBtnDropdown = ({
  setVisible,
  visible,
  name,
  limite,
  listaX,
  setListaX,
  contenido,
}) => {
  const [activo, setActivo] = useState(false);
  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.name, 10);

    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      if (existingItem) {
        const updatedIds = existingItem.ids.includes(itemId)
          ? existingItem.ids.filter((id) => id !== itemId)
          : [...existingItem.ids, itemId];

        return updatedIds.length > 0 ? [{ name, ids: updatedIds }] : [];
      } else {
        if (limite === 0) {
          return prev;
        }

        return [{ name, ids: [itemId] }];
      }
    });
  };

  const handleClick = () => {
    const nextState = !activo;
    setActivo(nextState);

    if (nextState) {
      setVisible(name);
    } else {
      setVisible(null);
    }
  };
  useEffect(() => {
    if (visible != name) {
      setActivo(false);
    }
  }, [visible]);

  const convertirTitulo = (name) => {
    return String(name)
      .replace(/_/g, " ") // Reemplaza los guiones bajos por espacios
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Convierte la primera letra de cada palabra a mayúscula
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full justify-between  
         border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg 
         text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 
          dark:border-gray-700 dark:text-white  me-2 mb-2 ${
            listaX.some((item) => item.name === name)
              ? "bg-blue-700 hover:bg-blue-900 border text-white"
              : "bg-white hover:bg-gray-100 dark:hover:bg-gray-700 border text-gray-900 dark:bg-gray-800"
          }`}
      >
        {convertirTitulo(name)}
        {activo ? (
          <IoIosArrowUp className="w-6 h-5 me-2 -ms-1 " />
        ) : (
          <IoIosArrowDown className="w-6 h-5 me-2 -ms-1" />
        )}
      </button>
      <ul
        className={`flex flex-col gap-1 mb-4 max-h-[400px] overflow-x-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ${activo ? "" : "hidden"}`}
      >
        {contenido.map((currentItem) => (
          <li key={currentItem.id} className="px-2">
            <input
              type="checkbox"
              id={currentItem.nombre}
              name={currentItem.id}
              value={currentItem.id}
              className="hidden peer"
              checked={listaX.some(
                (item) =>
                  item.name === name && item.ids.includes(currentItem.id)
              )}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={currentItem.nombre}
              className="inline-flex items-center justify-between w-full p-2 custom:p-1 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex flex-row gap-3 items-center custom:gap-2">
                <div className="roboto-regular text-xs text-black dark:text-white custom:text-xs">
                  {currentItem.nombre}
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MultiBtnDropdown;
