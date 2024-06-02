import React from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
import "../../Styles/inicio.css";
const Inicio = () => {
  const tarjetas = [
    {
      nombre: "TCP Dinamicas",
      path: "/Dinamicas",
      icon: <FaChartPie className="tarjetas-icon-style" />,
    },
    {
      nombre: "TSJ Jurisprudencia",
      path: "/Jurisprudencia",
      icon: <FaMagnifyingGlassChart className="tarjetas-icon-style" />,
    },
  ];
  return (
    <div className="flex p-4 m-4 justify-center card-container custom:flex-col gap-3">
      {tarjetas.map((tarjeta) => {
        return (
          <div className="card box-content aspect-square bg-[#31363F] hover:bg-[#222831] p-4 mx-4 hover:cursor-pointer rounded-lg" key={tarjeta.nombre}>
            <div className="flex justify-center border-black  m-4 p-4">
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
  );
};

export default Inicio;
