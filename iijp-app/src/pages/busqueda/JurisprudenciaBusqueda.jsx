import React, { useEffect, useState } from "react";
import "../../styles/jurisprudencia-busqueda.css";
import { FaFilter } from "react-icons/fa";
import PaginationData from "./PaginationData";
import { ImSearch } from "react-icons/im";
import { MdCleaningServices } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Paginate from "../../components/tables/Paginate";
import "../../styles/paginate.css";
import AsyncButton from "../../components/AsyncButton";
import Select from "../comparar/tabs/Select";
import { Link, useLocation } from "react-router-dom";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import ResolucionesService from "../../services/ResolucionesService";

const JurisprudenciaBusqueda = () => {

  const [activo, setActivo] = useState(true);
  const { state } = useLocation();
  const { flag } = state || false;

  const [lastPage, setLastPage] = useSessionStorage("lastPage", 1);
  const [actualPage, setActualPage] = useSessionStorage("actualPage", 0);
  const [pageCount, setPageCount] = useSessionStorage("pageCount", 1);
  const [resoluciones, setResoluciones] = useSessionStorage("resoluciones", []);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useSessionStorage("data", {});
  const [hasFetchedData, setHasFetchedData] = useSessionStorage(
    "hasFetchedData",
    false
  );

  const [actualFormData, setActualFormData] = useState(null);

  const [formData, setFormData] = useSessionStorage("formData", {
    tipo_resolucion: "all",
    sala: "all",
    magistrado: "all",
    departamento: "all",
    forma_resolucion: "all",
    tipo_jurisprudencia: "all",
    materia: "all",
  });

  const [texto, setTexto] = useState("");

  const setParams = (name, value) => {
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
  };

  const removeParam = (name) => {
    const updatedFormData = { ...formData };
    delete updatedFormData[name];

    setFormData(updatedFormData);
  };

  const cambiarFechaExacta = (event) => {
    setParams("fecha_exacta", event.target.value);
    removeParam("fecha_inicial");
    removeParam("fecha_final");
  };
  const cambiarFechaDesde = (event) => {
    setParams("fecha_inicial", event.target.value);
    removeParam("fecha_exacta");
  };
  const cambiarFechaHasta = (event) => {
    setParams("fecha_final", event.target.value);
    removeParam("fecha_exacta");
  };

  const actualizarInput = (event) => {
    setTexto(event.target.value);
  };

  const limpiarFiltros = () => {
    setTexto("");
    updatedFormData = {
      tipo_resolucion: "all",
      sala: "all",
      magistrado: "all",
      departamento: "all",
      forma_resolucion: "all",
      tipo_jurisprudencia: "all",
      materia: "all",
    };

    setFormData(updatedFormData);
  };

  const handlePageClick = (e) => {
    const selectedPage = Math.min(e.selected + 1, lastPage);
    setActualPage(e.selected);
    obtenerResoluciones(selectedPage);
  };

  useEffect(() => {
    if (!hasFetchedData) {
      getSelect();
    }
  }, []);

  const getSelect = async () => {
    ResolucionesService.obtenerParametros()
      .then(({ data }) => {
        setData(data);
        setHasFetchedData(true);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  };

  useEffect(() => {
    if (actualFormData) {
      obtenerResoluciones(1);
    }
  }, [actualFormData]);

  const obtenerResoluciones = async (page) => {
    setIsLoading(true);

    const validPage = page && !isNaN(page) && page > 0 ? page : 1;

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "all"
      )
    );

    ResolucionesService.buscarResoluciones({
      term: texto,
      ...filteredData,
      ...actualFormData,
      page: validPage,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          setResoluciones(response.data.data);
          setLastPage(response.data.last_page);
          setPageCount(response.data.last_page);
        } else {
          console.log("No existen datos");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (flag) {
      obtenerResoluciones(1);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="row p-4">
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-900  shadow mt-4">
          <div className="w-full p-4 text-center bg-white rounded-lg sm:p-8 dark:bg-gray-800  dark:border-gray-900">
            <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 m-4">
              <li className="w-full focus-within:z-10">
                <Link
                  to="/comparar-datos"
                  className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Series Temporales
                </Link>
              </li>
              <li className="w-full focus-within:z-10">
                <a
                  to="/comparar-datos"
                  className="inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                  aria-current="page"
                >
                  Busqueda de Resoluciones
                </a>
              </li>
            </ul>
            <div className="mx-5 my-3 flex gap-4 text-gray-900 rounded-lg bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white border border-gray-300 dark:border-gray-600">
              <input
                type="search"
                value={texto}
                onChange={actualizarInput}
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 rounded-lg bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                placeholder="Buscar por termino de busqueda..."
                required
              />
              <div className="inset-y-0 start-0 flex items-center pe-3 pointer-events-none">
                <ImSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className={`p-4 m-4 ${activo ? " " : "hidden"}`}>
            <div className="grid grid-cols-3 gap-4 custom:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data &&
                Object.entries(data).map(([key, items]) => (
                  <Select
                    key={key}
                    formData={formData}
                    items={items}
                    fieldName={key}
                    setFormData={setFormData}
                  />
                ))}

              <div className="select-form text-black dark:text-white">
                <p>Fecha Desde</p>
                <input
                  value={formData.fecha_inicial || ""}
                  className="w-full p-2 border bg-gray-50 dark:[color-scheme:dark] border-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:text-white"
                  type="date"
                  onChange={cambiarFechaDesde}
                ></input>
              </div>

              <div className="select-form text-black dark:text-white">
                <p>Fecha Hasta</p>
                <input
                  value={formData.fecha_final || ""}
                  className="w-full p-2 border bg-gray-50 dark:[color-scheme:dark] border-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:text-white"
                  type="date"
                  onChange={cambiarFechaHasta}
                ></input>
              </div>
              <div className="select-form text-black dark:text-white">
                <p>Fecha Exacta</p>
                <input
                  value={formData.fecha_exacta || ""}
                  className="w-full p-2 border bg-gray-50 dark:[color-scheme:dark] border-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 dark:text-white"
                  type="date"
                  onChange={cambiarFechaExacta}
                ></input>
              </div>
            </div>
          </div>
          <div className="p-4 my-4 flex flex-wrap justify-end gap-4 custom:justify-center">
            <div>
              <AsyncButton
                asyncFunction={obtenerResoluciones}
                isLoading={isLoading}
                name="Buscar"
                Icon={FaSearch}
              />
            </div>

            {/* <div>
              <AsyncButton
                asyncFunction={generarPdf}
                isLoading={isLoadingPDF}
                name="Generar Pdf"
                Icon={FaFilePdf}
              />
            </div> */}

            <button
              type="button"
              onClick={() => limpiarFiltros()}
              className="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 rounded-lg text-center  dark:focus:ring-blue-800"
            >
              <MdCleaningServices className="w-3.5 h-3.5 text-white me-2" />
              Limpiar
            </button>

            <button
              type="button"
              onClick={() => setActivo((prev) => !prev)}
              className="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 rounded-lg text-center  dark:focus:ring-blue-800"
            >
              <FaFilter className="w-3.5 h-3.5 text-white me-2" />
              {activo ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {resoluciones.length > 0 && (
          <>
            <PaginationData
              data={resoluciones}
              {...(texto.length > 2 ? { resumen: true } : {})}
              setFormData={setActualFormData}
            />

            <Paginate
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              actualPage={actualPage}
            ></Paginate>
          </>
        )}
      </div>
    </div>
  );
};

export default JurisprudenciaBusqueda;
