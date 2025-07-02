import React, { useEffect, useState } from "react";
import { titulo } from "../utils/filterForm";
import { useIcons } from "./icons/Icons";
import { toast } from "react-toastify";
const MultiBtnDropdown = ({
  setVisible,
  visible,
  name,
  limite,
  listaX,
  setListaX,
  contenido,
  size = 8,
}) => {
  const [activo, setActivo] = useState(false);

  const { arrowDownIcon, arrowUpIcon, checkAllIcon, removeAllIcon, trashIcon } =
    useIcons();

  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.name, 10);

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
          return [...prev, { name, ids: [itemId] }];
        } else {
          toast.warning(`No se pueden agregar más de ${limite} variables.`);
          return prev;
        }
      }
    });
  };

  const eliminarElemento = (variable) => {
    const nuevaLista = listaX.filter((item) => item.name !== variable);
    setListaX(nuevaLista);
  };
  const clearList = () => {
    setListaX((prev) => prev.filter((item) => !(item.name === name)));
  };

  const selectAll = () => {
    setListaX((prev) => {
      const existingItem = prev.find((item) => item.name === name);

      // Actualizar o crear un nuevo item
      const newItem = {
        name,
        ids: contenido.slice(0, size).map((item) => item.id),
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

  return (
    <>
      <div
        className={`p-2 rounded-lg border flex items-center justify-between text-sm  me-2 mb-2`}
      >
        <div className="text-xs sm:text-sm text-black dark:text-gray-200"> {titulo(name)}</div>

        <div className="flex gap-4">
          {listaX &&
            listaX.length > 0 &&
            listaX.some((item) => item.name === name) && (
              <button
                className="p-2 bg-red-500 rounded-lg hover:bg-red-600 cursor-pointer "
                onClick={() => eliminarElemento(name)}
              >
                {trashIcon}
              </button>
            )}

          <button
            className="p-2 rounded-lg cursor-pointer border border-gray-400 dark:border-gray-600 "
            onClick={() => handleClick()}
          >
            {activo && activo.columna === name ? arrowUpIcon : arrowDownIcon}
          </button>
        </div>
      </div>

      <ul
        className={`gap-1 mb-4 max-h-[600px] overflow-x-auto  ${
          activo ? "" : "hidden"
        }`}
      >
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
            <li key={currentItem.id} className="p-1 flex items-center">
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
                className="w-full p-2 cursor-pointer rounded-sm dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-gray-50  peer-checked:text-red-octopus-500 peer-checked:border-l-4 peer-checked:border-red-octopus-500 hover:text-gray-600 dark:peer-checked:text-gray-300  peer-checked:dark:bg-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700 capitalize text-sm"
              >
                {currentItem.nombre}
              </label>
            </li>
          ))}
        </ul>
      </ul>
    </>
  );
};

export default MultiBtnDropdown;
