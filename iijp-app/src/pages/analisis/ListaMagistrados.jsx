import React, { useEffect, useState } from "react";
import MagistradoService from "../../services/MagistradoService";
import { Link } from "react-router-dom";

const ListaMagistrados = () => {
  const [contenido, setContenido] = useState([]);

  useEffect(() => {
    obtenerMagistrados();
  }, []);

  const obtenerMagistrados = async () => {
    await MagistradoService.getAllMagistrados()
      .then(({ data }) => {
        if (data) {
          console.log(data);
          setContenido(data);
        }
      })
      .catch((err) => {
        console.error("Existe un error:", err);
      });
  };

  return (
    <div className="p-4 m-4 mx-auto custom:mx-0">
      <div className="flex">
        <span className="font-extrabold text-2xl dark:text-white py-4">
          Lista de Magistrados
        </span>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="pb-4 bg-white dark:bg-gray-900">
          <label for="table-search" class="sr-only">
            Search
          </label>
        </div>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                ID
              </th>
              <th scope="col" class="px-6 py-3">
                Nombre
              </th>
              <th scope="col" class="px-6 py-3">
                Primera mención
              </th>
              <th scope="col" class="px-6 py-3">
                Ultima mención
              </th>
              <th scope="col" class="px-6 py-3">
                Periodo de duración
              </th>
              <th scope="col" class="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {contenido.map((item) => (
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
               
              >
                <td class="px-6 py-4"> {item.id}</td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.nombre}
                </th>
                <td class="px-6 py-4"> {item.fecha_min}</td>
                <td class="px-6 py-4"> {item.fecha_max}</td>
                <td class="px-6 py-4">{item.duracion}</td>
                <td class="px-6 py-4">
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
