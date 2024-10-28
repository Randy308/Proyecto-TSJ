import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Menciones = ({ id }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [menciones, setMenciones] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const currentPage = useRef(1);
  const [totalRes, setTotalRes] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    obtenerMenciones(currentPage.current);
  }, []);

  const handlePageClick = (e) => {
    currentPage.current = Math.min(currentPage.current + 1, lastPage);
    obtenerResoluciones(currentPage.current);
  };
  const obtenerMenciones = async (page) => {
    try {
      const { data } = await axios.get(`${endpoint}/obtener-coautores`, {
        params: {
          id: id,
          page: page,
        },
      });
      console.log(data);
      if (data.total > 0) {
        setMenciones(data.menciones);
        setLastPage(data.last_page);
        setPageCount(data.last_page);
        setTotalRes(data.total);
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (
    typeof menciones !== "object" ||
    menciones === null ||
    Object.keys(menciones).length === 0
  ) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div className="w-1/5 custom:w-auto p-4">
      <div className="border-gray-500 border-b">
      <span className="titulo text-2xl ">Menciones</span>
      </div>
      
      
      <div >
        {Object.entries(menciones).map(([nombre, resoluciones]) => (
          <div key={nombre}>
            <h3 className="titulo font-bold">{nombre}</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="dark:text-white italic">Resoluciones: </div>
              {Array.isArray(resoluciones) && resoluciones.length > 0 ? (
                resoluciones.map((id) => (
                  <a
                    href={`http://localhost:3000/Jurisprudencia/Resolucion/${id}`}
                    className="text-xs text-blue-600 dark:text-blue-500 hover:underline" key={id}
                  >
                    {id}
                  </a>
                ))
              ) : (
                <span>No hay resoluciones disponibles.</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button type="button" className="bg-blue-600 hover:bg-blue-800 text-center p-2 my-4 text-white rounded-md">Cargar mas </button>
      </div>
    </div>
  );
};

export default Menciones;
