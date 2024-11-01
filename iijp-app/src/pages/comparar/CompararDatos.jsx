import React, { useEffect, useState } from "react";
import "../../styles/styles_randy/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
import { TbMathFunction } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import "../../styles/paginate.css";
import Loading from "../../components/Loading";
import LineChart from "../analisis/LineChart";
import styles from "./CompararDatos.module.css";
import { RxDotsVertical } from "react-icons/rx";
import { comparacionItems } from "../../data/ComparacionItems";
import Contenido from "./tabs/Contenido";
import ResolucionesTab from "./tabs/ResolucionesTab";
const CompararDatos = () => {
  const endpoint = process.env.REACT_APP_BACKEND;


  const [resoluciones, setResoluciones] = useState(null);
  const [limiteSuperior, setLimiteSuperior] = useState(null);
  const [limiteInferior, setLimiteInferior] = useState(null);

  const [cabeceras, setCabeceras] = useState(null);
  //maneja eventos en el grafico
  const [valor, setValor] = useState("");

  const [terminos, setTerminos] = useState([]);
  useEffect(() => {
    getParams();
  }, []);

  const getParams = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/get-dates`);
      setLimiteInferior(data.inferior);
      setLimiteSuperior(data.superior);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    console.log(resoluciones);
  }, [resoluciones]);



  const [option, setOption] = useState({});
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

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

  const renderContent = (id) => {
    switch (id) {
      case 1:
        return <Contenido />;
      case 2:
        return <ResolucionesTab setResoluciones={setResoluciones} setCabeceras={setCabeceras} setTerminos={setTerminos} limiteInferior={limiteInferior}  limiteSuperior={limiteSuperior} />;
      default:
        return "Hola mundo";
    }
  };

  const [varActiva, setVarActiva] = useState(1);
  return (
    <div
      className="md:container mx-auto px-40 custom:px-0"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        <p className="m-4 p-4 text-center font-bold text-3xl text-black dark:text-white arimo">
          Análisis de Jurisprudencia Avanzada
        </p>
        <div className="flex flex-col bg-white dark:bg-[#111827] rounded-lg border border-gray-200">
          <div className="bg-[#450920] dark:bg-blue-600 p-4 text-white font-bold rounded-t-lg flex flex-row flex-wrap gap-4 items-center justify-start">
            <FaFilter></FaFilter> <p>Campos de filtrado</p>
          </div>

          <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 p-4 m-4">
            <li key={0}>
              <a class="inline-block px-4 py-3 text-black cursor-not-allowed dark:text-white">
                Seleccione una variable:
              </a>
            </li>
            {comparacionItems.map((item) => (
              <li class="me-2" key={item.id}>
                <a
                  href="#"
                  className={`inline-block px-4 py-3 rounded-lg ${
                    item.id === varActiva
                      ? "text-white bg-blue-600  active"
                      : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                  onClick={() => setVarActiva(item.id)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          <div>
            {comparacionItems.map((item) => (
              <div
                key={item.id}
                className={`p-6 bg-white text-medium text-gray-500 dark:text-gray-400 dark:bg-[#111827] rounded-lg w-full ${
                  item.id === varActiva ? "" : "hidden"
                }`}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.title} Tab
                </h3>

                {renderContent(item.id)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap py-4 m-4 gap-4">
        {terminos && terminos.length > 0
          ? terminos.map((item, index) => (
              <div className="bg-white dark:bg-[#100C2A] text-black rounded-md p-4 flex flex-row justify-center items-center gap-4">
                <div className="p-2">
                  <div className="titulo text-xl">
                    {toTitleCase(item.name.replace(/_/g, " "))} :{" "}
                    <span>{item.value}</span>{" "}
                  </div>
                  <div className="text-gray-400">Termino de busqueda</div>
                </div>
                <div className="titulo">
                  <RxDotsVertical />
                </div>
              </div>
            ))
          : ""}
      </div>

      <div
        className={`${styles.graficoContenedor} border border-gray-200 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]`}
        id="grafico-contenedor"
      >
        {resoluciones && resoluciones.length > 0 ? (
          <LineChart option={option} setData={setValor}></LineChart>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </div>
  );
};
export default CompararDatos;
