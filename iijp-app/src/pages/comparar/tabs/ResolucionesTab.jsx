import React, { useEffect, useState } from "react";
import "../../../styles/paginate.css";
import Paginate from "../../../components/Paginate";
import PaginationData from "../../busqueda/PaginationData";
import Menciones from "../../magistrados/analisis/Menciones";
const ResolucionesTab = ({ setActualFormData ,data ,realizarBusqueda }) => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [totalRes, setTotalRes] = useState(0);

  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = (e) => {
    const selectedPage = Math.min(e.selected + 1, lastPage);
    realizarBusqueda(selectedPage);
  };

  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      setResoluciones(data.data);
      setLastPage(data.last_page);
      setPageCount(data.last_page);
      setTotalRes(data.total);
    }
  }, [data]);



  return (
    <div>
      <div className="row p-4">
        {resoluciones.length > 0 && (
          <div>
            <PaginationData
              data={resoluciones}
              total={totalRes}
              setFormData={setActualFormData}
            />
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

export default ResolucionesTab;
