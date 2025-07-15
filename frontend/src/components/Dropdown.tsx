import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface Termino {
  id: number;
  name: string;
  detalles: string;
  value: string;
}

interface DropdownProps {
  item: Termino;
  removeItemById: (id: number) => void;
}

const Dropdown = ({ item, removeItemById }: DropdownProps) => {
  const [visible, setVisible] = useState(false);
  sessionStorage.removeItem("formData");

  const navigate = useNavigate();

  const navegar = (item: Termino, ruta = "/proyeccion") => {
    navigate(ruta, { state: { parametros: item } });
  };

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
                onClick={() => navegar(item, "/jurisprudencia/avanzado")}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Realizar análisis
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
      <div className="flex flex-col items-center pb-10">
        <h5 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
          {item.value}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Termino de búsqueda
        </span>
      </div>
    </div>
  );
};

export default Dropdown;
