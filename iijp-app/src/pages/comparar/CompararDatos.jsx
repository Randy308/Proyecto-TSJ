import React, { useEffect, useState } from "react";
import "../../styles/styles_randy/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";
import axios from "axios";

import "../../styles/paginate.css";
import Loading from "../../components/Loading";
import styles from "./CompararDatos.module.css";
import { comparacionItems } from "../../data/ComparacionItems";
import Contenido from "./tabs/Contenido";
import ResolucionesTab from "./tabs/ResolucionesTab";
import Dropdown from "../../components/Dropdown";
import Select from "./tabs/Select";
import SimpleChart from "../../components/SimpleChart";
import TimesSeries from "../magistrados/analisis/TimesSeries";
import Prediccion from "./tabs/Prediccion";
const CompararDatos = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState(null);
  const [limiteSuperior, setLimiteSuperior] = useState(null);
  const [limiteInferior, setLimiteInferior] = useState(null);
  const [numeroBusqueda, setNumeroBusqueda] = useState(1);
  const [cabeceras, setCabeceras] = useState(null);

  const [hasFetchedDates, setHasFetchedDates] = useState(false);

  const [hasFetchedData, setHasFetchedData] = useState(false);

  const [terminos, setTerminos] = useState([]);

  const [data, setData] = useState(null);

  const [timeSeries, setTimeSeries] = useState(null);
  const [proyeccion, setProyeccion] = useState(null);

  const [option, setOption] = useState({});
  const [busqueda, setBusqueda] = useState([]);
  const [actualFormData, setActualFormData] = useState(null);

  const [formData, setFormData] = useState({
    tipo_resolucion: "all",
    sala: "all",
    magistrado: "all",
    forma_resolucion: "all",
    tipo_jurisprudencia: "all",
    materia: "all",
  });

  const [varActiva, setVarActiva] = useState(1);

  useEffect(() => {
    if (!hasFetchedDates) {
      getParams();
    }
  }, []);

  const getParams = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/get-dates`);
      setLimiteInferior(data.inferior);
      setLimiteSuperior(data.superior);
      setHasFetchedDates(true);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    if (hasFetchedDates && !hasFetchedData) {
      getSelect();
    }
  }, [hasFetchedDates]);

  const getSelect = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/get-params`);
      setData(data);
      setHasFetchedData(true);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    if (resoluciones && cabeceras) {
      setOption({
        title: {
          text: "Interés a lo largo del tiempo",
          padding: [20, 20, 10, 20],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: resoluciones.map((item) => item.name),
          padding: [20, 20, 10, 20],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: cabeceras,
        },
        yAxis: {
          type: "value",
        },
        series: resoluciones.map((item) => item),
        grid: {
          top: "10%", // Adjust top padding
          bottom: "10%", // Adjust bottom padding
          left: "10%", // Adjust left padding
          right: "10%", // Adjust right padding
        },
      });
    }
  }, [resoluciones, cabeceras]);

  useEffect(() => {
    if (actualFormData) {
      realizarBusqueda(1);
    }
  }, [actualFormData]);

  const obtenerResoluciones = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/obtener-elemento`, {
        params: {
          fecha_final: limiteSuperior,
          fecha_inicial: limiteInferior,
          numero_busqueda: numeroBusqueda,
          ...formData,
        },
      });
      console.log(data);
      if (data.resoluciones.data.length > 0) {
        setNumeroBusqueda((prev) => prev + 1);
        setResoluciones((prev) =>
          prev ? [...prev, data.resoluciones] : [data.resoluciones]
        );
        setCabeceras(data.cabeceras);

        setTerminos((prev) =>
          prev.length > 0 ? [...prev, data.termino] : [data.termino]
        );
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const obtenerSerieTemporal = (id) => {
    // Find the item by id
    const item = resoluciones.find((item) => item.id === id);

    // If the item is found, set the data, otherwise set an empty array or handle the error
    if (item) {
      setTimeSeries(item.data);
    } else {
      setTimeSeries([]); // Or handle as needed, e.g., show an error message
    }
  };

  const removeItemById = (id) => {
    setResoluciones((prevResoluciones) =>
      prevResoluciones.filter((item) => item.id !== id)
    );

    setTerminos((prevTerminos) =>
      prevTerminos.filter((item) => item.id !== id)
    );
  };

  const limpiarFiltros = () => {
    setFormData({
      tipo_resolucion: "all",
      sala: "all",
      magistrado: "all",
      forma_resolucion: "all",
      tipo_jurisprudencia: "all",
      materia: "all",
    });
  };

  const realizarBusqueda = async (page) => {
    try {
      const { data } = await axios.get(`${endpoint}/buscar-resoluciones`, {
        params: {
          ...actualFormData,
          page: page,
        },
      });
      setBusqueda(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const realizarProyeccion = async (page) => {
    try {
      const { data } = await axios.get(`${endpoint}/realizar-prediccion`, {
        params: {
          data: timeSeries,
          periodo: cabeceras,
        },
      });
      setProyeccion(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (timeSeries && timeSeries.length > 0) {
      realizarProyeccion();
    }
  }, [timeSeries]);

  const renderContent = (number) => {
    switch (number) {
      case 1:
        return (
          <>
            {resoluciones && resoluciones.length > 0 ? (
              <SimpleChart option={option} border={false}></SimpleChart>
            ) : (
              <div className="h-[500px]">
                <Loading></Loading>
              </div>
            )}
          </>
        );
      case 2:
        return (
          <>
            {actualFormData ? (
              <ResolucionesTab
                setActualFormData={setActualFormData}
                data={busqueda}
                realizarBusqueda={realizarBusqueda}
              />
            ) : (
              <p className="text-gray-500 dark:text-white">No existen datos</p>
            )}
          </>
        );
      case 3:
        return (
          <>
            {proyeccion ? (
              <Prediccion
                proyeccion={proyeccion}
              />
            ) : (
              <p className="text-gray-500 dark:text-white">No existen datos</p>
            )}
          </>
        );
      default:
        return (
          <p className="text-gray-500 dark:text-white">No existen datos</p>
        );
    }
  };

  return (
    <div
      className="md:container mx-auto px-40 custom:px-0"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        <div className="flex flex-col bg-white dark:bg-[#111827] rounded-lg border border-gray-200 dark:border-gray-900  shadow mt-4">
          <div className="custom-gradient p-4 text-white font-bold rounded-t-lg flex flex-row flex-wrap gap-4 items-center justify-start">
            <FaFilter></FaFilter> <p>Campos de filtrado</p>
          </div>

          <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg sm:p-8 dark:bg-gray-800  dark:border-gray-900">
            <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Análisis de Jurisprudencia Avanzada
            </h5>
            <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Comparacion de datos a travez del tiempo.
            </p>
            <div className="grid grid-cols-3 gap-4 custom:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {data &&
                Object.entries(data).map(([key, items]) => (
                  <Select
                    key={key} // Add a unique key for each Select component
                    formData={formData}
                    items={items}
                    fieldName={key}
                    setFormData={setFormData}
                  />
                ))}
            </div>
            <div className="flex flex-row justify-end gap-4 p-4">
              <button
                className="rounded-lg bg-blue-500 hover:bg-blue-800 p-3 text-white"
                onClick={() => obtenerResoluciones()}
              >
                Generar
              </button>
              <button
                className="rounded-lg bg-blue-500 hover:bg-blue-800 text-white p-3"
                onClick={limpiarFiltros}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap py-4 m-4 gap-4">
        {terminos &&
          terminos.length > 0 &&
          terminos.map((item, index) => (
            <Dropdown
              key={index}
              obtenerSerieTemporal={obtenerSerieTemporal}
              item={item}
              removeItemById={removeItemById}
              setActualFormData={setActualFormData}
            />
          ))}
      </div>

      <div>
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 p-4 m-4">
          {comparacionItems.map((item) => (
            <li className="me-2" key={item.id}>
              <a
                className={`inline-block px-4 py-3 rounded-lg  ${
                  item.id === varActiva
                    ? "text-white bg-blue-600  active"
                    : "hover:text-gray-900 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
                onClick={() => setVarActiva(item.id)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <div>
          {comparacionItems.map(
            (item) =>
              item.id === varActiva && (
                <div
                  key={item.id}
                  className="p-6 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-[#111827] rounded-lg w-full"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {item.title} Tab
                  </h3>
                  {renderContent(item.id)}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};
export default CompararDatos;
