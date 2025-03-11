import React, { useState } from "react";
import "../../styles/tabla.css";
import Cabecera from "../../components/tables/Cabecera";
import { Link } from "react-router-dom";
const PaginationData = ({ data, setFormData }) => {
  const listaCabeceras = [
    {
      id: 1,
      title: "Fecha Emisión",
      nombre: "fecha_emision",
    },
    {
      id: 2,
      title: "Tipo de resolucion",
      nombre: "tipo_resolucion",
    },
    {
      id: 3,
      title: "Nro de resolucion",
      nombre: "nro_resolucion",
    },
    {
      id: 4,
      title: "Departamento",
      nombre: "departamento",
    },
    {
      id: 5,
      title: "Sala",
      nombre: "sala",
    },
  ];
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative overflow-x-auto">
      <table
        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border
         border-gray-300 dark:border-gray-600 rounded-lg p-4"
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {listaCabeceras.map((item) => (
              <Cabecera
                titulo={item.title}
                id={item.id}
                key={item.id}
                valor={item.nombre}
                setFormData={setFormData}
                setVisible={setVisible}
                visible={visible}
              ></Cabecera>
            ))}

            <th scope="col" className="px-6 py-3">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <th scope="row" className="px-6 py-4">
                {item.fecha_emision}
              </th>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {item.tipo_resolucion}
              </td>
              <td className="px-6 py-4">{item.nro_resolucion}</td>
              <td className="px-6 py-4">{item.departamento}</td>
              <td className="px-6 py-4">{item.sala}</td>
              <td className="px-6 py-4">
                <Link
                  to={`/jurisprudencia/resolucion/${item.id}`}
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Ver resolución
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginationData;
