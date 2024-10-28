import React, { useEffect, useState } from "react";
import "../../styles/tabla.css";
import Cabecera from "../../components/Cabecera";
const PaginationData = ({ data }) => {
  const [formData, setFormData] = useState({
    variable: "",
    orden: "",
  });
  const [estadoInicial, setEstadoInicial] = useState(1);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="relative overflow-x-auto">
      <table
        id="tabla-resoluciones"
        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border
         border-gray-300 dark:border-white rounded-lg p-4"
      >
        <thead className="text-xs text-black uppercase bg-[#F8F8F8] border-b dark:bg-[#222628] dark:text-white">
          <tr>
            <Cabecera
              titulo={"Fecha"}
              setFormData={setFormData}
              estadoInicial={estadoInicial}
            ></Cabecera>
            <Cabecera
              titulo={"Tipo de resolucion"}
              setFormData={setFormData}
              estadoInicial={estadoInicial}
            ></Cabecera>
            <Cabecera
              titulo={"Nro de resolucion"}
              setFormData={setFormData}
              estadoInicial={estadoInicial}
            ></Cabecera>
            <Cabecera
              titulo={"Departamento"}
              setFormData={setFormData}
              estadoInicial={estadoInicial}
            ></Cabecera>
            <Cabecera
              titulo={"Sala"}
              setFormData={setFormData}
              estadoInicial={estadoInicial}
            ></Cabecera>
            <th scope="col" className="px-6 py-3">
              Accion
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 text-black odd:bg-white even:bg-gray-100 dark:text-white
              dark:odd:bg-[#222628] dark:even:bg-[#181D1F]"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
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
