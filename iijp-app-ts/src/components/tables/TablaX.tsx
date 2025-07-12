import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

type AccessorKey = string;

interface Column {
  accessorKey: AccessorKey;
  header: string;
}

interface SortConfig {
  key: AccessorKey | null;
  direction: "asc" | "desc";
}

interface TablaXProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  columns: Column[];
  children?: React.ReactNode;
}

const TablaX: React.FC<TablaXProps> = ({ data, columns, children }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: AccessorKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const normalRows = data.slice(0, -1);
  const lastRow = data[data.length - 1];

  const sortedRows = [...normalRows].sort((a, b) => {
    const key = sortConfig.key;
    if (!key) return 0;

    const aVal = a?.[key];
    const bVal = b?.[key];

    if (aVal === bVal) return 0;
    if (sortConfig.direction === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const finalRows = [...sortedRows, lastRow];

  return (
    <div className="overflow-x-auto p-2 m-2 uppercase">
      {children}
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {columns.length > 2 && (
            <tr>
              <th className="bg-white"></th>
              <th
                colSpan={columns.length - 2}
                className="text-center border"
              >
                Y
              </th>
            </tr>
          )}
          <tr>
            {columns.map((column, idx) => {
              const isSorted = sortConfig.key === column.accessorKey;
              const SortIcon = isSorted
                ? sortConfig.direction === "asc"
                  ? FaArrowUp
                  : FaArrowDown
                : null;

              return (
                <th
                  key={idx}
                  className="px-4 py-2 cursor-pointer select-none border"
                  onClick={() => handleSort(column.accessorKey)}
                >
                  {column.header}
                  {SortIcon && <SortIcon className="inline ml-1" />}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {finalRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-t border-gray-200 dark:border-gray-600 ${
                rowIndex === finalRows.length - 1
                  ? "font-bold bg-gray-100 dark:bg-gray-800"
                  : ""
              }`}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {row?.[col.accessorKey]}
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
