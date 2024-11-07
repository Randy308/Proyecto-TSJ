import Loading from "../../components/Loading";
import { useFreeApi } from "../../hooks/api/useFreeApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiInjustice } from "react-icons/gi";
import axios from "axios";
import TanstackTabla from "../../components/TanstackTabla";
import LineChart from "./LineChart";
import { toast } from "react-toastify";

const ListaSalas = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const { contenido, isLoading, error } = useFreeApi(`${endpoint}/all-salas`);

  const [selectedIds, setSelectedIds] = useState([]);
  const [resoluciones, setResoluciones] = useState([]);
  const [totalRes, setTotalRes] = useState(0);

  const [umbral, setUmbral] = useState(0.05);
  const [pieData, setPieData] = useState([]);

  const [actual, setActual] = useState(true);

  const option = {
    legend: {
      top: "top",
    },
    tooltip: {
      trigger: "item",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        name: "Forma de resolución",
        type: "pie",
        radius: "50%",
        itemStyle: {
          borderRadius: 8,
        },
        data: pieData,
      },
    ],
  };
  // Manejar el cambio de estado del checkbox
  const handleCheckboxChange = (event) => {
    const id = event.target.name;
    if (event.target.checked) {
      // Agregar el ID a la lista si se selecciona
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      // Eliminar el ID de la lista si se deselecciona
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter((item) => item !== id)
      );
    }
  };

  const getDatos = async () => {
    if(selectedIds.length <= 0 ){
      toast.warning("Debe seleccionar una sala");
      return;
    }
    try {
      const { data } = await axios.get(`${endpoint}/obtener-datos-salas`, {
        params: {
          salas: selectedIds,
        },
      });

      setResoluciones(data.data);
      setTotalRes(data.total);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.warning("Error de conexión");
    }
  };

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    if (resoluciones && resoluciones.length > 0 && totalRes > 0) {
      let acumulado = 0;
      const filteredData = resoluciones
        .map((item) => {
          if (item.value / totalRes >= umbral) {
            return { name: item.name, value: item.value };
          } else {
            acumulado += item.value;
            return null;
          }
        })
        .filter((item) => item !== null);

      if (acumulado > 0) {
        filteredData.push({ name: "Otros", value: acumulado });
      }

      setPieData(filteredData);
    }
  }, [resoluciones, totalRes, umbral]);

  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div>
      <div className="p-4 m-4">
        <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
          Análisis por Salas
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-2 custom:grid-cols-1">
        <div>
          <div className="p-4 m-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
            <p className="text-black font-bold dark:text-white">Paso 1</p>
            <p className="text-black dark:text-white pb-4">
              Seleccione una o varias salas para analizar
            </p>
            <div className="flex flex-wrap p-4 justify-end">
              <button
                type="button"
                onClick={getDatos}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Analizar
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {contenido.map((item) => (
                <li key={item.id}>
                  <input
                    type="checkbox"
                    id={item.nombre}
                    name={item.id}
                    className="hidden peer"
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor={item.nombre}
                    className="inline-flex items-center justify-between w-full p-3 custom:p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-row gap-3 items-center custom:gap-2">
                      <GiInjustice className="mb-2 text-black w-7 h-7 dark:text-white" />
                      <div className="roboto-regular text-sm text-black dark:text-white custom:text-xs">
                        {item.nombre}
                      </div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {actual ? (
          pieData && pieData.length > 0 ? (
            <div className="col-span-3">
              <div className="max-w-sm mx-auto mt-4">
                <label
                  htmlFor="number-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Umbral de significancia (%):
                </label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  step=".01"
                  max={100}
                  min={0.01}
                  value={umbral}
                  onChange={(e) => setUmbral(e.target.value)}
                />
                <button
                  onClick={() => setActual((prev) => !prev)}
                  type="button"
                  className="w-full mt-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
              focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 
              text-center me-2 mb-2"
                >
                  Mostrar Tabla
                </button>
              </div>

              <div className="border border-gray-300 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A] h-[600px]">
                <LineChart option={option} />
              </div>
            </div>
          ) : (
            <div className="col-span-3 flex justify-center items-center text-center p-4 text-gray-500 dark:text-gray-400">
              No hay datos para mostrar el gráfico.
            </div>
          )
        ) : totalRes && totalRes > 0 ? (
          <div className="col-span-3">
            <div className="max-w-sm mx-auto">
              <div className="text-center p-4 roboto-regular text-2xl text-black dark:text-white">
                <p>Tabla de frecuencias</p>
              </div>
              <button
                onClick={() => setActual((prev) => !prev)}
                type="button"
                className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
              focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 
              text-center me-2 mb-2"
              >
                Mostrar Grafico
              </button>
            </div>
            <TanstackTabla data={resoluciones} selectedIds={selectedIds} />
          </div>
        ) : (
          <div className="col-span-3 flex justify-center items-center text-center p-4 text-gray-500 dark:text-gray-400">
            No hay resultados disponibles para mostrar.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaSalas;
