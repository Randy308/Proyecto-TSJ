import Loading from "../../components/Loading";
import { useFreeApi } from "../../hooks/api/useFreeApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiInjustice } from "react-icons/gi";
import axios from "axios";
import TanstackTabla from "../../components/TanstackTabla";
import LineChart from "./LineChart";

const ListaSalas = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const { contenido, isLoading, error } = useFreeApi(`${endpoint}/all-salas`);

  const [selectedIds, setSelectedIds] = useState([]);
  const [resoluciones, setResoluciones] = useState([]);
  const [totalRes, setTotalRes] = useState(0);

  const [umbral, setUmbral] = useState(0.05);
  const [pieData, setPieData] = useState([]);
  const [residuo, setResiduo] = useState([]);

  useEffect(() => {
    if (resoluciones && resoluciones.length > 0 && totalRes > 0) {
      let acumulado = 0;
      const filteredData = resoluciones
        .map((item) => {
          console.log(item.value / totalRes);
          console.log(umbral);
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

  const option = {
    legend: {
      top: "top",
    },
    tooltip: {
      trigger: 'item'
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
        radius: '50%',
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
    }
  };

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);

  if (isLoading) return <Loading />;
  if (error) return <p>{error}</p>;

  if (!Array.isArray(contenido) || contenido.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <div>
      <div>
        <div className="flex p-4 justify-center items-center">
          <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
            Lista de salas
          </h3>
        </div>
        <ul className="flex flex-row flex-wrap gap-4 justify-center items-center p-2">
          {contenido.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                key={item.id}
                id={item.nombre}
                name={item.id}
                value=""
                className="hidden peer"
                required=""
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={item.nombre}
                className="inline-flex items-center justify-between  p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="flex flex-row gap-4">
                  <GiInjustice className="mb-2 text-black w-7 h-7" />
                  <div className="roboto-regular text-black dark:text-white">
                    {item.nombre}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap p-4 justify-end">
          <button
            type="button"
            onClick={() => getDatos()}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Obtener datos
          </button>
        </div>

        {totalRes && totalRes > 0 ? (
          <div className="mb-5 p-4">
            {pieData && pieData.length > 0 ? (
              <div>
                <div class="max-w-sm mx-auto">
                  <label
                    for="number-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Umbral de significacia (%):
                  </label>
                  <input
                    type="number"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    step=".01" max={100} min={0.01}
                    value={umbral}
                    onChange={(e) => setUmbral(e.target.value )}
                  />
                </div>

                <div className="border border-gray-300 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A] h-[600px] ">
                  {" "}
                  <LineChart option={option}></LineChart>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="text-center p-4 roboto-regular text-2xl text-black dark:text-white">
              <p>Tabla de frecuencias</p>
            </div>
            <TanstackTabla data={resoluciones} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ListaSalas;
