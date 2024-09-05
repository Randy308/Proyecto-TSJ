import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import PaginationData from "../slider/PaginationData";
const ResumenMagistrado = ({ id, magistrado }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState([]);

  const [lastPage, setLastPage] = useState(1);

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
        {resoluciones.length > 0 && <PaginationData data={resoluciones} />}
        <div>
          <ReactPaginate
            breakLabel={<span className="mr-4">...</span>}
            nextLabel={
              <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-md">
                <BsChevronRight />
              </span>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={
              <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-md mr-4">
                <BsChevronLeft />
              </span>
            }
            containerClassName="flex items-center justify-center mt-8 mb-4 gap-2"
            pageClassName="block border border-solid w-10 h-10 flex items-center justify-center 
                  rounded-md mr-4 hover:bg-slate-100"
            activeClassName="bg-[#450920] text-white"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumenMagistrado;
