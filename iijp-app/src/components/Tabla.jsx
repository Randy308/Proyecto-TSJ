import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Tabla = ({ data, columns }) => {
  const [sorting, setSorting] = React.useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const table = useReactTable({
    data,
    columns,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
    initialState: {
      pagination: {
        pageIndex: 2,
        pageSize: 10,
      },
    },
    defaultColumn: {
      size: 100, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 350, //enforced during column resizing
    },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="overflow-x-auto px-4">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="py-3 px-6 cursor-pointer select-none w-[200px]" // Fixed width for each column
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="ml-1">
                        {{
                          asc: <FaArrowUp className="w-4 h-4" />,
                          desc: <FaArrowDown className="w-4 h-4" />,
                        }[header.column.getIsSorted()] ?? null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-gray-100 dark:odd:bg-gray-900"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-4 px-6 max-h-[150px] overflow-hidden text-xs line-clamp-3 w-[200px]" // Match header width
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination flex justify-center mt-4 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Anterior
        </button>
        <span className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white">
          Página{" "}
          <strong>
            {Number.isNaN(table.getState().pagination.pageIndex + 1)
              ? 1
              : table.getState().pagination.pageIndex + 1}{" "}
            de {Number.isNaN(table.getPageCount()) ? 1 : table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Siguiente
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <span className="mr-2 dark:text-white">Filas por página:</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Tabla;
