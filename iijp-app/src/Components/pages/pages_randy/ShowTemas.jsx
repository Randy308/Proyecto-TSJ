import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../Components/Loading";
import "../../../Styles/Styles_randy/cronologia-jurisprudencia.css"
const endpoint = "http://localhost:8000/api";
const arbol = []
const ShowTemas = () => {
  const [temas, setTemas] = useState(null);
  const [currentTema, setCurrentTema] = useState(null);


  useEffect(() => {
    getAllTemas();
  }, []);

  const setActivo = (id) => {
    if (currentTema === id) {
      setCurrentTema(null);
    } else {
      setCurrentTema(null);
      getAllHijos(id);
      const padre = temas.find(tema => tema.id === id)?.nombre;
      
      arbol.push(padre)
      console.log(arbol)
      console.log(typeof(temas))
    }
  };

  const getAllHijos = async (id) => {
    try {
      const response = await axios.get(`${endpoint}/salas-hijos/${id}`);
      setTemas(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const getAllTemas = async () => {
    try {
      const response = await axios.get(`${endpoint}/temas-generales`);
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  if (temas === null) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: 800, height: 800 }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <div className="container m-4 p-4" style={{ height: 800 }}>
      <div>
        <p className="text-bold text-3xl text-center">Seleccione Materia</p>
      </div>
      <div className="flex gap-4 flex-wrap flex-row w-100 h-100 p-4 m-4">
        {temas.map((tema) => (
          <div
            className={`p-4 rounded-lg materia-div ${ currentTema !== null &&
              currentTema === tema.id
                ? "bg-blue-500 current"
                : "bg-blue-200 hover:bg-blue-500 hover:cursor-pointer ocultar"
            }  ${ currentTema === null
                ? "show"
                : " "
            }`}
            key={tema.id}
            id={tema.id}
            onClick={() => setActivo(tema.id)} // Correct usage of onClick
          >
            {tema.nombre}
          </div>
        ))}

      </div>
    </div>
  );
};

export default ShowTemas;
