import React, { useState } from "react";
import { useIcons } from "../../components/icons/Icons";
import { toast } from "react-toastify";
const SelectDropdown = ({
  name,
  tabla,
  listaX,
  setListaX,
  contenido,
  agregarTermino,
  size = 6,
}) => {
  const [limite, setLimite] = useState(2);

  const { removeAllIcon, checkAllIcon } = useIcons();

  const handleCheckboxChange = (event) => {
    const itemId = event.target.name;

    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      if (existingItem) {
        if (
          existingItem.ids.length >= size &&
          !existingItem.ids.includes(itemId)
        ) {
          toast.warning(
            `No se pueden agregar más de ${size} variables. Quite alguna antes de agregar.`
          );
          return prev;
        }

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
          toast.error(
            `No se puede agregar más de ${limite} variables. Por favor, elimine alguna.`
          );
          return prev;
        }
      }
    });
  };

  const clearList = () => {
    setListaX((prev) =>
      prev.filter((item) => !(item.name === name))
    );
  };

  const selectAll = () => {
    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      // Actualizar o crear un nuevo item
      const newItem = {
        name,
        ids: contenido.slice(0, size).map((item) => item.nombre),
      };

      if (existingItem) {
        return prev.map((item) => (item.name === name ? newItem : item));
      } else {
        if (prev.length < limite) {
          return [...prev, newItem];
        } else {
          toast.warning(`No se pueden agregar más de ${limite} variables.`);
          return prev;
        }
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1 mb-4 px-2 sm:text-xs max-h-[600px] overflow-y-scroll">
        <div className="grid grid-cols-2 gap-4 sm:text-xs">
          <a
            onClick={() => selectAll()}
            className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center justify-between border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {checkAllIcon}
            <span className="ms-2 text-xs">
              {size === 9 ? "Seleccionar todos" : "Seleccionar varios"}
            </span>
          </a>
          <a
            onClick={() => clearList()}
            className="dark:bg-gray-800 dark:border-gray-700 inline-flex items-center border hover:cursor-pointer border-gray-200 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            {removeAllIcon}
            <span className="ms-2 text-xs">Quitar Selección</span>
          </a>
        </div>
        <ul className="flex-1 grid grid-cols-1 py-4">
          {contenido.map((currentItem) => (
            <li key={currentItem.nombre} className="p-1 flex items-center">
              <input
                type="checkbox"
                id={currentItem.nombre + name}
                name={currentItem.nombre}
                value={currentItem.nombre}
                className="peer hidden"
                checked={listaX.some(
                  (item) =>
                    item.name === name && item.ids.includes(currentItem.nombre)
                )}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={currentItem.nombre + name}
                className="w-full p-2 cursor-pointer rounded-sm dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-gray-50  peer-checked:text-red-octopus-500 peer-checked:border-l-4 peer-checked:border-red-octopus-500 hover:text-gray-600 dark:peer-checked:text-gray-300 text-sm peer-checked:dark:bg-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700 capitalize"
              >
                {currentItem.nombre}
              </label>
            </li>
          ))}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => agregarTermino()}
              className="w-full text-white end-2.5 bottom-2.5 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-xs"
            >
              Cargar mas
            </button>
          </div>
        </ul>
      </div>
    </>
  );
};

export default SelectDropdown;
