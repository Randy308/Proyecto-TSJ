import React, { useEffect, useState } from "react";

import "../../../styles/tabla.css";

const TablaResumen = ({ data, total }) => {

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
      <div className="p-4 titulo">
        Cantidad de Resoluciones: <span>{total}</span>
      </div>
      <table
        id="tbody-res"
        className="w-full text-sm text-left rtl:text-right p-4"
      >
        <thead
          id="tabla-resoluciones"
          className="text-x uppercase border-b p-4"
        >
          <tr className="p-4 m-4">
            <th className="text-center p-4 m-4">nro resolución</th>
            <th className="text-center p-4 m-4">fecha emisión</th> 
            <th className="text-center p-4 m-4">tipo resolución</th>
            <th className="text-center p-4 m-4">departamento</th>
            <th className="text-center p-4 m-4">sala</th>
            <th className="text-center p-4 m-4"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 p-4">
              <th className="roboto-regular text-center">{item.nro_resolucion}</th>
              <th className="roboto-regular text-center">{item.fecha_emision}</th>

              <th className="roboto-regular text-center">
                {item.tipo_resolucion}
              </th>
              <th className="roboto-regular text-center">
                {item.departamento}
              </th>
              <th className="roboto-regular text-center">{item.sala}</th>
              <th className="text-center">
                {" "}
                <button
                  href={`http://localhost:3000/Resolucion/${item.id}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:bg-gray-200 bg-white rounded-lg  border border-blue-600 mt-2 p-2"
                >
                  Ver resolución
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaResumen;
