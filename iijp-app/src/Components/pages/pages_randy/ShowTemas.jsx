import React, { useEffect, useState } from "react";
import axios from "axios";

const endpoint = "http://localhost:8000/api";
const ShowTemas = () => {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    getAllTemas();
  }, []);

  const getAllTemas = async () => {
    try {
      const response = await axios.get(`${endpoint}/temas-generales`);
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div className="container m-4 p-4">
      <div>
        <p className="text-bold text-3xl text-center">Seleccione Materia</p>
      </div>
      <div className="flex gap-4 flex-wrap flex-row w-100 h-100 p-4 m-4">
        {temas.map((tema) => (
          <div className="p-4 bg-blue-200 hover:bg-blue-500 hover:cursor-pointer rounded-lg">{tema.nombre}</div>
        ))}
      </div>
    </div>
  );
};

export default ShowTemas;
