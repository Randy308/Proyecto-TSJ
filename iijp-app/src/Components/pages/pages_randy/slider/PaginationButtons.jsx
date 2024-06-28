import React from 'react'
import ReactPaginate from "react-paginate";
const PaginationButtons = () => {
  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        //onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        //pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </div>
  )
}

export default PaginationButtons
