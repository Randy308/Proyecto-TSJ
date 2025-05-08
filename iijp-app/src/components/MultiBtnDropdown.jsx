import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { BsCheck2All } from "react-icons/bs";
import { MdOutlineRemoveCircle } from "react-icons/md";
const MultiBtnDropdown = ({
  setVisible,
  visible,
  name,
  limite,
  listaX,
  setListaX,
  contenido,
  size = 999,
}) => {
  const [activo, setActivo] = useState(false);


  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.name, 10);

    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      if (existingItem) {
        const { ids } = existingItem;

        const alreadyIncluded = ids.includes(itemId);
        const newIds = alreadyIncluded
          ? ids.filter((id) => id !== itemId)
          : ids.length < size
            ? [...ids, itemId]
            : ids; // No agrega si se excede el límite

        return newIds.length > 0 ? [{ name, ids: newIds }] : [];
      } else {
        if (limite === 0) {
          return prev;
        }

        return [{ name, ids: [itemId] }];
      }
    });
  };


  const clearList = () => {
    setListaX([]);
  };

  const selectAll = () => {
    setListaX([{ name: name, ids: contenido.slice(0, size).map((item) => item.id) }]);
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
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full justify-between  
         border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg 
         text-sm px-5 py-4 text-center inline-flex items-center dark:focus:ring-gray-600 
          dark:border-gray-700 dark:text-white  me-2 mb-2 ${listaX.some((item) => item.name === name)
            ? "bg-red-octopus-700  border text-white"
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
        className={`gap-1 mb-4 max-h-[600px] overflow-x-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ${activo ? "" : "hidden"}`}
      >
        <li className="px-2 grid grid-cols-2 gap-2 custom:grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 sm:text-xs">
          <a
            onClick={() => selectAll()}
            className="dark:bg-gray-800 dark:border-gray-700 flex border hover:cursor-pointer border-gray-200 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <BsCheck2All className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="ms-3">Seleccionar todos</span>
          </a>
          <a
            onClick={() => clearList()}
            className="dark:bg-gray-800 dark:border-gray-700 flex border hover:cursor-pointer border-gray-200 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <MdOutlineRemoveCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="ms-3">Quitar Selección</span>
          </a>
        </li>

        <ul className="grid grid-cols-1 lg:grid-cols-2 pt-4 gap-4">
          {contenido.map((currentItem) => (
            <li key={currentItem.id} className="px-2">
              <input
                type="checkbox"
                id={currentItem.nombre + name}
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
                htmlFor={currentItem.nombre + name}
                className="inline-flex items-center justify-between w-full p-1 sm:p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:text-white  peer-checked:bg-red-octopus-500 hover:text-gray-600 dark:peer-checked:text-gray-300  peer-checked:dark:bg-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex flex-row gap-3 items-center custom:gap-2">
                  <div className="roboto-regular text-xs custom:text-xs">
                    {currentItem.nombre}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>

      </ul>
    </>
  );
};

export default MultiBtnDropdown;
