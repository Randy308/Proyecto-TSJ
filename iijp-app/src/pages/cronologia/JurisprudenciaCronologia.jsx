import React, { useEffect, useState } from "react";
import ArbolJurisprudencial from "./tabs/ArbolJurisprudencial";
import { cronologiaItems } from "../../data/CronologiaItems.js";
import InputEscenciales from "./tabs/InputEscenciales";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import Tipografia from "./tabs/Tipografia";
import { useNavigate } from "react-router-dom";

const endpoint = process.env.REACT_APP_BACKEND;
const JurisprudenciaCronologia = () => {
  const [currentID, setCurrentID] = useState(null);
  const [arbol, setArbol] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [tabActivo, setTabActivo] = useState(1);
  const [formData, setFormData] = useState({
    departamento: "Todos",
    tipo_resolucion: "Todas",
    forma_resolucion: "Todas",
    fecha_exacta: "",
    fecha_desde: "",
    fecha_hasta: "",
    cantidad: 10,
  });

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
  const [activador, setActivador] = useState(false);
  const actualizarTab = (id) => {
    if (id != 1) {
      if (arbol.length > 0) {
        //getParams();
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

      const { departamentos, forma_resolucions, tipo_resolucions } = data;

      if (
        [departamentos, forma_resolucions, tipo_resolucions].some(
          (arr) => arr.length > 0
        )
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
  useEffect(() => {
    if (activador && arbol.length > 0) {
      getParams();
    }
  }, [activador, arbol]);

  const navigate = useNavigate();
  const obtenerCronologia = async (e) => {
    e.preventDefault();
    try {
      const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");
      const response = await axios.get(`${endpoint}/cronologias`, {
        params: {
          tema_id: arbol[arbol.length - 1].id,
          tema_nombre: arbol[arbol.length - 1].nombre,
          descriptor: nombresTemas,
          ...formData,
        },
      });
      if (response.data.length > 0) {
        navigate("/jurisprudencia/cronologias/resultados", {
          state: { data: response.data },
        });
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      const message = error.response.data;
      console.error("Error fetching data:", message);
      alert(message.error);
    }
  };

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
                    ? "text-white bg-blue-700  active dark:bg-blue-600"
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
      <button
        type="button"
        onClick={(e) => obtenerCronologia(e)}
        className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white`}
      >
        Generar Cronologia
      </button>
    </div>
  );
};
export default JurisprudenciaCronologia;
