import React from "react";
import { Link } from "react-router-dom";
import { navItemsAnalisis } from "../../data/NavItems";

const AnalisisHome = () => {
  return (
    <div className="py-4 my-4">
      <div>
        <h2 className="text-center py-4 text-3xl font-bold titulo">
          Herramientas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
          {navItemsAnalisis.map((item) => {
            return (
              <Link to={item.path} key={item.id}>
                <div
                  className={`card p-4 m-3 bg-red-100 rounded-md flex flex-col`}
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

                  <p className="p-4 text-xs">{item.resumen}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalisisHome;
