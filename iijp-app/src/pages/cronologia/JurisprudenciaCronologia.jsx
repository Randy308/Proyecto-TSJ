import React, { useEffect, useState } from "react";
import ArbolJurisprudencial from "./tabs/ArbolJurisprudencial";
import { cronologiaItems } from "../../data/CronologiaItems.js";
import InputEscenciales from "./tabs/InputEscenciales";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import Tipografia from "./tabs/Tipografia";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../components/useLocalStorage";
import { headingItems } from "../../data/HeadingItems";
import AsyncButton from "../../components/AsyncButton";
const endpoint = process.env.REACT_APP_BACKEND;
const JurisprudenciaCronologia = () => {
  const [currentID, setCurrentID] = useState(null);
  const [arbol, setArbol] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [tabActivo, setTabActivo] = useState(1);
  const [formData, setFormData] = useState({
    departamento: "Todos",
    tipo_resolucion: "Todos",
    sala: "Todas",
    fecha_exacta: "",
    fecha_desde: "",
    fecha_hasta: "",
    cantidad: 15,
    subtitulo: "",
    recorrer: false,
    seccion: true,
  });
  const [activador, setActivador] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const eliminarNodo = (idBuscado) => {
    if (tabActivo == 1) {
      const indice = arbol.findIndex((elemento) => elemento.id === idBuscado);
      const nuevoArbol = arbol.slice(0, indice + 1);
      if (arbol.length !== nuevoArbol.length) {
        setArbol(nuevoArbol);
        setCurrentID(idBuscado);
      }
    }
  };

  const vaciarNodo = () => {
    if (tabActivo == 1) {
      setArbol([]);
      setCurrentID(null);
    }
  };

  const actualizarTab = (id) => {
    if (id != 1) {
      if (arbol.length > 0) {
        setActivador((prev) => !prev);
      } else {
        toast.warning("Debe seleccionar una materia");
        return;
      }
    }

    if (tabActivo != id) {
      setTabActivo(id);
    }
  };

  const getParams = async () => {
    try {
      const nombresTemas = arbol.map(({ nombre }) => nombre).join(" / ");
      const { data } = await axios.get(
        `${endpoint}/obtener-parametros-cronologia`,
        {
          params: { descriptor: nombresTemas },
        }
      );

      const { departamentos, salas, tipo_resolucions } = data;

      if (
        [departamentos, salas, tipo_resolucions].some((arr) => arr.length > 0)
      ) {
        setResultado(data);
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      const message = error.response?.data?.error || "Ocurrió un error";
      console.error("Error fetching data:", message);
      console.error("Error :", error);
    }
  };

  const renderContent = (id) => {
    switch (id) {
      case 1:
        return (
          <ArbolJurisprudencial
            currentID={currentID}
            setCurrentID={setCurrentID}
            setArbol={setArbol}
            arbol={arbol}
          />
        );
      case 2:
        return (
          <InputEscenciales
            formData={formData}
            setFormData={setFormData}
            resultado={resultado}
          />
        );
      case 4:
        return <Tipografia />;
      default:
        return "Hola mundo";
    }
  };
  const estilosState = headingItems.map((item) => {
    const [value, setValue] = useLocalStorage(item.titulo, item.estiloDefault);
    return { titulo: item.titulo, estilo: value, setEstilo: setValue };
  });
  const navigate = useNavigate();
  const obtenerCronologia = async (e) => {
    e.preventDefault();

    if (arbol.length <= 0) {
      toast.error("Seleccione una materia primero");
      return;
    }

    try {
      setIsLoading(true);
      const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");
      const currentEstilos = estilosState.map((item) => {
        const currentEstilo = localStorage.getItem(item.titulo);
        return {
          titulo: item.titulo,
          estilo: currentEstilo ? JSON.parse(currentEstilo) : item.estilo,
        };
      });
      const response = await axios.get(`${endpoint}/cronologias`, {
        params: {
          tema_id: arbol[arbol.length - 1].id,
          descriptor: nombresTemas,
          estilos: currentEstilos,
          ...formData,
        },
        responseType: "blob",
      });

      setIsLoading(false);
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      navigate("/Jurisprudencia/Cronologias/Resultados", {
        state: { pdfUrl: pdfUrl },
      });
    } catch (error) {
      const message =
        error.response?.data || "An error occurred while fetching data";
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activador && arbol.length > 0) {
      getParams();
    }
  }, [activador, arbol]);

  return (
    <div id="cronologia-container" className="p-4 m-4">
      <div className="header-container">
        <div>
          <p className="text-bold text-3xl text-center my-4 arimo text-black dark:text-white">
            Generación de Cronologías Jurídicas
          </p>
          <div className="flex flex-row gap-1 flex-wrap arrow-steps my-4">
            <div
              className={`step custom:text-xs roboto-medium`}
              key={0}
              onClick={() => vaciarNodo()}
            >
              <FaHouse></FaHouse>
            </div>
            {arbol &&
              arbol.map((tema) => (
                <div
                  className={`step custom:text-xs roboto-medium ${
                    tema.id === arbol[arbol.length - 1].id ? "current" : ""
                  }`}
                  key={tema.id}
                  id={tema.id}
                  onClick={() => eliminarNodo(tema.id)}
                >
                  {tema.nombre}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="md:flex">
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
          {cronologiaItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                  item.id == tabActivo
                    ? "text-white bg-red-octopus-500  active dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
                aria-current="page"
                onClick={() => actualizarTab(item.id)}
              >
                {item.icon(
                  `w-4 h-4 me-2 ${
                    item.id === tabActivo
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`
                )}
                {item.title}
              </a>
            </li>
          ))}

          <li>
            <AsyncButton
              asyncFunction={obtenerCronologia}
              name={"Obtener Resoluciones"}
              isLoading={isLoading}
            />
          </li>
        </ul>

        {cronologiaItems.map((item) => (
          <div
            key={item.id}
            className={`p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full ${
              item.id === tabActivo ? "" : "hidden"
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
  );
};
export default JurisprudenciaCronologia;
