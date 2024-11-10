import React, { useEffect, useState } from "react";

const TablaXYZ = ({ data }) => {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [keyColumn, setKeyColumn] = useState(""); // Using state to track the key column

  // Function to transform the data
  const transformData = (data) => {
    if (data.length === 0) return [];

    const firstItem = data[0];
    const headers = Object.keys(firstItem);
    const groupedHeaders = {};

    // Loop through the headers and group them by their prefixes (before the underscore)
    let temp = "";
    headers.forEach((header) => {
      if (!header.includes("_")) {
        setKeyColumn(header); // Identifying the key field
        temp = header;
        return;
      }
      const [group, subGroup] = header.split("_");

      if (!groupedHeaders[group]) {
        groupedHeaders[group] = {};
      }
      groupedHeaders[group][subGroup] = null;
    });

    // Transform the data into a structured format
    return data.map((item) => {
      const newItem = { [temp]: item[temp] };

      Object.keys(groupedHeaders).forEach((group) => {
        newItem[group] = {};
        Object.keys(groupedHeaders[group]).forEach((subGroup) => {
          const originalHeader = `${group}_${subGroup}`;
          newItem[group][subGroup] = item[originalHeader] || 0;
        });
      });

      return newItem;
    });
  };

  // UseEffect to update tableData when the data prop changes
  useEffect(() => {
    if (data && data.length > 0) {
      setTableData(transformData(data));
    }
  }, [data]);

  // UseEffect to set headers after tableData is available
  useEffect(() => {
    if (tableData.length > 0) {
      const firstRow = tableData[0];
      setHeaders(
        Object.keys(firstRow)
          .filter((key) => key !== keyColumn) // Remove the key column from headers
          .reduce((acc, key) => {
            const subHeaders = Object.keys(firstRow[key]);
            acc.push({ group: key, subHeaders });
            return acc;
          }, [])
      );
    }
  }, [tableData, keyColumn]); // Depend on keyColumn to ensure headers update correctly

  return (
    <table className="w-full border-collapse table-auto dark:border-gray-700">
      {/* Ensure headers are not null or empty */}
      {headers.length > 0 && (
        <thead>
          <tr>
            <th
              className="border px-4 py-2 font-bold bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
              rowSpan="2"
            >
              {keyColumn}
            </th>{" "}
            {headers.map((header, index) => (
              <th
                key={index}
                colSpan={header.subHeaders.length}
                className="border px-4 py-2 font-bold bg-gray-100 text-center dark:bg-gray-800 dark:text-gray-300"
              >
                {header.group}
              </th>
            ))}
          </tr>
          <tr>
            {headers.map((header, index) =>
              header.subHeaders.map((subHeader, subIdx) => (
                <th
                  key={`${index}-${subIdx}`}
                  className="border px-4 py-2 font-bold bg-gray-100 text-center dark:bg-gray-800 dark:text-gray-300"
                >
                  {subHeader}
                </th>
              ))
            )}
          </tr>
        </thead>
      )}
      <tbody>
        {tableData.map((item, index) => (
          <tr
            key={index}
            className={`${
              index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
            } dark:border-gray-700`}
          >
            <td className="border px-4 py-2 dark:text-gray-300">
              {item[keyColumn]}
            </td>{" "}
            {headers.map((header) =>
              header.subHeaders.map((subHeader) => (
                <td
                  key={`${header.group}-${subHeader}`}
                  className="border px-4 py-2 text-center dark:text-gray-300"
                >
                  {item[header.group]?.[subHeader] !== undefined
                    ? item[header.group][subHeader].toFixed(2)
                    : 0}
                </td>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaXYZ;
