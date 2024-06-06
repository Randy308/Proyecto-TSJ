import React from "react";
import { jurisprudenciaItems } from "./JurisprudenciaItems";
import { Link } from "react-router-dom";
import "../../../Styles/Styles_randy/jurisprudencia.css";
const Jurisprudencia = () => {
  return (
    <main className="main py-4 my-4">
      <div>
        <h2 className="text-center py-4 text-lg">Herramientas</h2>
        <div className="flex p-4 m-4 justify-center items-center custom:flex-col">
          {jurisprudenciaItems.map((item) => {
            return (
              <div className={`card p-4 m-3 bg-${item.color} rounded-md`}>
                <div id="j-container-icons" className="flex justify-center">
                  {item.icon}
                </div>
                <p className="text-center py-4">{item.title}</p>
                <Link to={item.path} className="flex justify-center p-4 m-4">
                  <button className="rounded-lg bg-blue-500 text-white p-3 m-4 hover:bg-blue-800">
                    Acceder
                  </button>
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
