import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "../hooks/useSessionStorage";
import type { Datos,  FiltroNombre, Variable } from "../types";

interface ItemProyeccion {
  detalles: string;
  id: number;
  value: string;
}
interface Props {
  item: ItemProyeccion;
  removeItemById: () => void;
  data: Variable[];
}
const Dropdown = ({ item, removeItemById, data }: Props) => {
  const [visible, setVisible] = useState(false);

  const [terminos, setTerminos] = useState<string | null>(null);

  sessionStorage.removeItem("formData");
  const [formData, setFormData] = useSessionStorage<Datos>("formData", {
    tipo_resolucion: "all",
    sala: "all",
    magistrado: "all",
    departamento: "all",
    forma_resolucion: "all",
    tipo_jurisprudencia: "all",
    materia: "all",
    periodo: "all",
  });
  const navigate = useNavigate();
  const guardar = (item: any) => {
    if (typeof item === "object" && item !== null) {
      const updatedFormData = { ...formData, ...item };

      setFormData(updatedFormData);
    }

    console.log(item);
    navigate("/busqueda", { state: { flag: true } });
  };

  const navegar = (detalles: any, ruta = "/proyeccion") => {
    navigate(ruta, { state: { parametros: detalles } });
  };

  const transformarClave = (clave: string) => {
    const nuevaClave = clave.replace(/_/g, " de "); // Reemplazar guiones bajos
    return nuevaClave.charAt(0).toUpperCase() + nuevaClave.slice(1); // Capitalizar la primera letra
  };

  // Función para obtener los nombres de los parámetros

  const obtenerNombresParametros = (detalles) => {
    let resultado = {};

    Object.entries(detalles).forEach(([clave, valor]) => {
      const key: FiltroNombre = clave;
      const value = Number(valor);
      if (data[key]) {
        // Buscar el elemento en la lista correspondiente
        const encontrado = data.find((item) => String(item.nombre) === key);
        if (encontrado) {
          resultado[key] = encontrado.nombre; // Agregar solo si hay coincidencia
        }
      }
    });

    return resultado;
  };

  useEffect(() => {
    setTerminos(obtenerNombresParametros(item.detalles));
  }, []);

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
                onClick={() => guardar(item.detalles)}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Ver resoluciones
              </a>
            </li>
            <li>
              <a
                onClick={() => navegar(item.detalles)}
                className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Realizar proyección
              </a>
            </li>
            <li>
              <a
                onClick={() =>
                  navegar(item.detalles, "/jurisprudencia/avanzado")
                }
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
        <div className="text-gray-400 dark:text-gray-300 text-xs mt-2">
          {Object.entries(terminos).map(([k, v]) => (
            <div key={k}>
              <span className="bold">{transformarClave(k)}</span>: {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
