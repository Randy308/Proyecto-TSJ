import Loading from "../../components/Loading";
import React, { useEffect, useState } from "react";
import { GiInjustice } from "react-icons/gi";
import TanstackTabla from "../../components/tables/TanstackTabla";
import LineChart from "./LineChart";
import { toast } from "react-toastify";
import { MdOutlineCleaningServices } from "react-icons/md";
import BtnDropdown from "../../components/BtnDropdown";
import AsyncButton from "../../components/AsyncButton";
import SalasService from "../../services/SalasService";
const ListaSalas = () => {

  const [selectedIds, setSelectedIds] = useState([]);
  const [resoluciones, setResoluciones] = useState([]);
  const [totalRes, setTotalRes] = useState(0);

  const [umbral, setUmbral] = useState(0.05);
  const [pieData, setPieData] = useState([]);

  const [actual, setActual] = useState(true);
  const [visible, setVisible] = useState(true);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [salas, setSalas] = useState([]);
  useEffect(() => {
    SalasService.getAllSalas()
      .then(({ data }) => {
        if (data) {
          setSalas(data);
        }
      })
      .catch(({ err }) => console.error("Existe un error " + err));
  }, []);

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

  const handleCheckboxChange = (event) => {
    const itemId = parseInt(event.target.name, 10);
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(itemId)
        ? prevSelectedIds.filter((id) => id !== itemId)
        : [...prevSelectedIds, itemId]
    );
  };

  const getDatos = async () => {
    if (selectedIds.length <= 0) {
      toast.warning("Debe seleccionar una sala");
      return;
    }

    setIsLoadingData(true);

    SalasService.getDatos({
      salas: selectedIds,
    })
      .then(({ data }) => {
        if (data) {
          setResoluciones(data.data);
          setTotalRes(data.total);
          setVisible(false);
        }
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        toast.warning("Error de conexión");
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };

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

  if (salas.length <= 0) {
    return <Loading />;
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
            <div>
              <BtnDropdown
                setVisible={setVisible}
                visible={visible}
                titulo={"Lista de salas"}
              ></BtnDropdown>
            </div>
            <ul
              className={`flex flex-col gap-2 pb-4 mb-4 max-h-[400px] overflow-x-auto  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" ${visible ? "" : "hidden"}`}
            >
              {salas.map((item) => (
                <li key={item.id} className="px-2">
                  <input
                    type="checkbox"
                    id={item.nombre}
                    name={item.id}
                    value={item.id}
                    className="hidden peer"
                    checked={selectedIds.includes(item.id)}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor={item.nombre}
                    className="inline-flex items-center justify-between w-full p-2 custom:p-1 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="flex flex-row gap-3 items-center custom:gap-2">
                      <GiInjustice className="mb-2 text-black w-5 h-5 dark:text-white" />
                      <div className="roboto-regular text-sm text-black dark:text-white custom:text-xs">
                        {item.nombre}
                      </div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pb-2 justify-center">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center text-white bg-gradient-to-r bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-3 text-center"
              >
                <MdOutlineCleaningServices className="fill-current w-4 h-4 mr-2" />
                <span>Limpiar</span>
              </button>

              <AsyncButton
                name={"Analizar"}
                asyncFunction={getDatos}
                isLoading={isLoadingData}
                full={false}
              />
            </div>
            {pieData && pieData.length > 0 ? (
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
                  className="w-full mt-2 text-white bg-gradient-to-r dark:from-blue-700 dark:to-blue-800 from-red-octopus-500 to-secondary hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  {actual ? "Mostrar Tabla " : "Mostrar Grafico"}
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {actual ? (
          pieData && pieData.length > 0 ? (
            <div className="col-span-3">
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
