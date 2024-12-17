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
import { FaSearch } from "react-icons/fa";
import JurisprudenciaService from "../../services/JurisprudenciaService";
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
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
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
  const actualizarInput = (e) => {
    setBusqueda(e.target.value);
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

  const actualizarNodos = async (descriptor) => {
    try {
      JurisprudenciaService.actualizarNodo({
        busqueda: descriptor,
      })
        .then(({ data }) => {
          if (data) {
            console.log(data);
            setArbol(data.nodos);
            setCurrentID(data.last);
            setResultados([]);
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
    } catch (error) {
      const message = error.response?.data?.error || "Ocurrió un error";
      console.error("Error fetching data:", message);
      console.error("Error :", error);
    }
  };

  const search = async () => {
    try {
      const nombresTemas = arbol.map(({ nombre }) => nombre).join(" / ");
      console.log(arbol);
      JurisprudenciaService.searchTermino({
        busqueda: busqueda,
        descriptor: nombresTemas,
      })
        .then(({ data }) => {
          if (data) {
            setResultados(data);
          }
        })
        .catch(({ err }) => {
          console.log("Existe un error " + err);
        });
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
          <>
            <div>
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  id="voice-search"
                  value={busqueda}
                  onChange={(e) => actualizarInput(e)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar en el arbol jurisprudencial...."
                  required
                />
                <button
                  type="button"
                  onClick={() => search()}
                  className="absolute inset-y-0 end-0 flex items-center pe-3"
                >
                  <FaSearch className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
                </button>
              </div>

              <div className="bg-white p-4">
                {resultados && resultados.length > 0 ? (
                  resultados.map((item, index) => (
                    <div
                      className="flex justify-between items-center bg-gray-50 hover:bg-gray-200 rounded-md p-3 my-2 cursor-pointer transition-all ease-in-out duration-200"
                      key={index}
                      onClick={() => actualizarNodos(item.descriptor)}
                    >
                      <span className="text-black font-semibold">{item.descriptor}</span>
                      <span className="text-gray-600 text-sm">{item.cantidad}</span>
                    </div>
                  ))
                ) : (
                  <ArbolJurisprudencial
                    currentID={currentID}
                    setCurrentID={setCurrentID}
                    setArbol={setArbol}
                    arbol={arbol}
                  />
                )}
              </div>
            </div>
            
          </>
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
            Generación de Cronojurídicas
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
            {renderContent(item.id)}
          </div>
        ))}
      </div>
    </div>
  );
};
export default JurisprudenciaCronologia;
