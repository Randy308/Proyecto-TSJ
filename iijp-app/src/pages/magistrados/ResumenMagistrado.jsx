import React, { useEffect, useState } from "react";
import axios from "axios";
import TablaResumen from "./analisis/TablaResumen";
import "../../styles/paginate.css";
import Paginate from "../../components/Paginate";
import AgTabla from "../../components/AgTabla";
import PaginationData from "../busqueda/PaginationData";
import Menciones from "./analisis/Menciones";
const ResumenMagistrado = ({ id }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
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

  const [formData, setFormData] = useState({
    variable: "fecha_emision",
    orden: "desc",
  });

  useEffect(() => {
    obtenerResoluciones(1);
  }, [formData]);

  const obtenerResoluciones = async (page) => {
    try {
      const {data} = await axios.get(
        `${endpoint}/obtener-resoluciones-magistrado`,
        {
          params: {
            id: id,
            variable : formData.variable,
            orden:formData.orden,
            page: page,

          },
        }
      );
      if (data.data.length > 0) {
        setResoluciones(data.data);
        setLastPage(data.last_page);
        setPageCount(data.last_page);
        setTotalRes(data.total);
        const headers = Object.keys(data.data[0]).map((header) => ({
          field: header,
          sortable: true,
          resizable: true,
        }));
        setColumnDefs(headers);
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      className="p-4"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
      {resoluciones.length > 0 && (
        <div className="flex flex-row flex-wrap justify-around">
        <PaginationData data={resoluciones} total={totalRes} setFormData={setFormData} />
        <Menciones id={id}></Menciones>
        </div>
          
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
