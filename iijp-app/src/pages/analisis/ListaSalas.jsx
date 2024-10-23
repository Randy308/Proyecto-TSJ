import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/styles_randy/analisis-magistrados.css";
import { useNavigate } from "react-router-dom";

const ListaSalas = () => {
  const endpoint = process.env.REACT_APP_BACKEND;
  const navigate = useNavigate();
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    getAllMagistrados();
  }, []);


  const getAllMagistrados = async () => {
    try {
      const response = await axios.get(`${endpoint}/all-salas`);
      console.log(response.data);
      setSalas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const navegar = (id) => {
    navigate(`/Jurisprudencia/Estadistica/sala/${id}`);
  };

  return (
    <div
      id="magistrados-analisis"
      className="py-4 my-4 w-3/5 custom:w-auto mx-auto custom:mx-0"
    >
      <div className="flex justify-center">
        <span className="text-center font-bold text-3xl titulo py-4">
          Lista de salas
        </span>
      </div>
      <div className="grid grid-cols-4 custom:grid-cols-2">
        {salas.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-blue-500 hover:bg-blue-700 p-4 m-4 cursor-pointer text-white rounded-lg text-center flex items-center justify-center"
              onClick={() => navegar(item.id)}
            >
              {item.nombre}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListaSalas;
