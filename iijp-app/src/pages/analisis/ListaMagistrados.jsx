import React from "react";
import { Link } from "react-router-dom";
import { useMagistradosContext } from "../../context/magistradosContext";

const ListaMagistrados = () => {
  const { magistrados } = useMagistradosContext();

  return (
    <div className="p-4 m-4 mx-auto custom:mx-0">
      <div className="flex">
        <span className="font-extrabold text-3xl titulo uppercase dark:text-white py-4">
          Lista de Magistrados
        </span>
      </div>

      {/* Contenedor con scroll en pantallas pequeñas */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {/* Tabla visible en pantallas medianas y grandes */}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 hidden md:table">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Primera mención</th>
              <th className="px-6 py-3">Última mención</th>
              <th className="px-6 py-3">Periodo de duración</th>
              <th className="px-6 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {magistrados.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{item.id}</td>
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.nombre}
                </th>
                <td className="px-6 py-4">{item.fecha_min}</td>
                <td className="px-6 py-4">{item.fecha_max}</td>
                <td className="px-6 py-4">{item.duracion}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/jurisprudencia/magistrado/${item.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Ver ficha
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Vista en tarjetas para móviles */}
        <div className="flex flex-col gap-4 md:hidden">
          {magistrados.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
            >
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {item.nombre}
              </div>
              <div className="text-sm text-gray-500">ID: {item.id}</div>
              <div className="text-sm">
                <strong>Primera mención:</strong> {item.fecha_min}
              </div>
              <div className="text-sm">
                <strong>Última mención:</strong> {item.fecha_max}
              </div>
              <div className="text-sm">
                <strong>Duración:</strong> {item.duracion}
              </div>
              <div className="mt-2">
                <Link
                  to={`/jurisprudencia/magistrado/${item.id}`}
                  className="text-blue-600 dark:text-blue-500 font-medium hover:underline"
                >
                  Ver ficha
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaMagistrados;
