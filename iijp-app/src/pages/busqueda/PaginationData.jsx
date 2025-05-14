import React, { useState } from "react";
import "../../styles/tabla.css";
import Cabecera from "../../components/tables/Cabecera";
import { Link } from "react-router-dom";
import { MdDeleteForever, MdOutlineZoomInMap } from "react-icons/md";
import ResolucionTSJ from "../resoluciones/ResolucionTSJ";
import PortalButton from "../../components/modal/PortalButton";
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
         border-gray-300 dark:border-gray-600 rounded-lg p-4 hidden md:table"
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
            {data[0].contexto && <th>Contexto</th>}

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
              {item.contexto && (
                <td>
                  {" "}
                  <div dangerouslySetInnerHTML={{ __html: item.contexto }} />
                </td>
              )}

              <td className="px-6 py-4">
                <PortalButton
                  Icon={MdOutlineZoomInMap}
                  title="Auto Supremo"
                  color="red"
                  name={"Ver"}
                  large={true}
                  content={(setShowModal) => <ResolucionTSJ id={item.id} />}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-4 md:hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="text-lg font-bold text-gray-900 dark:text-white text-center">
              {item.nro_resolucion}
            </div>

            <div className="text-sm ">
              <strong>Fecha de emisión:</strong> {item.fecha_emision}
            </div>
            <div className="text-sm ">
              <strong>Tipo de resolución:</strong> {item.tipo_resolucion}
            </div>
            <div className="text-sm">
              <strong>Departamento:</strong>{" "}
              <span className="uppercase">{item.departamento}</span>
            </div>
            <div className="text-sm">
              <strong>Sala:</strong> {item.sala}
            </div>

            {item.contexto && (
              <div>
                <strong>Contexto:</strong>{" "}
                <div dangerouslySetInnerHTML={{ __html: item.contexto }} />
              </div>
            )}
            <div className="mt-2 flex gap-4 justify-center">
              <PortalButton
                Icon={MdOutlineZoomInMap}
                title="Auto Supremo"
                color="red"
                name={"Ver"}
                large={true}
                content={(setShowModal) => <ResolucionTSJ id={item.id} />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginationData;
