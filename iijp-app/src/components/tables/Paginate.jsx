import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import ReactPaginate from "react-paginate";

const Paginate = ({handlePageClick, pageCount,actualPage}) => {
  return (
    <div>
      <ReactPaginate
        breakLabel={
          <span className="w-10 h-10 hover:bg-gray-200 dark:border-gray-700 border border-gray-300 flex items-center justify-center pagina rounded-md text-black dark:text-white">
            <HiDotsHorizontal className="w-5 h-5" />
          </span>
        }
        nextLabel={
          <span className="w-10 h-10 hover:bg-gray-200 dark:border-gray-700 border border-gray-300 dark:hover:bg-gray-700 flex items-center justify-center pagina rounded-md text-black dark:text-white">
            <BsChevronRight />
          </span>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={
          <span className="w-10 h-10 hover:bg-gray-200 dark:border-gray-700 border border-gray-300 dark:hover:bg-gray-700 flex items-center justify-center pagina rounded-md text-black dark:text-white">
            <BsChevronLeft />
          </span>
        }
        forcePage={actualPage}
        containerClassName="flex items-center justify-center my-4 gap-1 text-xs"
        pageClassName="block w-10 h-10 flex items-center justify-center border border-gray-300 
            rounded-md text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-700"
        activeClassName="text-[#450920] bg-[#EEB6C1] font-bold text-sm border border-[#450920] dark:border-gray-700 dark:text-white dark:bg-gray-700"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Paginate;
