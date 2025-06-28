import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TablaX = ({ data, columns }) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto p-2 m-2 uppercase">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="py-3 px-6 cursor-pointer select-none whitespace-nowrap border border-gray-300 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-1">
                      {header.column.getIsSorted() === "asc" ? (
                        <FaArrowUp className="w-4 h-4" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <FaArrowDown className="w-4 h-4" />
                      ) : null}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`bg-white dark:bg-gray-800 text-black dark:text-white odd:bg-gray-100 dark:odd:bg-gray-900 ${
                rowIndex === table.getRowModel().rows.length - 1
                  ? "font-bold"
                  : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-4 px-6 whitespace-nowrap border border-gray-300 dark:border-gray-700"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaX;
