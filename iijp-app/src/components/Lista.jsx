import { useFreeApi } from "../hooks/api/useFreeApi";
import React from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <div
        id="magistrados-analisis"
        className="p-4 m-4  mx-auto custom:mx-0"
      >
        <div className="flex justify-center">
          <span className="text-center font-extrabold text-2xl dark:text-white py-4">
            Lista de {texto}
          </span>
        </div>
        <div className="grid gap-4">
          {contenido.map((item) => (
            <a
              href={`/jurisprudencia/magistrado/${item.id}`}
              key={item.id}
              className="block text-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-lg tracking-tight text-gray-900 dark:text-white">
                {item.nombre}
              </h5>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lista;
