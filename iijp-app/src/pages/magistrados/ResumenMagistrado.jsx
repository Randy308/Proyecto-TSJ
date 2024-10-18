import React, { useEffect, useState } from "react";
import axios from "axios";
import TablaResumen from "./tabla/TablaResumen";
import "../../styles/paginate.css";
import Paginate from "../../components/Paginate";
const ResumenMagistrado = ({ id }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState([]);

  const [lastPage, setLastPage] = useState(1);
  const [totalRes, setTotalRes] = useState(0);
  useEffect(() => {
    obtenerResoluciones(1);
  }, []);

  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = (e) => {
    const selectedPage = Math.min(e.selected + 1, lastPage);
    obtenerResoluciones(selectedPage);
  };
  const obtenerResoluciones = async (page) => {
    try {
      const response = await axios.get(
        `${endpoint}/obtener-resoluciones-magistrado`,
        {
          params: {
            id: id,
            page: page,
          },
        }
      );
      if (response.data.data.length > 0) {
        setResoluciones(response.data.data);
        setLastPage(response.data.last_page);
        setPageCount(response.data.last_page);
        setTotalRes(response.data.total);
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      className="md:container mx-auto px-40 custom:px-0"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        {resoluciones.length > 0 && (
          <TablaResumen data={resoluciones} total={totalRes} />
        )}
        <Paginate
          handlePageClick={handlePageClick}
          pageCount={pageCount}
        ></Paginate>
      </div>
    </div>
  );
};

export default ResumenMagistrado;
