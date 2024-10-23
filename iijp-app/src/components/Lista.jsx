import { useFreeApi } from "../hooks/api/useFreeApi";
import React from "react";
import { useNavigate } from "react-router-dom"; // Importar navigate
import "../styles/styles_randy/analisis-magistrados.css";
import Loading from "./Loading";

const Lista = ({ url, texto, enlace }) => {
  const { contenido, isLoading, error } = useFreeApi(url);
  const navigate = useNavigate();
  console.log(contenido);

  const navegar = (id) => {
    navigate(`${enlace}/${id}`);
  };

  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div
      id="magistrados-analisis"
      className="py-4 my-4 w-3/5 custom:w-auto mx-auto custom:mx-0"
    >
      <div className="flex justify-center">
        <span className="text-center font-bold text-3xl titulo py-4">
          Lista de {texto}
        </span>
      </div>
      <div className="grid grid-cols-4 custom:grid-cols-2">
        {contenido.map((item) => (
          <div
            key={item.id}
            className="bg-blue-500 hover:bg-blue-700 p-4 m-4 cursor-pointer text-white rounded-lg text-center flex items-center justify-center"
            onClick={() => navegar(item.id)}
          >
            {item.nombre}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lista;
