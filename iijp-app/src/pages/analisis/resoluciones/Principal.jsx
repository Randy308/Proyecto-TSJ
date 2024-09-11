import React, { useEffect, useState } from "react";
import axios from "axios";
import Grafica from "./Grafica";
import { IoPlaySharp } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
const Principal = () => {
  const [data, setData] = useState([]);
  const [salas, setSalas] = useState([]);
  const [formas, setFormas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const endpoint = process.env.REACT_APP_BACKEND;

  const obtenerParametros = async () => {
    try {
      const response = await axios.get(`${endpoint}/obtener-filtradores`);
      setSalas(response.data.salas);
      setFormas(response.data.formas);
      setDepartamentos(response.data.departamentos);
      setTipos(response.data.tipos);
      console.log(response);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  useEffect(() => {
    obtenerParametros();
  }, []);

  const obtenerVariables = (value) => {
    switch (value) {
      case "Sala":
        obtenerSalas();
      case "Tipo de Resolución":
        console.log("Resultado");
        setLista([]);
      default:
        console.log("Otros");
    }
    setSelectedValue(value);
  };

  const [selectedDepartamentos, setSelectedDepartamentos] = useState([]);
  const [selectedSalas, setSelectedSalas] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [selectedFormas, setSelectedFormas] = useState([]);

  const obtenerDepartamentos = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedDepartamentos(selected);
  };
  const obtenerSalas = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedSalas(selected);
  };
  const obtenerTipos = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedTipos(selected);
  };
  const obtenerFormas = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedFormas(selected);
  };
  const limpiarSelect = () => {
    setSelectedDepartamentos([]);
    setSelectedFormas([]);
    setSelectedSalas([]);
    setSelectedTipos([]);
  };

  const generarGrafica = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${endpoint}/obtener-estadisticas-res`, {
        params: {
          departamentos: selectedDepartamentos,
          tipos: selectedTipos,
          salas: selectedSalas,
          formas: selectedFormas,
        },
      });

      if (response.data.data.length > 0) {
        setData(response.data.data);
        setEstadisticas(response.data.estadisticas);
        console.log(response.data.estadisticas);
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      id="GraficoResPrincipal"
      className="w-3/4 mx-auto  p-4 mt-4 custom:mx-0 custom:w-auto"
    >
      <p className="titulo text-3xl font-bold text-center">Resoluciones</p>
      <div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap p-4 items-center justify-center">
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0 subtitulo">
                {" "}
                Tipo de Resolución
              </span>
              <select
                multiple
                value={selectedTipos}
                onChange={obtenerTipos}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {tipos && tipos.length > 0
                  ? tipos.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0 subtitulo">
                {" "}
                Tipo de Sala
              </span>
              <select
                multiple
                value={selectedSalas}
                onChange={obtenerSalas}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {salas && salas.length > 0
                  ? salas.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0 subtitulo">
                {" "}
                Forma de Resolución
              </span>
              <select
                multiple
                value={selectedFormas}
                onChange={obtenerFormas}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {formas && formas.length > 0
                  ? formas.map((item, index) => (
                      <option
                        key={index}
                        value={item.id}
                        className="custom:text-[0.7rem]"
                      >
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0 subtitulo">
                {" "}
                Departamentos
              </span>
              <select
                multiple
                value={selectedDepartamentos}
                onChange={obtenerDepartamentos}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {departamentos && departamentos.length > 0
                  ? departamentos.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 gap-4">
          <button
            className="p-3 bg-blue-500 rounded-xl text-white text-center hover:bg-blue-800 cursor-pointer flex flex-row justify-center items-center"
            onClick={() => limpiarSelect()}
          >
            <AiOutlineClear />
            Limpiar
          </button>
          <button
            className="p-3 bg-blue-500 rounded-xl text-white text-center hover:bg-blue-800 cursor-pointer flex flex-row justify-center items-center"
            onClick={(e) => generarGrafica(e)}
          >
            <IoPlaySharp />
            Generar
          </button>
        </div>
        <div>
          <div className="text-center bg-blue-700 p-4 text-white rounded-lg">
            Resumen Estadístico
          </div>
          <div>
            {estadisticas && estadisticas.total ? (
              <div className="flex  flex-row flex-wrap justify-between m-4 rounde">
                <div className="p-4 flex-grow flex flex-col flex-wrap justify-center items-center border border-black">
                  <span className="titulo font-bold">Total</span>
                  <span className="subtitulo font-italic">{estadisticas.total}</span>
                </div>
                <div className="p-4 flex-grow flex flex-col flex-wrap justify-center items-center border border-black">
                <span className="titulo font-bold">Promedio </span>
                   <span className="subtitulo font-italic">{estadisticas.promedio}</span>
                </div>
                <div className="p-4 flex-grow flex flex-col flex-wrap justify-center items-center border border-black">
                
                  <span className="titulo font-bold">Desviación Estándar</span> 
                  <span className="subtitulo font-italic">{estadisticas.desviacion_estandar}</span>
                </div>
                <div className="p-4 flex-grow flex flex-col flex-wrap justify-center items-center border border-black">
                <span className="titulo font-bold">Mínimo</span> 

                  <span className="subtitulo font-italic">
                    {estadisticas.minimo.year} con{" "}
                    {estadisticas.minimo.cantidad}
                  </span>
                </div>
                <div className="p-4 flex-grow flex flex-col flex-wrap justify-center items-center border border-black">
                <span className="titulo font-bold"> Máximo</span> 

                  <span className="subtitulo font-italic">
                    {estadisticas.maximo.year} con{" "}
                    {estadisticas.maximo.cantidad}
                  </span>
                </div>
              </div>
            ) : (
              " "
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {data && data.length > 0 ? (
              <Grafica content={data}></Grafica>
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Principal;
