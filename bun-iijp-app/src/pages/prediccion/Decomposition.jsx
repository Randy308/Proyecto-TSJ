import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import React from "react";
import LineChart from "../analisis/LineChart";
import ResolucionesService from "../../services/ResolucionesService";

const Decomposition = ({ id }) => {
  const [contenido, setContenido] = useState(null);
  useEffect(() => {
    if (id) {
      ResolucionesService.descomponerSerie({ id: id })
        .then(({ data }) => {
          setContenido(data);
        })
        .catch((error) => {
          console.log("Existe un error de conexión " + error);
        });
    }
  }, []);

  const [indice, setIndice] = useState(null);

  useEffect(() => {
    if (contenido) {
      setIndice(contenido.index);
      delete contenido.index;
    }
    
  }, [contenido]);


  if (
    typeof contenido !== "object" ||
    contenido === null ||
    Object.keys(contenido).length === 0
  ) {
    return <p>No hay datos disponibles.</p>;
  }

  const crearOption = (index, data) => ({
    toolbox: {
      feature: {
        magicType: { show: true, type: ["line", "bar"] },
        saveAsImage: { show: true },
      },
    },
    xAxis: {
      type: "category",
      data: index,
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
    },
    series: [
      {
        data: data,
        type: "line",
      },
    ],
  });

  return (
    <div>
      <h2>Decomposition</h2>
      <div className="flex  flex-col flex-wrap">
        {Object.entries(contenido).map(([key, value]) => (
          <div
            key={key} // Aseguramos una clave única
            className="border border-gray-300 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A] h-[600px] custom:h-[400px]"
          >
            <span className="text-black dark:text-white">{key}</span>
            <LineChart
              option={crearOption(indice, value)} // Llamada directa a crearOption
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Decomposition;
