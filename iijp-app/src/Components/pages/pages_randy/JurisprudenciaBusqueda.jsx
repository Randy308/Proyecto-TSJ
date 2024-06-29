import React, { useEffect, useState } from "react";
import "../../../Styles/Styles_randy/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";
//import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const JurisprudenciaBusqueda = () => {
  const endpoint = "http://localhost:8000/api";

  const [activo, setActivo] = useState(null);

  const [lastPage, setLastPage] = useState(1);
  const [salas, setSalas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [resoluciones, setResoluciones] = useState([]);
  useEffect(() => {
    getParams();
    console.log(process.env.REACT_APP_BACKEND)
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
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSala, setSelectedSala] = useState("todas");
  const [pageCount, setPageCount] = useState(1);
  const cambiarActivo = (id, name) => {
    setActivo(id);
    setSelectedDepartamento(name);
  };
  const cambiarYear = (event) => {
    setSelectedYear(event.target.value);
  };
  const cambiarSala = (event) => {
    setSelectedSala(event.target.value);
  };

  const cambiarDepartamento = (event) => {
    setSelectedDepartamento(event.target.value);
  };

  const actualizarInput = (event) => {
    setTexto(event.target.value);
  };

  const limpiarFiltros = () => {
    setSelectedYear("");
    setSelectedSala("");
    setSelectedDepartamento("");
    setTexto("");
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
          selectedYear: selectedYear,
          selectedSala: selectedSala,
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
      className="md:container mx-auto bg-gray-200"
      id="jurisprudencia-busqueda"
    >
      <div className="row p-4">
        <p className="m-4 p-4 text-center font-bold text-2xl">
          Búsqueda de Jurisprudencia
        </p>
        <div className="flex flex-col bg-gray-100">
          <div className="bg-[#2C8BC5] p-4 text-white font-bold rounded-t-lg">
            <p>Campos de busqueda</p>
          </div>
          <div className="p-4 m-4 custom:m-0 rounded-b-lg" id="search-box">
            <input
              id="search-bar"
              type="text"
              onChange={actualizarInput}
              className="form-control p-1 rounded-l-lg"
              placeholder="Buscar..."
            />
            <div className="input-group-append">
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
                  <select className="form-control" onChange={cambiarYear}>
                    <option value="Recientes">Recientes</option>
                    <option value="Antiguos">Antiguos</option>
                  </select>
                </div>

                <div className="select-form">
                  <p>Filtrar por Departamento:</p>
                  <select
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
                  <select className="form-control" onChange={cambiarSala}>
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
                  <input className="form-control" type="date"></input>
                </div>

                <div className="select-form">
                  <p>Fecha Desde</p>
                  <input className="form-control" type="date"></input>
                </div>

                <div className="select-form">
                  <p>Fecha Hasta</p>
                  <input className="form-control" type="date"></input>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 my-4 flex justify-end content-end gap-4">
            <button
              className="rounded-lg bg-blue-500 hover:bg-blue-800 p-4 text-white"
              onClick={() => obtenerResoluciones(1)}
            >
              Buscar
            </button>
            <button className="rounded-lg bg-blue-500 hover:bg-blue-800 text-white p-4" onClick={()=> limpiarFiltros}> Limpiar </button>
          </div>
        </div>
      </div>

      <div className="row p-4">
        <div className="p-4 m-4">Resultados</div>
        {resoluciones.map((item, index) => (
          <div
            className="flex flex-row gap-1 p-4 m-4 content-between justify-between bg-white rounded-lg"
            key={index}
          >
            <div>Numero de Resolucion: {item.nro_resolucion}</div>
            <div>Fecha de Emision: {item.fecha_emision}</div>
            <div>{item.sala_id}</div>

            <div>Departamento: {item.departamento_id}</div>
          <span>{process.env.REACT_APP_SECRET_NAME}</span>
            <div>
              <button className="p-4 bg-blue-400 text-white rounded-lg">
                <a
                  href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.id}`}
                >
                  Ver resolucion
                </a>
              </button>
            </div>
          </div>
        ))}
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
            activeClassName="bg-purple-500 text-white"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
};

export default JurisprudenciaBusqueda;
