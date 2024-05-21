import React from "react";
import { jurisprudenciaItems } from "./Jurisprudencia/JurisprudenciaItems";
import { Link } from "react-router-dom";
import "../../Styles/jurisprudencia.css"
const Jurisprudencia = () => {
  return (
    <main className="main">
      <div>
        <h2 className="text-center py-4 text-lg">Herramientas</h2>
        <div className="flex p-4 justify-center">
        {jurisprudenciaItems.map((item) => {
          return (
            <div className="card p-4 m-3 bg-gray-100 rounded-md">
              <div className="flex justify-center">{item.icon}</div>
              <p className="text-center py-4">{item.title}</p>
              <hr className="border-black" />
              <Link to={item.path}>
                <button className="rounded-lg bg-blue-500 text-white p-3 m-4 hover:bg-blue-800">Acceder</button>
              </Link>
            </div>
          );
        })}
        </div>
      </div>
    </main>
  );
};

export default Jurisprudencia;
