import { useEffect, useState } from "react";
import type { BaseData, DataRow } from "../types";
import { titulo } from "../utils/filterForm";
import { useAnalisisContext } from "../context";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
// --- Tipos ---

// --- Componente ---
export const TablaMultivariable = () => {
  const { tableData } = useAnalisisContext();
  const [data, setData] = useState<BaseData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [processedData, setProcessedData] = useState<DataRow[]>([]);
  const [stats, setStats] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setData(tableData);
      const cols = getColumns(tableData);
      setColumns(cols);
      setProcessedData(preparaData(tableData, cols, "asc"));
      setStats(getStats(tableData, cols));
      setIsLoading(false);
    }
  }, [tableData]);

  const getColumns = (data: BaseData[]) => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((k) => k !== "id");
  };

  const exportToExcel = () => {
    // 1. Crear hoja de cálculo a partir del JSON
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Crear libro de Excel y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // 3. Convertir a un archivo binario
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 4. Crear un blob y descargar
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "datos.xlsx");
  };

  const ReorderArray = (index: keyof BaseData) => {
    const keys = Object.keys(data[0]).filter((key) => key !== "cantidad");
    const uniqueElementsSet = new Set([index, ...keys, "cantidad"]);
    const reorderedData = data.map((item) => {
      const newItem: BaseData = {};
      uniqueElementsSet.forEach((key) => {
        if (key !== "id") {
          newItem[key] = item[key];
        }
      });
      return newItem;
    });
    setData(reorderedData);
    const cols = getColumns(reorderedData);
    setColumns(cols);
    setProcessedData(preparaData(reorderedData, cols, "asc"));
    setStats(getStats(reorderedData, cols));
  };

  const preparaData = (
    data: BaseData[],
    columns: string[],
    subGroupSort: "asc" | "desc" | "none" = "none"
  ) => {
    const columnsToGroup = Math.max(columns.length - 1, 1);
    const firstGroupCol = columns[0];

    // Agrupar por el primer nivel
    const groupMap: Record<string, BaseData[]> = {};
    data.forEach((row) => {
      const key = String(row[firstGroupCol]);
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(row);
    });

    // Si se pidió ordenar por subtotal
    const orderedGroups = Object.entries(groupMap).map(([groupName, rows]) => {
      const sortedRows =
        subGroupSort === "none"
          ? rows
          : [...rows].sort((a, b) =>
              subGroupSort === "asc"
                ? Number(a.cantidad) - Number(b.cantidad)
                : Number(b.cantidad) - Number(a.cantidad)
            );
      return [groupName, sortedRows] as [string, BaseData[]];
    });
    const result: DataRow[] = [];

    orderedGroups.forEach(([groupKey, groupRows]) => {
      // Ordenar internamente por los siguientes niveles

      const sortedGroup = [...groupRows].sort((a, b) => {
        for (let i = 1; i < columnsToGroup; i++) {
          const col = columns[i];
          if (a[col] !== b[col]) {
            return String(a[col]).localeCompare(String(b[col]));
          }
        }
        return 0;
      });

      let subtotal = 0;

      sortedGroup.forEach((row, index) => {
        subtotal += Number(row.cantidad) || 0;

        // Procesar spans
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedRow: any = { ...row, spans: {} };

        for (let colIndex = 0; colIndex < columnsToGroup; colIndex++) {
          const col = columns[colIndex];
          let isFirstInGroup = true;
          let groupSize = 1;

          for (let prevIndex = index - 1; prevIndex >= 0; prevIndex--) {
            const prevRow = sortedGroup[prevIndex];
            let allMatch = true;
            for (let i = 0; i <= colIndex; i++) {
              if (prevRow[columns[i]] !== row[columns[i]]) {
                allMatch = false;
                break;
              }
            }
            if (allMatch) {
              isFirstInGroup = false;
              break;
            }
          }

          if (isFirstInGroup) {
            for (
              let nextIndex = index + 1;
              nextIndex < sortedGroup.length;
              nextIndex++
            ) {
              const nextRow = sortedGroup[nextIndex];
              let allMatch = true;
              for (let i = 0; i <= colIndex; i++) {
                if (nextRow[columns[i]] !== row[columns[i]]) {
                  allMatch = false;
                  break;
                }
              }
              if (allMatch) groupSize++;
              else break;
            }
            processedRow.spans[col] = groupSize;
          } else {
            processedRow.spans[col] = 0;
          }
        }

        result.push(processedRow);
      });

      // Insertar subtotal por grupo
      if (columnsToGroup > 1) {
        result.push({
          id: `Subtotal de ${groupKey}`,
          [firstGroupCol]: `Subtotal de ${groupKey}`,
          cantidad: subtotal,
          spans: {},
        } as DataRow);
      }
    });

    return result;
  };
  const getStats = (data: BaseData[], columns: string[]) => {
    const statResults: Record<string, string> = {};

    columns.forEach((col) => {
      const values = data.map((row) => row[col]);
      const isNumeric = typeof values[0] === "number";

      if (isNumeric) {
        const total = values.reduce((sum, val) => Number(sum) + Number(val), 0);
        statResults[col] = `${total.toLocaleString()}`;
      } else {
        const unique = new Set(values);
        statResults[col] = `Únicos: ${unique.size}`;
      }
    });

    return statResults;
  };

  const renderCell = (
    row: DataRow,
    column: string,
    content: string | number,
    isNumeric = false
  ) => {
    const span = row.spans?.[column];
    if (span === 0) return null;

    const baseClasses =
      "border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm md:text-base";
    const numericClasses = isNumeric ? "text-right font-mono" : "text-left";
    const groupClasses =
      (span || 1) > 1 ? "bg-gray-100 dark:bg-gray-800 font-semibold" : "";

    return (
      <td
        key={column}
        rowSpan={span || 1}
        className={`${baseClasses} ${numericClasses} ${groupClasses}`}
      >
        {isNumeric ? (content as number).toLocaleString() : content}
      </td>
    );
  };

  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Tabla Multivariable
      </h1>

      <form className="flex flex-wrap items-center gap-4 mb-6">
        <label
          htmlFor="order-select"
          className="text-sm font-medium text-gray-900 dark:text-white"
        >
          Selecciona una columna para reordenar:
        </label>
        <select
          id="order-select"
          onChange={(e) => ReorderArray(e.target.value as keyof BaseData)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          {columns.map((col) =>
            col === "cantidad" ? null : (
              <option key={col} value={col}>
                {titulo(col)}
              </option>
            )
          )}
        </select>
      </form>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm md:text-base">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold"
                >
                  {titulo(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, index) =>
              String(row.id).startsWith("Sub") ? (
                <tr
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 text-sm md:text-base"
                >
                  <td
                    colSpan={columns.length - 1}
                    className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right italic"
                  >
                    {row.id}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right font-bold">
                    {row.cantidad ? `${row.cantidad}` : "Subtotal"}
                  </td>
                </tr>
              ) : (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {columns.map((col) =>
                    col === "cantidad"
                      ? renderCell(row, col, row[col], true)
                      : renderCell(row, col, row[col])
                  )}
                </tr>
              )
            )}
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm md:text-base font-bold">
              <td
                colSpan={columns.length - 1}
                className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-right"
              >
                Total
              </td>
              <td className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-right">
                {stats.cantidad?.toLocaleString() || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        onClick={exportToExcel}
        className="mt-4 px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-200 bg-gray-100 border-1 border-gray-600 text-gray-700 rounded"
      >
        <FaDownload />
        Descargar Tabla
      </button>
    </div>
  );
};
