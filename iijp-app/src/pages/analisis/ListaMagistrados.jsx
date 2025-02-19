import React from "react";
import { Link } from "react-router-dom";
import { useMagistradosContext } from "../../context/magistradosContext";

const ListaMagistrados = () => {
  const {magistrados} = useMagistradosContext();

  return (
    <div className="p-4 m-4 mx-auto custom:mx-0">
      <div className="flex">
        <span className="font-extrabold text-2xl dark:text-white py-4">
          Lista de Magistrados
        </span>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Primera mención
              </th>
              <th scope="col" className="px-6 py-3">
                Ultima mención
              </th>
              <th scope="col" className="px-6 py-3">
                Periodo de duración
              </th>
              <th scope="col" className="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {magistrados.map((item,index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4"> {item.id}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.nombre}
                </th>
                <td className="px-6 py-4"> {item.fecha_min}</td>
                <td className="px-6 py-4"> {item.fecha_max}</td>
                <td className="px-6 py-4">{item.duracion}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/jurisprudencia/magistrado/${item.id}`}
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Ver ficha
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaMagistrados;
