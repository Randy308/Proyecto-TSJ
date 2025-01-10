import React, { useEffect, useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { MdOutlineRemoveCircle } from "react-icons/md";
const SelectDropdown = ({
  name,
  tabla,
  listaX,
  setListaX,
  contenido,
}) => {

  const [limite,setLimite] = useState(2);
  const handleCheckboxChange = (event) => {
    const itemId = event.target.name;

    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      if (existingItem) {
        const updatedIds = existingItem.ids.includes(itemId)
          ? existingItem.ids.filter((id) => id !== itemId)
          : [...existingItem.ids, itemId];

        // Si los ids de este item quedan vacíos, eliminar este objeto
        if (updatedIds.length === 0) {
          return prev.filter((item) => item.name !== name);
        }

        // Actualizar el item con los ids modificados
        return prev.map((item) =>
          item.name === name ? { ...item, ids: updatedIds } : item
        );
      } else {
        // Agregar un nuevo item si no existe y el límite no se ha excedido
        if (prev.length < limite) {
          return [...prev, { name, tabla, ids: [itemId] }];
        } else {
          alert(`No se pueden agregar más de ${limite} variables.`);
          return prev;
        }
      }
    });
  };

  const clearList = () => {
    setListaX((prev) => prev.filter((item) => !(item.name === name && item.tabla === tabla)));
  };
  

  const selectAll = () => {
    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      // Actualizar o crear un nuevo item
      const newItem = {
        name,
        tabla,
        ids: contenido.map((item) => item.termino),
      };

      if (existingItem) {
        return prev.map((item) => (item.name === name ? newItem : item));
      } else {
        if (prev.length < limite) {
          return [...prev, newItem];
        } else {
          alert(`No se pueden agregar más de ${limite} variables.`);
          return prev;
        }
      }
    });
  };

  return (
    <>
      <ul
        className={`flex flex-col gap-1 mb-4 max-h-[400px] overflow-x-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`}
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
        {contenido.map((currentItem) => (
          <li key={currentItem.termino} className="px-2">
            <input
              type="checkbox"
              id={currentItem.termino}
              name={currentItem.termino}
              value={currentItem.termino}
              className="hidden peer"
              checked={listaX.some(
                (item) =>
                  item.name === name && item.ids.includes(currentItem.termino)
              )}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor={currentItem.termino}
              className="inline-flex items-center justify-between w-full p-2 custom:p-1 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex flex-row gap-3 items-center custom:gap-2">
                <div className="roboto-regular text-xs text-black dark:text-white custom:text-xs">
                  {currentItem.termino}
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SelectDropdown;
