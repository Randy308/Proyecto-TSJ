import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import TablaResumen from "./tabla/TablaResumen";
import "../../styles/paginate.css";
const ResumenMagistrado = ({ id }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState([]);

  const [lastPage, setLastPage] = useState(1);
  const [totalRes ,setTotalRes] = useState(0);
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
        setTotalRes(response.data.total)
        console.log(response.data)
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
        {resoluciones.length > 0 && <TablaResumen data={resoluciones} total={totalRes} />}
        <div>
          <ReactPaginate
            breakLabel={<span className="mr-4 w-10 h-10 flex items-center justify-center pagina rounded-md"><HiDotsHorizontal /></span>}
            nextLabel={
              <span className="w-10 h-10 flex items-center justify-center pagina rounded-md">
                <BsChevronRight />
              </span>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={
              <span className="w-10 h-10 flex items-center justify-center pagina rounded-md mr-4">
                <BsChevronLeft />
              </span>
            }
            containerClassName="flex items-center justify-center mt-8 mb-4 gap-2"
            pageClassName="block w-10 h-10 flex items-center justify-center 
                  rounded-md mr-4 pagina"
            activeClassName="pagina-activa"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumenMagistrado;