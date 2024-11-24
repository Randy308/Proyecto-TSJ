import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useThemeContext } from "../../components/ThemeProvider";
import axios from "axios";
import AuthUser from "../../auth/AuthUser";
import AsyncButton from "../../components/AsyncButton";

const TablaJurisprudenciaCSV = () => {
  const { getToken, getLogout, rol } = AuthUser();
  const [isLoading, setIsLoading] = useState(false);
  const { readString } = usePapaParse();
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [error, setError] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const sampleData = (data, samplePercentage) => {
    const sampleSize = Math.ceil(data.length * samplePercentage);
    const shuffledData = [...data].sort(() => 0.5 - Math.random()); // Shuffle array randomly
    return shuffledData.slice(0, sampleSize); // Take the first 'sampleSize' elements
  };

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
          setTotalData(results.data.length);
          const sampledData = sampleData(results.data, 0.1);
          setRowData(sampledData);
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
      setArchivo(file);
    } else {
      setError("No se seleccionó ningún archivo");
    }
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const endpoint = process.env.REACT_APP_BACKEND;
      const formData = new FormData();
      formData.append("excelFile", archivo);

      const { data } = await axios.post(
        `${endpoint}/v1/excel/upload-jurisprudencia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
            Authorization: "Bearer " + getToken(),
          },
          withCredentials: true,
        }
      );

      console.log(data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error al realizar la solicitud: " + error.message);
      setIsLoading(false);
    }
  };

  const isDarkMode = useThemeContext();
  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className={isDarkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
        style={{ height: 500, width: "95%" }}
      >
        <label
          className="text-2xl roboto-bold dark:text-white"
          htmlFor="file_input"
        >
          Subir archivo CSV
        </label>
        <input
          accept=".csv"
          onChange={cargarArchivo}
          className="block my-4 p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
 bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600
  dark:placeholder-gray-400"
          id="file_input"
          type="file"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {rowData.length > 0 && (
          <div>
            <h3 className="py-4 text-sm roboto-bold dark:text-white">
              Vista previa del contenido
            </h3>
            <h4 className="py-4 text-sm dark:text-white">
              {totalData} filas encontradas
            </h4>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              domLayout="autoHeight"
            />
            <div className="p-4 m-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleClick()}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Subir
              </button>

              <div>
                <AsyncButton
                  asyncFunction={handleClick}
                  isLoading={isLoading}
                  name="Subir"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaJurisprudenciaCSV;
