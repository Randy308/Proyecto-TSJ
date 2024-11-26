import React, { useEffect, useState } from "react";
import "../../styles/styles_randy/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
import "../../styles/paginate.css";
import Loading from "../../components/Loading";
import { comparacionItems } from "../../data/ComparacionItems";
import Dropdown from "../../components/Dropdown";
import Select from "./tabs/Select";
import SimpleChart from "../../components/SimpleChart";
import Prediccion from "./tabs/Prediccion";
import AsyncButton from "../../components/AsyncButton";
import { MdCleaningServices } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSessionStorage } from "../../components/useSessionStorage";
const CompararDatos = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [resoluciones, setResoluciones] = useState(null);
  const [limiteSuperior, setLimiteSuperior] = useSessionStorage(
    "limiteSuperior",
    ""
  );
  const [limiteInferior, setLimiteInferior] = useSessionStorage(
    "limiteInferior",
    ""
  );
  const [numeroBusqueda, setNumeroBusqueda] = useState(1);

  const [hasFetchedDates, setHasFetchedDates] = useSessionStorage(
    "hasFetchedDates",
    false
  );

  const [data, setData] = useSessionStorage("data", {});
  const [hasFetchedData, setHasFetchedData] = useSessionStorage(
    "hasFetchedData",
    false
  );

  const [terminos, setTerminos] = useState([]);

  const [timeSeries, setTimeSeries] = useState(null);
  const [proyeccion, setProyeccion] = useState(null);

  const [option, setOption] = useState({});

  const [isLoading, setIsLoading] = useState(false);
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
    if (resoluciones) {
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
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: resoluciones.map((item) => item),
        grid: {
          top: "10%", 
          bottom: "10%", 
          left: "10%", 
          right: "10%", 
        },
      });
    }
  }, [resoluciones]);


  const obtenerResoluciones = async () => {
    try {
      setIsLoading(true);

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== "all"
        )
      );

      const { data } = await axios.get(`${endpoint}/obtener-elemento`, {
        params: {
          fecha_final: limiteSuperior,
          fecha_inicial: limiteInferior,
          numero_busqueda: numeroBusqueda,
          ...filteredData,
        },
      });
      console.log(data);
      if (data.resoluciones.data.length > 0) {
        setNumeroBusqueda((prev) => prev + 1);
        setResoluciones((prev) =>
          prev ? [...prev, data.resoluciones] : [data.resoluciones]
        );

        setTerminos((prev) =>
          prev.length > 0 ? [...prev, data.termino] : [data.termino]
        );
      } else {
        alert("No existen datos");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const obtenerSerieTemporal = (id) => {
    
    const item = resoluciones.find((item) => item.id === id);

    
    if (item) {
      setTimeSeries(item.data);
    } else {
      setTimeSeries([]);
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



  const realizarProyeccion = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/realizar-prediccion`, {
        params: {
          data: timeSeries,
        },
      });
      setProyeccion(data);
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
      case 3:
        return (
          <>
            {proyeccion ? (
              <Prediccion proyeccion={proyeccion} />
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
    <div className="container mx-auto custom:px-0" id="jurisprudencia-busqueda">
      <div className="row p-4">
        <div className="flex flex-col bg-white dark:bg-[#111827] rounded-lg border border-gray-200 dark:border-gray-900  shadow mt-4">
          {/* <div className="custom-gradient p-4 text-white font-bold rounded-t-lg flex flex-row flex-wrap gap-4 items-center justify-start">
            <FaFilter></FaFilter> <p>Campos de filtrado</p>
          </div> */}

          <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg sm:p-8 dark:bg-gray-800  dark:border-gray-900">
            <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 m-4">
              <li className="w-full focus-within:z-10">
                <a
                  className="inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current="page"
                >
                  Series Temporales
                </a>
              </li>
              <li className="w-full focus-within:z-10">
                <Link
                  to="/busqueda"
                  className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Busqueda de Resoluciones
                </Link>
              </li>
            </ul>

            {/* <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Análisis de datos
            </h5>
            <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Comparación de datos atreves del tiempo.
            </p> */}
            <div className="grid grid-cols-3 gap-4 custom:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data &&
                Object.entries(data).map(([key, items]) => (
                  <Select
                    key={key}
                    formData={formData}
                    items={items}
                    fieldName={key}
                    setFormData={setFormData}
                  />
                ))}
            </div>
            <div className="flex flex-row justify-end gap-4 p-4">
              <div>
                <AsyncButton
                  asyncFunction={obtenerResoluciones}
                  name={"Generar Serie Temporal"}
                  isLoading={isLoading}
                />
              </div>
              <button
                className="inline-flex items-center px-4 py-3 rounded-lg text-xs bg-blue-500 hover:bg-blue-800 text-white"
                onClick={limpiarFiltros}
              >
                <MdCleaningServices className="fill-current w-4 h-4 mr-2" />
                <span>Limpiar</span>
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
                    ? "text-white bg-[#7E3045] dark:bg-gray-900  active"
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
                  className="p-4 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full"
                >
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
