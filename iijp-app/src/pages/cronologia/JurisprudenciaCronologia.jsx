import React, { useEffect, useState } from "react";
import ArbolJurisprudencial from "./tabs/ArbolJurisprudencial";
import { cronologiaItems } from "../../data/CronologiaItems.js";
import InputEscenciales from "./tabs/InputEscenciales";
import { FaHouse } from "react-icons/fa6";
import { toast } from "react-toastify";
import Tipografia from "./tabs/Tipografia";
import { useNavigate } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import { FaSearch } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import JurisprudenciaService from "../../services/JurisprudenciaService";
import { filterForm } from "../../utils/filterForm";
import { GoDotFill } from "react-icons/go";

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
    seccion: false,
  });
  const [activador, setActivador] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");
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

  const checkSearch = (valor) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s'’-]+$/;

    if (regex.test(valor) || valor === "") {
      return true;
    } else {
      return false;
    }
  };
  const actualizarInput = (e) => {
    const valor = e.target.value;
    if (checkSearch(valor)) {
      setBusqueda(valor);
      setErrorBusqueda("");
    } else {
      setErrorBusqueda("No se permiten caracteres especiales");
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
    const nombresTemas = arbol.map(({ nombre }) => nombre).join(" / ");

    JurisprudenciaService.parametrosCronologia({
      descriptor: nombresTemas,
    })
      .then(({ data }) => {
        const { departamentos, salas, tipo_resolucions } = data;

        if (
          [departamentos, salas, tipo_resolucions].some((arr) => arr.length > 0)
        ) {
          setResultado(data);
        } else {
          alert("No existen datos");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      });
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
    if (!checkSearch(busqueda)) {
      return;
    }
    try {
      const nombresTemas = arbol.map(({ nombre }) => nombre).join(" / ");

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

  const navigate = useNavigate();
  const obtenerCronologia = async (e) => {
    e.preventDefault();

    if (arbol.length <= 0) {
      toast.error("Seleccione una materia primero");
      return;
    }
    const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");

    const validatedData = filterForm({
      tema_id: arbol[arbol.length - 1].id,
      descriptor: nombresTemas,
      ...formData,
    });
    setIsLoading(true);
    JurisprudenciaService.obtenerCronologia(validatedData)
      .then(({ data }) => {
        console.log(data);
        const pdfBlob = new Blob([data], {
          type: "application/pdf",
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        navigate("/Jurisprudencia/Cronologias/Resultados", {
          state: { pdfUrl: pdfUrl },
        });
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (activador && arbol.length > 0) {
      getParams();
    }
  }, [activador, arbol]);

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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar en el árbol jurisprudencial...."
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

              {errorBusqueda.length > 0 && (
                <div
                  id="alert-2"
                  class="flex items-center p-4 mb-4 text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <FaInfo class="shrink-0 w-4 h-4" />
                  <div class="ms-3 text-sm font-medium">{errorBusqueda}</div>
                </div>
              )}

              <div className="bg-white p-4 dark:bg-gray-800">
                {resultados && resultados.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-md p-3 my-2">
                      <span>
                        La búsqueda genero:{" "}
                        {resultados.length > 1
                          ? resultados.length + " resultados"
                          : "un resultado"}
                      </span>
                      <span
                        onClick={() => setResultados([])}
                        className="cursor-pointer underline"
                      >
                        Limpiar Resultados
                      </span>
                    </div>
                    {resultados.map((item, index) => (
                      <div
                        className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 hover:dark:bg-gray-700 hover:bg-gray-200 rounded-md p-3 my-2 cursor-pointer transition-all ease-in-out duration-200"
                        key={index}
                        onClick={() => actualizarNodos(item.descriptor)}
                      >
                        <span className="text-black font-semibold dark:text-white ">
                          {item.descriptor}
                        </span>
                        <span className="text-gray-600 text-sm dark:text-gray-400">
                          {item.cantidad}
                        </span>
                      </div>
                    ))}
                  </>
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

  return (
    <div id="cronologia-container" className="p-4 m-4">
      <div className="header-container">
        <div>
          <p className="text-bold text-3xl text-center my-4 titulo uppercase font-bold text-black dark:text-white">
            Generación de Cronojurídicas
          </p>
          <div className="flex-row gap-1 flex-wrap arrow-steps my-4 hidden md:flex">
            <div
              className={`step custom:text-xs roboto-medium flex items-center ${
                tabActivo === 1 ? "activo" : "noactivo"
              }`}
              key={0}
              onClick={() => vaciarNodo()}
            >
              <FaHouse></FaHouse>
            </div>
            {arbol &&
              arbol.map((tema) => (
                <div
                  className={`step roboto-medium flex items-center ${
                    tema.id === arbol[arbol.length - 1].id ? "current" : ""
                  } ${tabActivo === 1 ? "activo" : "noactivo"}`}
                  key={tema.id}
                  id={tema.id}
                  onClick={() => eliminarNodo(tema.id)}
                >
                  {tema.nombre}
                </div>
              ))}
          </div>
          <div className="md:hidden flex flex-col gap-4 py-4 relative">
            {/* Línea vertical limitada al contenido */}
            <div className="absolute left-2 top-0 w-1 h-[calc(100%-1.25rem)] bg-gray-300 dark:bg-gray-600"></div>

            {/* Primer nodo */}
            <div
              className="flex items-center gap-2 text-gray-500 relative z-10"
              onClick={() => vaciarNodo()}
            >
              <GoDotFill className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full" />
              <FaHouse className="w-5 h-5" />
            </div>

            {/* Nodos de la línea de tiempo */}
            {arbol &&
              arbol.map((tema, index) => (
                <div
                  className={`flex items-center gap-2 text-sm relative z-10 ${
                    tema.id === arbol[arbol.length - 1].id
                      ? "current text-blue-500"
                      : "text-gray-500"
                  } ${tabActivo === 1 ? "activo" : "noactivo"}`}
                  key={tema.id}
                  id={tema.id}
                  onClick={() => eliminarNodo(tema.id)}
                >
                  {/* Punto con línea que no continúa después del último nodo */}
                  <div className="relative">
                    <GoDotFill className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full" />
                    {index !== arbol.length - 1 && (
                      <div className="absolute top-5 left-2 w-1 h-full bg-gray-300 dark:bg-gray-600"></div>
                    )}
                  </div>
                  <span>{tema.nombre}</span>
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
