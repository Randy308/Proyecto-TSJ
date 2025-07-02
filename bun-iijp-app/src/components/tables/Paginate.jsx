import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Paginate = ({ handlePageClick, pageCount, actualPage, totalCount }) => {


  return (
    <div className="flex justify-center sm:justify-between items-center p-2 text-black dark:text-white flex-wrap gap-4">
      <div>{totalCount} Resultados encontrados</div>

      <div className="flex items-center gap-2">
        <div>
          Página {actualPage} de {pageCount}
        </div>

        {/* Botón Anterior */}
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md border transition 
            ${actualPage <= 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-500 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          onClick={() => actualPage > 1 && handlePageClick(actualPage - 1)}
          disabled={actualPage <= 1}
          aria-label="Página anterior"
        >
          <BsChevronLeft />
        </button>

        {/* Botón Siguiente */}
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md border transition 
            ${actualPage >= pageCount
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-gray-500 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          onClick={() =>
            actualPage < pageCount && handlePageClick(actualPage + 1)
          }
          disabled={actualPage >= pageCount}
          aria-label="Página siguiente"
        >
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Paginate;
