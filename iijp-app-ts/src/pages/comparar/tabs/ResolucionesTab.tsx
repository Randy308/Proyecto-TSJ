import React, { useEffect, useState } from "react";
import Paginate from "../../../components/tables/Paginate";
import PaginationData from "../../busqueda/PaginationData";
const ResolucionesTab = ({ setActualFormData, data, realizarBusqueda }) => {
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
      {resoluciones.length > 0 && (
        <PaginationData
          data={resoluciones}
          total={totalRes}
          setFormData={setActualFormData}
        />
      )}
      <Paginate
        handlePageClick={handlePageClick}
        pageCount={pageCount}
      ></Paginate>
    </div>
  );
};

export default ResolucionesTab;
