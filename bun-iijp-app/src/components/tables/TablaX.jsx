import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TablaX = ({ data = [], columns = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  // Separar la última fila (asumimos que es la de total)
  const normalRows = data.slice(0, -1);
  const lastRow = data[data.length - 1];

  // Ordenar solo las filas normales
  const sortedRows = [...normalRows].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === bVal) return 0;
    if (sortConfig.direction === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const finalRows = [...sortedRows, lastRow];

  return (
    <div className="overflow-x-auto p-2 m-2 uppercase">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {columns && columns.length > 2 && (
            <tr>
              <th className="bg-white"></th>
              <th
                colSpan={Math.abs(columns.length > 2 ? columns.length - 2 : 0)}
                className="text-center border"
              >
                Departamento
              </th>
            </tr>
          )}

          <tr>
            {columns &&columns.map((item, idx) => {
              const isSorted = sortConfig.key === item.accessorKey;
              const icon = isSorted ? (
                sortConfig.direction === "asc" ? (
                  <FaArrowUp className="inline ml-1" />
                ) : (
                  <FaArrowDown className="inline ml-1" />
                )
              ) : null;

              return (
                <th
                  key={idx}
                  className="px-4 py-2 cursor-pointer select-none border"
                  onClick={() => handleSort(item.accessorKey)}
                >
                  {item.header} {icon}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {finalRows.map((val, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-t border-gray-200 dark:border-gray-600 ${
                rowIndex === finalRows.length - 1
                  ? "font-bold bg-gray-100 dark:bg-gray-800"
                  : ""
              }`}
            >
              {columns && columns.map((item, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {val[item.accessorKey]}
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
