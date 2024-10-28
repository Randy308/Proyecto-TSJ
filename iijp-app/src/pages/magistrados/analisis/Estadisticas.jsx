import React, { act, useEffect, useRef, useState } from "react";
import axios from "axios";

import "../../../styles/styles_randy/magistradosTSJ.css";
import EChart from "../../analisis/EChart";
import { variables } from "../../../data/VariablesMagistradoItems";
import Graficas from "./Graficas";
import GraficoMultiple from "../../../components/GraficoMultiple";


const Estadisticas = ({ id }) => {
  const [resoluciones, setResoluciones] = useState([]);
  const [leyenda, setLeyenda] = useState([]);
  const [valor, setValor] = useState(null);
  const lista = ["year", "month", "day"];
  const actual = useRef(0);

  const endpoint = process.env.REACT_APP_BACKEND;
  const url = `${endpoint}/magistrado-estadisticas-departamentos/${id}`;
  const enlace = `${endpoint}/magistrado-estadisticas-salas/${id}`;
  const enlaceV2 = `${endpoint}/magistrado-estadisticas-juris/${id}`;

  useEffect(() => {
    getEstadisticas();
  }, [id]);

  const [activo, setActivo] = useState("primero");
  const actualizar = (id) => {
    setActivo(id);
    console.log(activo);
  };

  const generarFecha = () => {
    if (valor !== null) {
      const selectedData = resoluciones.find((item) => item.fecha === valor);
      return selectedData
        ? selectedData.fecha_inicio
        : resoluciones[0].fecha_inicio;
    }
  };

  const recorrerLista = (reversa) => {
    if (reversa && actual.current === 0) {
      console.log("limite superior alcanzado");
    } else if (!reversa && actual.current === lista.length - 1) {
      console.log("limite inferior alcanzado");
    } else {
      actual.current = reversa ? actual.current - 1 : actual.current + 1;
      console.log(lista[actual.current]);
      getEstadisticas();
    }
  };

  const getEstadisticas = async () => {
    try {
      setResoluciones([]);
      const response = await axios.get(
        `${endpoint}/magistrado-estadisticas-v2/${id}`,
        {
          params: {
            actual: lista[actual.current],
            dato: generarFecha(),
          },
        }
      );
      setResoluciones(response.data.data);
      console.log(response.data.data);
      setLeyenda(response.data.magistrado);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    if (valor != null) {
      recorrerLista(false);
    }
  }, [valor]);

  return (
    <div>
      <div className="flex flex-row items-center justify-center">
        <p className="titulo">Seleccionar Variable :</p>
        <select
          name="variablesMagistrado"
          id="variablesMagistrado"
          className="p-4 m-4"
          onChange={(e) => actualizar(e.target.value)}
        >
          {variables.map((item) => (
            <option value={item.id} key={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="text-center bg-blue-700 p-4 m-4 text-white">
        Resumen Estadístico
      </div>
      <div id="container-estadistica">

        <div className={` ${"primero" === activo ? "" : "hidden"}`}>
          <Graficas
            resoluciones={resoluciones}
            leyenda={leyenda}
            setValor={setValor}
            recorrerLista={recorrerLista}
          ></Graficas>
        </div>
        <div className={`mapa-bolivia ${"segundo" === activo ? "" : "hidden"}`}>
          <EChart url={url}></EChart>
        </div>

        <div className={` mapa-bolivia ${"tercero" === activo ? "" : "hidden"}`}>
          <GraficoMultiple url={enlace}></GraficoMultiple>
        </div>

        <div className={` mapa-bolivia ${"cuarto" === activo ? "" : "hidden"}`}>
          <GraficoMultiple url={enlaceV2}></GraficoMultiple>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
