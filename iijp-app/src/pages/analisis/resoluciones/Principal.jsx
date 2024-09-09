import React, { useEffect, useState } from "react";
import axios from "axios";
const Principal = () => {
  const [lista, setLista] = useState([]);

  const [salas, setSalas] = useState([]);
  const [formas, setFormas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [tipos, setTipos] = useState([]);
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

  const generarGrafica = () => {
    console.log(selectedDepartamentos);
    console.log(selectedFormas);
    console.log(selectedSalas);
    console.log(selectedTipos);
  };

  return (
    <div
      id="GraficoResPrincipal"
      className="w-3/4 mx-auto  p-4 mt-4 custom:mx-0 custom:w-auto"
    >
      <p className="titulo text-3xl font-bold text-center">Resoluciones</p>
      <div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap p-4">
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0">
                {" "}
                Tipo de Resolución
              </span>
              <select
                multiple
                onChange={obtenerTipos}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {tipos && tipos.length > 0
                  ? tipos.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0"> Tipo de Sala</span>
              <select
                multiple
                onChange={obtenerSalas}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {salas && salas.length > 0
                  ? salas.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0">
                {" "}
                Forma de Resolución
              </span>
              <select
                multiple
                onChange={obtenerFormas}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {formas && formas.length > 0
                  ? formas.map((item, index) => (
                      <option
                        key={index}
                        value={item.name}
                        className="custom:text-[0.7rem]"
                      >
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="italic font-bold m-4 mb-0"> Departamentos</span>
              <select
                multiple
                onChange={obtenerDepartamentos}
                className="p-4 m-4 mt-0 border border-gray-500 rounded-sm"
              >
                {departamentos && departamentos.length > 0
                  ? departamentos.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4">
          <button
            className="p-3 bg-blue-500 rounded-xl text-white text-center hover:bg-blue-800 cursor-pointer"
            onClick={() => generarGrafica()}
          >
            Generar
          </button>
        </div>
        <div>
          <div className="text-center bg-blue-700 p-4 text-white rounded-lg">
            Resumen Estadístico
          </div>
          <div className="flex flex-wrap gap-4">
            {lista && lista.length > 0 ? (
              lista.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#EAF8BF] p-4 rounded-xl cursor-pointer text-[#450920] border border-[#450920]"
                >
                  {item.nombre}
                </div>
              ))
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
