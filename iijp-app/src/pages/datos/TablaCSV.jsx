import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useThemeContext } from "../../components/ThemeProvider";

const TablaCSV = () => {
  const { readString } = usePapaParse();
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  const handleString = (CSVString) => {
    readString(CSVString, {
      worker: true,
      delimiter: ",",
      skipEmptyLines: true,
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError("Error al procesar el archivo CSV");
          console.error(results.errors);
        } else {
          setRowData(results.data);
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0]).map((header) => ({
              field: header,
              sortable: true,
              resizable: true,
            }));
            setColumnDefs(headers);
          }
        }
      },
    });
  };

  const cargarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvString = event.target.result;
        handleString(csvString);
      };
      reader.onerror = () => {
        setError("No se pudo leer el archivo CSV");
      };
      reader.readAsText(file);
    } else {
      setError("No se seleccionó ningún archivo");
    }
  };
  const isDarkMode = useThemeContext();
  return (
    <div className="flex justify-center items-center">
      <div className={isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}   style={{ height: 500, width: "95%" }}>
        <input type="file" accept=".csv" onChange={cargarArchivo} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {rowData.length > 0 && (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            domLayout="autoHeight"
          />
        )}
      </div>
    </div>
  );
};

export default TablaCSV;
