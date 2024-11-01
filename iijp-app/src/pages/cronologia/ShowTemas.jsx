import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import "../../styles/styles_randy/cronologia-jurisprudencia.css";
import { FaHouse } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import InputEscenciales from "./tabs/InputEscenciales";
const endpoint = process.env.REACT_APP_BACKEND;
const ShowTemas = () => {
  const navigate = useNavigate();

  const [temas, setTemas] = useState(null);
  const [currentTema, setCurrentTema] = useState(null);

  const [arbol, setArbol] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (arbol.length > 0) {
      setCurrentSlide(1);
      getParams();
      console.log("next");
    } else {
      alert("Debe seleccionar una materia");
    }
  };

  const prevSlide = () => {
    setCurrentSlide(0);
    console.log("prev");
  };

  useEffect(() => {
    getAllTemas();
  }, []);

  const setActivo = (id) => {
    if (currentTema === id) {
      setCurrentTema(null);
    } else {
      setCurrentTema(null);
      setTemas(null);
      getAllHijos(id);
      const nombre = temas.find((tema) => tema.id === id)?.nombre;

      const nuevoArbol = [...arbol, { id: id, nombre: nombre }];
      setArbol(nuevoArbol);
    }
  };

  const getAllHijos = async (id) => {
    try {
      const response = await axios.get(`${endpoint}/nodos-hijos/${id}`);
      setTemas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const getAllTemas = async () => {
    try {
      const response = await axios.get(`${endpoint}/nodos-principales`);
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  const eliminarNodo = (idBuscado) => {
    if (currentSlide === 0) {
      const indice = arbol.findIndex((elemento) => elemento.id === idBuscado);
      const nuevoArbol = arbol.slice(0, indice + 1);
      console.log(nuevoArbol);
      setArbol(nuevoArbol);
    }
  };
  const vaciarNodo = () => {
    if (currentSlide === 0) {
      setArbol([]);
    }
  };

  useEffect(() => {
    if (arbol.length <= 0) {
      getAllTemas();
    } else {
      var lastItem = arbol[arbol.length - 1];
      getAllHijos(lastItem.id);
    }
  }, [arbol]);

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
        navigate("/Jurisprudencia/Cronologias/Resultados", {
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

  const limpiarParametros = () => {
    setFormData({
      departamento: "Todos",
      tipo_resolucion: "Todas",
      forma_resolucion: "Todas",
      fecha_exacta: "",
      fecha_desde: "",
      fecha_hasta: "",
      cantidad: 10,
    });
  };

  const [formData, setFormData] = useState({
    departamento: "Todos",
    tipo_resolucion: "Todas",
    forma_resolucion: "Todas",
    fecha_exacta: "",
    fecha_desde: "",
    fecha_hasta: "",
    cantidad: 10,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const [resultado, setResultado] = useState([]);

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
      alert(`Error: ${message}`);
    }
  };

  if (temas === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="m-4 p-4 custom:p-0 custom:m-0" id="temas-container">
      <div className="header-container">
        <div>
          <p className="text-bold text-3xl text-center my-4 titulo">
            Seleccione Materia
          </p>
          <div className="flex flex-row gap-1 flex-wrap arrow-steps my-4">
            <div
              className={`step custom:text-xs roboto-medium`}
              key={0}
              id={0}
              onClick={() => vaciarNodo()}
            >
              <FaHouse></FaHouse>
            </div>
            {arbol.map((tema) => (
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
      <div className="slider-container">
        <div className={`slide ${currentSlide === 0 ? "current" : ""}`}>
          {temas.map((tema) => (
            <div
              className="p-4 text-white  custom:text-xs text-center titulo rounded-lg materia-div bg-green-400 hover:bg-green-700 hover:cursor-pointer"
              key={tema.id}
              id={tema.id}
              onClick={() => setActivo(tema.id)}
            >
              {tema.nombre}
            </div>
          ))}
        </div>
        <div
          className={`slide second-slide ${
            currentSlide === 1 ? "current" : ""
          }`}
        >
          <div className="p-4">
            <div></div>
            {resultado != null > 0 ? (
              <InputEscenciales
                formData={formData}
                setFormData={setFormData}
                resultado={resultado}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="button-container">
        <button
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 0 ? "ocultar" : ""
          }`}
          onClick={prevSlide}
        >
          Anterior
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 0 ? "ocultar" : ""
          }`}
          onClick={limpiarParametros}
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={obtenerCronologia}
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 0 ? "ocultar" : ""
          }`}
        >
          Generar Cronologia
        </button>

        <button
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 1 ? "ocultar" : ""
          }`}
          onClick={nextSlide}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ShowTemas;
