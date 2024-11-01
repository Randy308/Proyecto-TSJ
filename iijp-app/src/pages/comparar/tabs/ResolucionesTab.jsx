import React, { useEffect, useState } from "react";

import axios from "axios";

const ResolucionesTab = ({
  setResoluciones,
  setCabeceras,
  setTerminos,
  limiteInferior,
  limiteSuperior,
}) => {
  const endpoint = process.env.REACT_APP_BACKEND;


  const [salas, setSalas] = useState([]);
  const [tipoResolucion, setTipoResolucion] = useState([]);

  const [nombre, setNombre] = useState(null);
  const [selectedSala, setSelectedSala] = useState("todas");
  const [selectedTipo, setSelectedTipo] = useState("todas");

  useEffect(() => {
    getParams();
  }, []);

  const getParams = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/get-params`);
      setSalas(data.salas);
      setTipoResolucion(data.tipo_resolucion);
      setLimiteInferior(data.inferior);
      setLimiteSuperior(data.superior);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };


  
  const cambiarSala = (event) => {
    setNombre(salas.find((element) => element.id == event.target.value).nombre);
    setSelectedSala(event.target.value);
    setSelectedVariable(event.target.id);
    setSelectedValue(event.target.value);
  };

  const cambiarTipoRes = (event) => {
    setNombre(
      tipoResolucion.find((element) => element.id == event.target.value).nombre
    );
    setSelectedTipo(event.target.value);
    setSelectedVariable(event.target.id);
    setSelectedValue(event.target.value);
  };


  const [selectedVariable, setSelectedVariable] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const limpiarFiltros = () => {
    setSelectedSala("Todas");
    setSelectedTipo("Todos");
  };

  const obtenerResoluciones = async () => {
    try {
      const { data } = await axios.get(`${endpoint}/obtener-elemento`, {
        params: {
          value: selectedValue,
          variable: selectedVariable,
          fecha_final: limiteSuperior,
          fecha_inicial: limiteInferior,
          nombre: nombre,
        },
      });
      console.log(data);
      if (data.resoluciones.data.length > 0) {
        setResoluciones((prev) =>
          prev ? [...prev, data.resoluciones] : [data.resoluciones]
        );
        setCabeceras(data.cabeceras);

        setTerminos((prev) =>
          prev.length > 0 ? [...prev, data.termino] : [data.termino]
        );
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div class="max-w-sm mx-auto">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Filtrar por tipo de resolución:
        </label>
        <select
          id="tipo_resolucion_id"
          value={selectedTipo}
          onChange={cambiarTipoRes}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="todas" disabled>
            Selecciona una opción
          </option>
          {tipoResolucion.map((item, index) => (
            <option value={item.id} key={index}>
              {item.nombre}{" "}
            </option>
          ))}
        </select>
      </div>
      <div class="max-w-sm mx-auto">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Filtrar por Sala:
        </label>
        <select
          id="sala_id"
          onChange={cambiarSala}
          value={selectedSala}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="todas" disabled>
            Selecciona una opción
          </option>
          {salas.map((item, index) => (
            <option value={item.id} key={index}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4 my-4 flex justify-end content-end gap-4">
        <button
          className="rounded-lg bg-blue-500 hover:bg-blue-800 p-3 text-white"
          onClick={() => obtenerResoluciones()}
        >
          Generar
        </button>
        <button
          className="rounded-lg bg-blue-500 hover:bg-blue-800 text-white p-3"
          onClick={limpiarFiltros}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default ResolucionesTab;
