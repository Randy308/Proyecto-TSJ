import React, { useEffect, useState } from "react";
import "../../styles/styles_randy/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";

import axios from "axios";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import PaginationData from "./PaginationData";
import { TbMathFunction } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
const JurisprudenciaBusqueda = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  const [activo, setActivo] = useState(null);

  const [lastPage, setLastPage] = useState(1);
  const [salas, setSalas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [resoluciones, setResoluciones] = useState([]);

  useEffect(() => {
    getParams();
  }, []);

  const getParams = async () => {
    try {
      const response = await axios.get(`${endpoint}/obtener-parametros`);
      setSalas(response.data.salas);
      setDepartamentos(response.data.departamentos);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const [selectedDepartamento, setSelectedDepartamento] = useState("todos");
  const [texto, setTexto] = useState("");
  const [selectedSala, setSelectedSala] = useState("todas");
  const [orden, setOrden] = useState("Recientes");
  const [fechaExacta, setFechaExacta] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [pageCount, setPageCount] = useState(1);

  const cambiarSala = (event) => {
    setSelectedSala(event.target.value);
  };
  const cambiarOrden = (event) => {
    setOrden(event.target.value);
  };

  const cambiarDepartamento = (event) => {
    setSelectedDepartamento(event.target.value);
  };
  const cambiarFechaExacta = (event) => {
    setFechaExacta(event.target.value);
    setFechaDesde("");
    setFechaHasta("");
  };
  const cambiarFechaDesde = (event) => {
    setFechaDesde(event.target.value);
    setFechaExacta("");
  };
  const cambiarFechaHasta = (event) => {
    setFechaHasta(event.target.value);
    setFechaExacta("");
  };

  const actualizarInput = (event) => {
    setTexto(event.target.value);
  };

  const limpiarFiltros = () => {
    setSelectedSala("Todas");
    setSelectedDepartamento("Todos");
    setTexto("");
    setOrden("Recientes");
    setFechaDesde("");
    setFechaExacta("");
    setFechaHasta("");
  };

  const handlePageClick = (e) => {
    const selectedPage = Math.min(e.selected + 1, lastPage);
    //setPage(selectedPage);
    obtenerResoluciones(selectedPage);
  };
  const obtenerResoluciones = async (page) => {
    try {
      const response = await axios.get(`${endpoint}/filtrar-resoluciones`, {
        params: {
          texto: texto,
          departamento: selectedDepartamento,
          selectedSala: selectedSala,
          orden: orden,
          fecha_exacta: fechaExacta,
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
          page: page,
        },
      });
      console.log(response.data);
      if (response.data.data.length > 0) {
        setResoluciones(response.data.data);
        setLastPage(response.data.last_page);
        setPageCount(response.data.last_page);
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

  return (
    <div
      className="md:container mx-auto px-40 custom:px-0"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        <p className="m-4 p-4 text-center font-bold text-2xl">
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
            <div className="flex border border-black border-r-0">
              <select>
                <option disabled>Variable</option>
                <option>Hola mundo</option>
              </select>
            </div>

            <div className="flex-grow flex input-group-append border rounded-lg rounded-l-none border-slate-500">
              <input
                id="search-bar"
                type="text"
                value={texto}
                onChange={actualizarInput}
                className="form-control p-1 rounded-l-lg rounded-t-lg rounded-b-lg flex-grow"
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
                  <p>Ordenar por:</p>
                  <select
                    className="form-control"
                    value={orden}
                    onChange={cambiarOrden}
                  >
                    <option value="Recientes">Recientes</option>
                    <option value="Antiguos">Antiguos</option>
                  </select>
                </div>

                <div className="select-form">
                  <p>Filtrar por Departamento:</p>
                  <select
                    value={selectedDepartamento}
                    className="form-control"
                    onChange={cambiarDepartamento}
                  >
                    <option value="todos">Todos</option>
                    {departamentos.map((item, index) => (
                      <option value={item.nombre} key={index}>
                        {item.nombre}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-form">
                  <p>Filtrar por Sala:</p>
                  <select
                    className="form-control"
                    onChange={cambiarSala}
                    value={selectedSala}
                  >
                    <option value="todas">Todas</option>
                    {salas.map((item, index) => (
                      <option value={item.nombre} key={index}>
                        {item.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row-select">
                <div className="select-form">
                  <p>Fecha Exacta</p>
                  <input
                    value={fechaExacta}
                    className="form-control"
                    type="date"
                    onChange={cambiarFechaExacta}
                  ></input>
                </div>

                <div className="select-form">
                  <p>Fecha Desde</p>
                  <input
                    value={fechaDesde}
                    className="form-control"
                    type="date"
                    onChange={cambiarFechaDesde}
                  ></input>
                </div>

                <div className="select-form">
                  <p>Fecha Hasta</p>
                  <input
                    value={fechaHasta}
                    className="form-control"
                    type="date"
                    onChange={cambiarFechaHasta}
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 my-4 flex justify-end content-end gap-4">
            <button
              className="rounded-lg bg-blue-500 hover:bg-blue-800 p-3 text-white"
              onClick={() => obtenerResoluciones(1)}
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

      <div className="row p-4">
        {resoluciones.length > 0 && <PaginationData data={resoluciones} />}
        <div>
          <ReactPaginate
            breakLabel={<span className="mr-4">...</span>}
            nextLabel={
              <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-md">
                <BsChevronRight />
              </span>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={
              <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-md mr-4">
                <BsChevronLeft />
              </span>
            }
            containerClassName="flex items-center justify-center mt-8 mb-4 gap-2"
            pageClassName="block border border-solid w-10 h-10 flex items-center justify-center 
                rounded-md mr-4 hover:bg-slate-100"
            activeClassName="bg-[#450920] text-white"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
};

export default JurisprudenciaBusqueda;
