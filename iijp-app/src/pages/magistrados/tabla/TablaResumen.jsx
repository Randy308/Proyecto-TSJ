import React from "react";

const TablaResumen = ({ data, total }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#DDD]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-black uppercase bg-[#DDD] border-b">
          <tr>
            <th scope="col" className="px-6 py-3">
              Cantidad de Resoluciones: <span className="titulo">{total}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 text-black bg-white"
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-row gap-4 justify-between text-gray-500">
                  <div >{item.fecha_emision}</div>
                  <div>{item.nro_resolucion}</div>
                </div>
                <div>
                  <div>Tipo: <span className="font-bold titulo">{item.tipo_resolucion}</span></div>
                  <div>Departamento: <span className="font-bold titulo">{item.departamento}</span></div>
                  <div>Sala: <span className="font-bold titulo">{item.sala}</span></div>
                </div>
                <div className="flex justify-end border-t border-blue-400">
                  <a
                    href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:bg-gray-200 bg-white rounded-lg  border border-blue-600 mt-2 p-2"
                  >
                    Ver resolucion
                  </a>
                </div>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResumen;
