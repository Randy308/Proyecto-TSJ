import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
const Dropdown = ({
  item,
  setActualFormData,
  removeItemById,
  obtenerSerieTemporal,
}) => {
  const [visible, setVisible] = useState(false);
  const [oculto, setOculto] = useState(true);
  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-end px-4 pt-4">
        <button
          id="dropdownButton"
          onClick={() => setVisible((prev) => !prev)}
          data-dropdown-toggle="dropdown"
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <BsThreeDots className="w-5 h-5" />
        </button>
        <div
          id="dropdown"
          onMouseLeave={() => setVisible(false)}
          className={`z-10 text-base absolute list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${
            visible ? "" : "hidden"
          }`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <a
                onClick={() => setOculto((prev) => !prev)}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                {oculto ? "Ver detalles" : "Ocultar detalles"}
              </a>
            </li>
            <li>
              <a
                onClick={() => setActualFormData(item.detalles)}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Ver resoluciones
              </a>
            </li>
            <li>
              <a
                onClick={() => obtenerSerieTemporal(item.id)}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Realizar proyección
              </a>
            </li>
            <li>
              <a
                onClick={() => removeItemById(item.id)}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Eliminar
              </a>
            </li>
          </ul>
        </div>
      </div>
      {oculto ? (
        <div className="flex flex-col items-center pb-10">
          <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
            {toTitleCase(item.name.replace(/_/g, " "))} :
            <span>{item.value}</span>
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Termino de busqueda
          </span>
        </div>
      ) : (
        <div className="mx-4 text-sm">
          {item &&
            item.detalles &&
            Object.entries(item.detalles).map(([key, items]) => (
              <div key={key}>
                {key}={items}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
