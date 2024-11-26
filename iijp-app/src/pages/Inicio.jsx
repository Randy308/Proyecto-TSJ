import React from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
import "../styles/inicio.css";
// "baseUrl": ".",
// "paths": {
//   "@/*": ["./src/*"]
// }
const Inicio = () => {
  const tarjetas = [
    {
      nombre: "SAMED",
      path: "/dinamicas",
      icon: <FaChartPie className="tarjetas-icon-style" />,
    },
    {
      nombre: "SISGECRO",
      path: "/jurisprudencia",
      icon: <FaMagnifyingGlassChart className="tarjetas-icon-style" />,
    },
  ];
  return (
    <div className="flex flex-row  flex-wrap p-4 m-4 custom:p-0 justify-center items-center custom:flex-col gap-3 text-black dark:text-white">
      <div className="p-4 grow-0">
        <p className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl dark:text-white">Sistemas Gestión y Analisis de Metricas de la Justicia Ordinaria</p>
        <div className="mb-4 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 max-w-[700px] text-justify custom:max-w-none">
          A través de este sistema web, se facilita el análisis de los Autos
          Supremos y otras resoluciones del Tribunal Supremo de Justicia,
          proporcionando una herramienta para organizar y comprender datos
          legales de manera eficiente, accesible y comprensible. Esto no solo
          potencia la educación y el conocimiento en temas legales, sino que
          también promueve la transparencia y el acceso a la justicia en
          Bolivia. 
        </div>
      </div>
      <div className="p-4 grow flex flex-col items-center">
        <p className="inline-flex items-center text-start mb-4 text-lg text-black dark:text-white">Enlaces de interés</p>
        <div className="flex gap-4 justify-center card-container custom:flex-col text-black dark:text-white">
          {tarjetas.map((tarjeta) => {
            return (
              <div
                className="card box-content aspect-square bg-[#31363F] hover:bg-[#222831] p-4 mx-4 hover:cursor-pointer rounded-lg"
                key={tarjeta.nombre}
              >
                <div className="flex justify-center border-black  m-2 p-2">
                  {tarjeta.icon}
                </div>
                <p className="text-center text-white">{tarjeta.nombre}</p>

                <div className="flex justify-center p-4">
                  <Link to={tarjeta.path}>
                    <button className="bg-[#76ABAE] text-center text-white p-3 rounded-lg">
                      Acceder
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Inicio;
