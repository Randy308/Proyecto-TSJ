import React from "react";
import { jurisprudenciaItems } from "../data/JurisprudenciaItems";
import { Link } from "react-router-dom";
import "../styles/styles_randy/jurisprudencia.css";
const Jurisprudencia = () => {
  return (
    <div className="py-4 my-4">
      <div>
        <h2 className="text-center py-4 text-3xl font-bold titulo">
          Herramientas
        </h2>
        <div className="cards-container flex p-4 m-4 justify-center items-center custom:flex-col">
          {jurisprudenciaItems.map((item) => {
            return (
              <Link to={item.path} key={item.id}>
                <div
                  className={`card p-4 m-3 bg-${item.color} rounded-md flex flex-col`}
                >
                  <div
                    id="j-container-icons"
                    className="py-4 flex justify-center items-center"
                  >
                    {item.icon}
                  </div>
                  <p className="text-center text-lg font-bold text-white">
                    {item.title}
                  </p>

                  <p className="p-4 text-xs text-white">{item.resumen}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Jurisprudencia;
