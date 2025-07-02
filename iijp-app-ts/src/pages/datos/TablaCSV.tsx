import React, { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useThemeContext } from "../../context/ThemeProvider";
import AsyncButton from "../../components/AsyncButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserService from "../../services/UserService";
import { AuthUser } from "../../auth";

const TablaCSV = () => {
  const { can } = AuthUser();
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
  const isDarkMode = useThemeContext();
  const { readString } = usePapaParse();
  const [rowData, setRowData] = useState<Array<Record<string, any>>>([]);
  const [totalData, setTotalData] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const sampleData = (data: string | any[], samplePercentage: number) => {
    const sampleSize = Math.ceil(data.length * samplePercentage);
    const shuffledData = [...data].sort(() => 0.5 - Math.random()); // Shuffle array randomly
    return shuffledData.slice(0, sampleSize); // Take the first 'sampleSize' elements
  };

  const handleString = (CSVString: string) => {
    setRowData([]);
    setTotalData(0);
    setError(null);
    readString(CSVString, {
      worker: true,
      delimiter: ",",
      skipEmptyLines: true,
      header: true,
      complete: (results: { errors: string | any[]; data: string | any[] }) => {
        if (results.errors.length > 0) {
          setError("Error al procesar el archivo CSV");
          console.error(results.errors);
        } else {
          const header = Object.keys(results.data[0]);

          console.log("Resultados:", header);
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
              flex: 1,
            }));
            console.log("Columnas:", headers);
          }
        }
      },
    });
  };

  const cargarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = event.target as FileReader | null;
        if (target && typeof target.result === "string") {
          const csvString = target.result;
          handleString(csvString);
        } else {
          setError("No se pudo leer el archivo CSV");
        }
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

    UserService.subirJurisprudencia(formData)
      .then(({ data }) => {
        if (data.success) {
          const successMessage = data.mensaje || "Datos cargados exitosamente.";
          const detailsMessage = `Total de registros procesados: ${data.total_records}, Registros omitidos: ${data.skipped_records}`;

          toast.success(`${successMessage} ${detailsMessage}`);
          console.log("Resultado:", data);
        } else {
          toast.warning(
            data.mensaje || "El servidor no pudo completar la operación."
          );
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);

        if (error.response) {
          const { status, data } = error.response;
          console.error(`Error ${status}:`, data);

          if (data.error) {
            toast.error(data.error);
          } else {
            toast.error("Ocurrió un error en el servidor.");
          }
        } else if (error.request) {
          toast.error(
            "No se pudo contactar al servidor. Por favor, inténtalo más tarde."
          );
        } else {
          toast.error(`Error inesperado: ${error.message}`);
        }
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
      <div
        className={isDarkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
        style={{ height: 500, width: "95%" }}
      >
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
            <h4 className="py-4 text-sm dark:text-white">
              {totalData} filas encontradas
            </h4>
            <div className="p-4 m-4 flex justify-end">
              {/* <button
                type="button"
                onClick={() => handleClick()}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Subir
              </button> */}

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
