import React from "react";
import { FaChartPie, FaMagnifyingGlassChart } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SubirResoluciones = () => {
  const tarjetas = [
    {
      nombre: "Carga de Autos Supremos (CSV)",
      path: "/admin/subir/autos-supremos",
      icon: <FaChartPie className="text-white w-[50px] h-[50px]" />,
    },
    {
      nombre: "Carga de Jurisprudencias (CSV)",
      path: "/admin/subir/jurisprudencia",
      icon: <FaMagnifyingGlassChart className="text-white w-[50px] h-[50px]" />,
    },
    {
      nombre: "Carga Automática (Web Scraping)",
      path: "/admin/subir-automatico",
      icon: <FaMagnifyingGlassChart className="text-white w-[50px] h-[50px]" />,
    },
  ];

  return (
    <div className="flex flex-col items-center container mx-auto pt-4 mt-4">
      {/* Título general */}
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white text-center">
        Opciones para subir Resoluciones
      </h1>

      {/* Tarjetas */}
      <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
        {tarjetas.map((tarjeta) => {
          return (
            <Link to={tarjeta.path} key={tarjeta.nombre}>
              <div className="group box-content  bg-[#31363F] hover:bg-[#222831] p-4 m-4 hover:cursor-pointer rounded-lg hover:scale-125">
                <div className="flex justify-center p-4 transition-transform border-black group-hover:animate-bounce">
                  {tarjeta.icon}
                </div>
                <p className="text-center text-white my-4 py-4">
                  {tarjeta.nombre}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubirResoluciones;
