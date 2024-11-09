import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  flexRender,
} from "@tanstack/react-table";

const TablaXY = () => {
  const data = [
    { name: "John", age: 28, department: "Engineering" },
    { name: "Jane", age: 22, department: "Engineering" },
    { name: "Jim", age: 35, department: "Marketing" },
    { name: "Jill", age: 40, department: "Marketing" },
    { name: "Jack", age: 32, department: "Engineering" },
    { name: "Daniel", age: 32, department: "Engineering" },
    { name: "Jeff", age: 32, department: "Engineering" },
  ];

  const columns = [
    {
      header: "Department",
      accessorKey: "department",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
        header: "Age",
        id:"age",
      accessorKey: "age",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      groupBy: ["age"], // Grouping by age
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    autoResetPageIndex: false,
  });

  return (
    <div className="max-w-sm mx-auto custom:overflow-x-auto custom:max-w-max">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-3 px-6 select-none whitespace-nowrap border border-gray-300 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              {row.getIsGrouped() ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="bg-gray-200 dark:bg-gray-600 py-2 px-6"
                  >
                    {row.getCanExpand() ? (
                      <span
                        onClick={row.getToggleExpandedHandler()}
                        className="cursor-pointer"
                      >
                        {row.getIsExpanded() ? "[-]" : "[+]"}
                      </span>
                    ) : null}
                    {flexRender(
                      row.getAllCells()[0].column.columnDef.cell,
                      row.getContext()
                    )}
                  </td>
                </tr>
              ) : (
                <tr className="bg-white dark:bg-gray-800 text-black dark:text-white odd:bg-gray-100 dark:odd:bg-gray-900">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-4 px-6 whitespace-nowrap border border-gray-300 dark:border-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaXY;
