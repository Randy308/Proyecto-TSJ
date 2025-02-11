import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../components/Loading";
import "../../../styles/styles_randy/cronologia-jurisprudencia.css";
import { FaSearch } from "react-icons/fa";
const ArbolJurisprudencial = ({ currentID, setCurrentID, arbol, setArbol }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [temas, setTemas] = useState(null);

  const getNodos = useCallback(async () => {
    try {
      const response = await axios.get(`${endpoint}/obtener-nodos`, {
        params: { id: currentID },
      });
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  }, [currentID]);

  useEffect(() => {
    getNodos();
  }, [getNodos]);

  useEffect(() => {
    if (currentID === null) return;
    const nombre = Array.isArray(temas) ? temas.find((tema) => tema.id === currentID)?.nombre : null;
  
    if (arbol.find((tema) => tema.id === currentID)?.nombre) return;
    if (nombre) {
      setTemas([]);
      setArbol((prevArbol) => [...prevArbol, { id: currentID, nombre }]);
      getNodos();
    }
  }, [currentID, temas, getNodos]);

  if (temas === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }
  return (
    <div className="m-2 p-2 custom:p-0 custom:m-0">
      <div className="slider-container">
        {temas &&
          temas.map((tema) => (
            <div
              className="p-4 text-white  custom:text-xs text-center titulo rounded-lg materia-div bg-red-octopus-700  dark:bg-blue-500 dark:hover:bg-blue-700 hover:bg-red-octopus-900 hover:cursor-pointer"
              key={tema.id}
              id={tema.id}
              onClick={() => setCurrentID(tema.id)}
            >
              {tema.nombre}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ArbolJurisprudencial;
