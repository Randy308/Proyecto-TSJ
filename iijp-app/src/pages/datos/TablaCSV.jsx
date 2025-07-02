import React, { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import { useThemeContext } from "../../context/ThemeProvider";
import AuthUser from "../../auth/AuthUser";
import AsyncButton from "../../components/AsyncButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ResolucionesService from "../../services/ResolucionesService";
import TokenService from "../../services/TokenService";
import UserService from "../../services/UserService";

const TablaCSV = () => {
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const cabeceras = [
    "id",
    "nro_resolucion",
    "nro_expediente",
    "fecha_emision",
    "fecha_publicacion",
    "tipo_resolucion",
    "departamento",
    "id_sala",
    "sala",
    "magistrado",
    "forma_resolucion",
    "proceso",
    "precedente",
    "demandante",
    "demandado",
    "id_tema",
    "maxima",
    "sintesis",
    "contenido",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const { readString } = usePapaParse();
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [error, setError] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const isDarkMode = useThemeContext();
  const sampleData = (data, samplePercentage) => {
    const sampleSize = Math.ceil(20);
    const shuffledData = [...data].sort(() => 0.5 - Math.random()); // Shuffle array randomly
    return shuffledData.slice(0, sampleSize); // Take the first 'sampleSize' elements
  };

  const handleString = (CSVString) => {
    setColumnDefs([]);
    setRowData([]);
    setTotalData(0);
    setError(null);
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
          const header = Object.keys(results.data[0]);
          if (header.length !== cabeceras.length) {
            setError(
              `El archivo CSV debe tener ${cabeceras.length} columnas. Actualmente tiene ${header.length}.`
            );
            return;
          }
          if (!cabeceras.every((c) => header.includes(c))) {
            setError(
              `El archivo CSV debe contener las siguientes columnas: ${cabeceras.join(
                ", "
              )}.`
            );
            return;
          }
          setError(null);
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
    if (!archivo) {
      toast.warning("Por favor, selecciona un archivo antes de continuar.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("excelFile", archivo);

    UserService.subirResoluciones(formData)
      .then(({ data }) => {
        if (data.success) {
          const { mensaje, total_filas, filas_omitidas } = data;

          toast.success(
            `${mensaje} Total filas procesadas: ${total_filas}. Filas omitidas: ${filas_omitidas}.`,
            {
              position: "top-right",
              autoClose: 5000,
              closeOnClick: true,
              draggable: true,
            }
          );
        } else {
          toast.error("El procesamiento no se completó correctamente.", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        toast.error(`Error al realizar la solicitud: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!can("subir_resoluciones")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <label
          className="text-2xl font-extrabold dark:text-white"
          htmlFor="file_input"
        >
          Subir Autos supremos en CSV
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

            {rowData.length > 0 && (
              <div className="overflow-x-auto lg:max-w-[1200px] md:max-w-[500px] sm:max-w-[400px] max-w-[90dvw]">
                <table className="table-auto border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      {columnDefs.map((colDef) => (
                        <th
                          key={colDef.field}
                          className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-600"
                        >
                          {colDef.field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {columnDefs.map((colDef) => (
                          <td
                            key={colDef.field}
                            className="p-3 text-sm text-gray-800 dark:text-gray-200 max-w-[200px] truncate whitespace-nowrap"
                            title={row[colDef.field]} // Tooltip con el contenido completo
                          >
                            {row[colDef.field]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h4 className="py-4 text-sm dark:text-white">
              {totalData} filas encontradas
            </h4>
            <div className="p-4 m-4 flex justify-end">
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

export default TablaCSV;
