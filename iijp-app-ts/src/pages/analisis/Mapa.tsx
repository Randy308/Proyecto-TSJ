import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StatsService } from "../../services";
import GeoChart from "../../components/charts/GeoChart";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import type { ReceivedForm } from "../../types";

const Mapa = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const receivedForm: ReceivedForm | undefined = location.state?.validatedData;

  const [datos, setDatos] = useSessionStorage("mapa", []);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (
      !receivedForm ||
      !Array.isArray(receivedForm.variable) ||
      receivedForm.nombre === "Departamento"
    ) {
      console.log("No hay datos para mostrar o el nombre es Departamento");
      navigate("/analisis-avanzado");
    } else {
      console.log("Received Form:", receivedForm);
      obtenerDatos(receivedForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedForm]);

  const obtenerDatos = (receivedForm: ReceivedForm) => {
    if (isLoadingData) {
      console.log("Ya se está cargando los datos, no se vuelve a cargar");
      return;
    }
    setIsLoadingData(true); // Start loading
    if (datos.length > 0) {
      console.log("Datos ya cargados, no se vuelve a cargar");
      setIsLoadingData(false); // Stop loading
      return;
    }
    StatsService.getMapa(receivedForm)
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          setDatos(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };

  return (
    <div>
      <div className="p-4 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg h-[600px] mb-8">
        <GeoChart
          contenido={datos}
          receivedForm={(receivedForm || {}) as ReceivedForm}
        ></GeoChart>
      </div>
    </div>
  );
};

export default Mapa;
