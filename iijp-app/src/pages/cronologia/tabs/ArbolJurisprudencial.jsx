import React, { useCallback, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import "../../../styles/cronologia-jurisprudencia.css";
import JurisprudenciaService from "../../../services/JurisprudenciaService";
const ArbolJurisprudencial = ({ currentID, setCurrentID, arbol, setArbol }) => {

  const [temas, setTemas] = useState(null);

  const getNodos = useCallback(async () => {

    JurisprudenciaService.obtenerNodos({ id: currentID }).then(({ data }) => {
      setTemas(data);
    }).catch((error) => {
      console.error("Error al realizar la solicitud:", error);
    });

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
              className="p-4 text-white  text-xs text-center titulo rounded-lg materia-div bg-red-octopus-700  dark:bg-blue-500 dark:hover:bg-blue-700 hover:bg-red-octopus-900 hover:cursor-pointer max-w-[300px]"
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
