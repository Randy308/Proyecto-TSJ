import React, { useEffect, useState } from "react";
import ArbolJurisprudencial from "./tabs/ArbolJurisprudencial";
import { cronologiaItems } from "../../data/CronologiaItems.js";
import InputEscenciales from "./tabs/InputEscenciales";
import { FaHouse } from "react-icons/fa6";
import { toast } from "react-toastify";
import Tipografia from "./tabs/Tipografia";
import { Link, useNavigate } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import { FaSearch } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import JurisprudenciaService from "../../services/JurisprudenciaService";
import { filterForm } from "../../utils/filterForm";
import { GoDotFill } from "react-icons/go";
import Resoluciones from "./tabs/Resoluciones";

const CronologiasBasicas = () => {
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
  const [ids, setIds] = useState([]);
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
    if (id != 1 && arbol.length <= 0) {
      toast.warning("Seleccione una materia primero");
      return;
    }

    if (tabActivo != id) {
      setTabActivo(id);
    }
  };

  useEffect(() => {
    switch (tabActivo) {
      case 1:
        console.log("Arbol Jurisprudencial");
        return;
      case 2:
        console.log("Datos Esenciales");
        if (arbol.length > 0) {
          getParams();
        }
        return;
      case 3:
        console.log("Resoluciones");
        return;
      case 4:
        console.log("Tipografia");
        return;

      default:
        console.log("Hola mundo");
        return;
    }
  }, [currentID, tabActivo]);
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
          setIds(data.ids);
        } else {
          alert("No existen datos");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      });
  };

  const obtenerResoluciones = async (page = 1) => {
    const validPage = page && !isNaN(page) && page > 0 ? page : 1;
    const validatedData = filterForm({
      ids: ids,
      page: validPage,
    });

    JurisprudenciaService.obtenerResoluciones(validatedData)
      .then(({ data }) => {
        if (data.data.length > 0) {
          setResoluciones(data.data);
          setLastPage(data.last_page);
          setPageCount(data.last_page);
          setTotalCount(data.total);
        } else {
          toast.warning("No existen datos");
        }
      })
      .catch((error) => {
        const message = error.response?.data?.error || "Ocurrió un error";
        console.error("Error fetching data:", message);
      })
      .finally(() => {});
  };

  const actualizarNodos = async (descriptor, ids) => {
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
            setIds(ids);
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
          setErrorBusqueda("No se encontraron resultados");
          setResultados([]);
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

  return (
    <div id="cronologia-container" className="p-4 m-4">
      <div className="header-container">
        <div>
          <p className="text-bold text-3xl text-center my-4 titulo uppercase font-bold text-black dark:text-white">
            Generación de Cronojurídicas
          </p>
          <div className="mx-auto container p-4 text-center rounded-lg sm:p-8">
            <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 m-4">
              <li className="w-full focus-within:z-10">
                <a
                  to="/comparar-datos"
                  className="inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current="page"
                >
                  Búsqueda Básica
                </a>
              </li>
              <li className="w-full focus-within:z-10">
                <Link
                  to="/busqueda-de-jurisprudencia"
                  className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Búsqueda Avanzada
                </Link>
              </li>
            </ul>
          </div>
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
      <div className="w-full">
        <ArbolJurisprudencial
          currentID={currentID}
          setCurrentID={setCurrentID}
          setArbol={setArbol}
          arbol={arbol}
        />
      </div>
    </div>
  );
};

export default CronologiasBasicas;
