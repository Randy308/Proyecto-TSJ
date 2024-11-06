import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TanstackTabla = ({ data }) => {
  const columns = [
    { accessorKey: "tipo", header: "Nombre", enableSorting: true },
    {
      accessorKey: "cantidad",
      header: "Frecuencia Absoluta",
      enableSorting: true,
    },
    {
      accessorKey: "acum",
      header: "Frecuencia Absoluta Acumulada",
      enableSorting: true,
    },
    {
      accessorKey: "relativo",
      header: "Frecuencia Relativa (%)",
      enableSorting: true,
    },
    {
      accessorKey: "relativo_acum",
      header: "Frecuencia Relativa Acumulado (%)",
      enableSorting: true,
    },
  ];

  const [sorting, setSorting] = React.useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
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
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  console.log("Current Page Index:", table.getState().pagination.pageIndex);
  console.log("Can Next Page:", table.getCanNextPage());
  console.log("Total Pages:", table.getPageCount());

  return (
    <div className="flex flex-col justify-center">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="py-3 px-6 cursor-pointer select-none"
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
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-4 px-6">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination flex justify-center mt-4 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Previous
        </button>
        <span className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white">
          Page{" "}
          <strong>
            {Number.isNaN(table.getState().pagination.pageIndex + 1)
              ? 1
              : table.getState().pagination.pageIndex + 1}{" "}
            of {Number.isNaN(table.getPageCount()) ? 1 : table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Next
        </button>
      </div>

      {/* Page Size Selector */}
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

export default TanstackTabla;
