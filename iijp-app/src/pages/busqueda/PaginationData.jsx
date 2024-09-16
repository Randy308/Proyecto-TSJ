import React from "react";
import "../../styles/tabla.css";
const PaginationData = ({ data }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#DDD]">
      <table id="tabla-resoluciones" className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-black uppercase bg-[#DDD] border-b">
          <tr>
            <th scope="col" className="px-6 py-3">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3">
            Tipo de resolucion
            </th>
            <th scope="col" className="px-6 py-3">
              Nro de resolucion
            </th>
            <th scope="col" className="px-6 py-3">
              Departamento
            </th>
            <th scope="col" className="px-6 py-3">
              Sala
            </th>
            <th scope="col" className="px-6 py-3">
              Accion
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 text-black bg-white">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {item.fecha_emision}
              </th>
              <td className="px-6 py-4">{item.tipo_resolucion}</td>
              <td className="px-6 py-4">{item.nro_resolucion}</td>
              <td className="px-6 py-4">{item.departamento}</td>
              <td className="px-6 py-4">{item.sala}</td>
              <td className="px-6 py-4">
                <a
                  href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.id}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Ver resolucion
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginationData;
