import { useEffect, useState } from "react";
import type { BaseData, DataRow } from "../types";

// --- Tipos ---

// --- Componente ---
export const TablaMultivariable = ({ records }: { records: BaseData[] }) => {
  const [data, setData] = useState<BaseData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [processedData, setProcessedData] = useState<DataRow[]>([]);
  const [stats, setStats] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (records && records.length > 0) {
      setData(records);
      const cols = getColumns(records);
      setColumns(cols);
      setProcessedData(preparaData(records, cols, "asc"));
      setStats(getStats(records, cols));
      setIsLoading(false);
    }
    console.log("TablaMultivariable records:", records);
  }, [records]);

  const getColumns = (data: BaseData[]) => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((k) => k !== "id");
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
    console.log("Ordered groups:", orderedGroups);
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

    console.log("Processed data:", result);
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

    const baseClasses = "border border-gray-300 p-3 text-left";
    const numericClasses = isNumeric ? "text-right font-mono" : "";
    const groupClasses =
      (span || 1) > 1 ? "bg-blue-50 dark:bg-slate-900 font-semibold" : "";

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
      <h1 className="text-3xl font-bold mb-4">Tabla Multivariable</h1>
      <form className="flex flex-row gap-4 flex-wrap items-center mb-6">
        <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Selecciona una columna para reordenar:
        </p>
        <select
          id="countries"
          onChange={(e) => {
            ReorderArray(e.target.value as keyof BaseData);
          }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {columns.map((col) =>
            col === "cantidad" ? null : (
              <option key={col} value={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </option>
            )
          )}
        </select>
      </form>
      <table className="w-full border-collapse  shadow dark:bg-gray-700">
        <thead className="bg-gray-200 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th key={col} className="border p-3 text-left font-semibold">
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {processedData.map((row, index) =>
            String(row.id).startsWith("Sub") ? (
              <tr key={index} className="bg-gray-100 dark:bg-gray-800">
                <td
                  colSpan={columns.length - 1}
                  className="border p-3 text-right border-gray-300"
                >
                  {row.id}
                </td>
                <td className="border p-3 text-right font-bold">
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
          <tr className="bg-gray-200 dark:bg-slate-900 border border-black font-bold">
            <td
              colSpan={columns.length - 1}
              className="border p-3 text-right font-bold border-gray-300"
            >
              Total
            </td>
            <td className="border p-3 text-right font-bold">
              {stats.cantidad || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
