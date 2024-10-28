import React, { useEffect, useState } from "react";
import "../../styles/styles_randy/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";
import axios from "axios";
import { TbMathFunction } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import "../../styles/paginate.css";
import Loading from "../../components/Loading";
import LineChart from "../analisis/LineChart";
import styles from "./CompararDatos.module.css";
import { RxDotsVertical } from "react-icons/rx";
const CompararDatos = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [activo, setActivo] = useState(null);
  const [salas, setSalas] = useState([]);
  const [tipoResolucion, setTipoResolucion] = useState([]);
  const [resoluciones, setResoluciones] = useState(null);
  const [limiteSuperior, setLimiteSuperior] = useState(null);
  const [limiteInferior, setLimiteInferior] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [cabeceras, setCabeceras] = useState(null);

  const [valor, setValor] = useState("");

  const [terminos, setTerminos] = useState([]);
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

  const [selectedVariable, setSelectedVariable] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedSala, setSelectedSala] = useState("todas");
  const [selectedTipo, setSelectedTipo] = useState("todas");
  const [texto, setTexto] = useState("");
  const cambiarSala = (event) => {
    setNombre(salas.find((element) => element.id == event.target.value).nombre);
    setSelectedSala(event.target.value);
    setSelectedVariable(event.target.id);
    setSelectedValue(event.target.value);
  };

  const cambiarDepartamento = (event) => {
    setNombre(
      tipoResolucion.find((element) => element.id == event.target.value).nombre
    );
    setSelectedTipo(event.target.value);
    setSelectedVariable(event.target.id);
    setSelectedValue(event.target.value);
  };

  const actualizarInput = (event) => {
    setTexto(event.target.value);
    setNombre(event.target.value);
    setSelectedVariable(event.target.id);
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    console.log(selectedVariable);
  }, [selectedVariable]);

  useEffect(() => {
    console.log(resoluciones);
  }, [resoluciones]);

  const limpiarFiltros = () => {
    setSelectedSala("Todas");
    setSelectedTipo("Todos");
    setTexto("");
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

  const cambiarEstado = () => {
    if (activo === true) {
      setActivo(false);
    } else {
      setActivo(true);
    }
  };
  const [option, setOption] = useState({});
  useEffect(() => {
    if (resoluciones && cabeceras) {
      setOption({
        title: {
          text: "Interés a lo largo del tiempo",
          padding: [20, 20, 10, 20],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: resoluciones.map((item) => item.name),
          padding: [20, 20, 10, 20],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: cabeceras,
        },
        yAxis: {
          type: "value",
        },
        series: resoluciones.map((item) => item),
        grid: {
          top: "10%", // Adjust top padding
          bottom: "10%", // Adjust bottom padding
          left: "10%", // Adjust left padding
          right: "10%", // Adjust right padding
        },
      });
    }
  }, [resoluciones, cabeceras]);


  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

  return (
    <div
      className="md:container mx-auto px-40 custom:px-0"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        <p className="m-4 p-4 text-center font-bold text-2xl titulo">
          Análisis de Jurisprudencia Avanzada
        </p>
        <div className="flex flex-col bg-white rounded-lg border border-slate-400">
          <div className="bg-[#450920] p-4 text-white font-bold rounded-t-lg flex flex-row flex-wrap gap-4 items-center justify-start">
            <FaFilter></FaFilter> <p>Campos de filtrado</p>
          </div>
          <div className="p-4 m-4 custom:m-0 rounded-b-lg flex flex-row flex-wrap ">
            <div className="p-2 flex justify-center items-center border border-black border-r-0 rounded-l-lg">
              <TbMathFunction></TbMathFunction>
            </div>
            <div className="flex border border-black border-r-0 max-lg:border-r max-lg:rounded-r-md max-lg:flex-grow">
              <select>
                <option disabled>Variable</option>
                <option>contenido</option>
              </select>
            </div>

            <div className="flex-grow flex input-group-append border rounded-lg rounded-l-none border-slate-500 custom:rounded-l-md">
              <input
                id="contents"
                type="text"
                value={texto}
                onChange={actualizarInput}
                className="form-control p-3 rounded-l-lg rounded-t-lg rounded-b-lg flex-grow"
                placeholder="Buscar..."
              />
              <button
                type="button"
                id="BottonFiltrado"
                className="btn btn-info bg-slate-400 p-4 rounded-r-lg"
                onClick={() => cambiarEstado()}
              >
                <FaFilter></FaFilter>
              </button>
            </div>
          </div>
          <div
            id="filtrosEvento"
            className={`p-4 m-4 ${activo === true ? " " : "FiltroInvisible"}`}
          >
            <div className="grid grid-row-2 gap-4">
              <div className="row-select">
                <div className="select-form">
                  <p>Filtrar por tipo de resolución:</p>
                  <select
                    id="tipo_resolucion_id"
                    value={selectedTipo}
                    className="form-control p-2 border border-gray-300"
                    onChange={cambiarDepartamento}
                  >
                    <option value="todas" disabled>
                      Selecciona una opcion
                    </option>
                    {tipoResolucion.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.nombre}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-form">
                  <p>Filtrar por Sala:</p>
                  <select
                    id="sala_id"
                    className="form-control p-2 border border-gray-300"
                    onChange={cambiarSala}
                    value={selectedSala}
                  >
                    <option value="todas" disabled>
                    Selecciona una opcion
                    </option>
                    {salas.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row-select"></div>
            </div>
          </div>
          <div className="p-4 my-4 flex justify-end content-end gap-4">
            <button
              className="rounded-lg bg-blue-500 hover:bg-blue-800 p-3 text-white"
              onClick={() => obtenerResoluciones()}
            >
              Buscar
            </button>
            <button
              className="rounded-lg bg-blue-500 hover:bg-blue-800 text-white p-3"
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap py-4 m-4 gap-4">
        {terminos && terminos.length > 0
          ? terminos.map((item, index) => (
              <div className="bg-white dark:bg-[#100C2A] text-black rounded-md p-4 flex flex-row justify-center items-center gap-4">
                <div className="p-2">
                  <div className="titulo text-xl">
                  {toTitleCase(item.name.replace(/_/g, ' '))} : <span>{item.value}</span>{" "}
                  </div>
                  <div className="text-gray-400">Termino de busqueda</div>
                </div>
                <div className="titulo">
                  <RxDotsVertical />
                </div>
              </div>
            ))
          : ""}
      </div>

      <div className={styles.graficoContenedor} id="grafico-contenedor">
        {resoluciones && resoluciones.length > 0 ? (
          <LineChart option={option} setData={setValor}></LineChart>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </div>
  );
};
export default CompararDatos;
