import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../Components/Loading";
import "../../../Styles/Styles_randy/cronologia-jurisprudencia.css";
import { useNavigate } from "react-router-dom";
const endpoint = "http://localhost:8000/api";
const ShowTemas = () => {
  const navigate = useNavigate();

  const [temas, setTemas] = useState(null);
  const [currentTema, setCurrentTema] = useState(null);

  const [arbol, setArbol] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(1);
    console.log("next");
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
      const response = await axios.get(`${endpoint}/salas-hijos/${id}`);
      setTemas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const getAllTemas = async () => {
    try {
      const response = await axios.get(`${endpoint}/temas-generales`);
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  const eliminarNodo = (tema) => {
    const index = arbol.indexOf(tema);
    const nuevoArbol = arbol.slice(0, index);
    console.log(nuevoArbol);
    setArbol(nuevoArbol);

    if (nuevoArbol.length <= 0) {
      getAllTemas();
    } else {
      var lastItem = nuevoArbol[nuevoArbol.length - 1];
      getAllHijos(lastItem.id);
    }
  };

  const obtenerCronologia = async (e) => {
    e.preventDefault();
    try {
      const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");
      const response = await axios.get(`${endpoint}/cronologias`, {
        params: {
          tema_id: arbol[arbol.length - 1].id,
          tema_nombre: arbol[arbol.length - 1].nombre,
          descriptor: nombresTemas,
        },
      });
      console.log(response.data);
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
      alert(message.error)
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
    <div id="cronologia-container" className="m-4 p-4">
      <div className="header-container">
      <div>
        <p className="text-bold text-3xl text-center my-4">
          Seleccione Materia
        </p>
        <div className="flex flex-row gap-1 flex-wrap arrow-steps clearfix my-4">
          {arbol.map((tema, index) => (
            <div
              className={`step  hover:cursor-pointer ${
                tema.id === arbol[arbol.length - 1].id ? "current" : ""
              }`}
              key={tema.id}
              id={tema.id}
              onClick={() => eliminarNodo(tema)}
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
              className={`p-4 rounded-lg materia-div bg-blue-400 hover:bg-blue-700 text-white hover:cursor-pointer"`}
              key={tema.id}
              id={tema.id}
              onClick={() => setActivo(tema.id)}
            >
              {tema.nombre}
            </div>
          ))}
        </div>
        <div className={`slide ${currentSlide === 1 ? "current" : ""}`}></div>
      </div>
      <div className="button-container">
        <button
          className={`bg-blue-400 hover:bg-blue-700 p-4 rounded-lg text-white ${currentSlide === 0 ? "ocultar" : ""}`}
          onClick={prevSlide}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={obtenerCronologia}
          className="bg-blue-400 hover:bg-blue-700 p-4 rounded-lg text-white"
        >
          Generar Cronologia
        </button>
        <button
          className={`bg-blue-400 hover:bg-blue-700 p-4 rounded-lg text-white ${currentSlide === 1 ? "ocultar" : ""}`}
          onClick={nextSlide}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ShowTemas;
