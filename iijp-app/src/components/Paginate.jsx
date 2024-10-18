import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import ReactPaginate from "react-paginate";

const Paginate = ({handlePageClick, pageCount}) => {
  return (
    <div>
      <ReactPaginate
        breakLabel={
          <span className="mr-4 w-10 h-10 flex items-center justify-center pagina rounded-md">
            <HiDotsHorizontal />
          </span>
        }
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
  );
};

export default Paginate;
