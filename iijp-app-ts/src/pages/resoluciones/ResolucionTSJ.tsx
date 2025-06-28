import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { IoMdArrowDropdown } from "react-icons/io";
import styles from "./ResolucionTSJ.module.css";
import ResolucionesService from "../../services/ResolucionesService";
import { titulo } from "../../utils/filterForm";
const ResolucionTSJ = ({ id }) => {
  const navigate = useNavigate();
  const [resolucion, setResolucion] = useState(null);
  const [fichas, setFichas] = useState(null);
  const [actual, setActual] = useState(2);
  const docRef = useRef(null);
  const sidebarRef = useRef(null);
  const [height, setHeight] = useState("100dvh");

  useEffect(() => {
    const getResolution = async () => {
      ResolucionesService.obtenerResolucion(id)
        .then(({ data }) => {
          setResolucion(data.resolucion);
          setFichas(data.jurisprudencias);
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
        });
    };
    getResolution();
  }, [id]);

  const [visible, setVisible] = useState(false);
  const [subMenu, setSubMenu] = useState(0);

  const cambiarEstado = (id) => {
    setVisible((prev) => (prev === id ? null : id));
  };

  const cambiarSubMenu = (id) => {
    setSubMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const adjustHeight = () => {
      if (subMenu === null) {
        setHeight("100dvh");
      } else if (docRef.current && sidebarRef.current) {
        const sidebarHeight = sidebarRef.current.offsetHeight;
        setHeight(`${Math.max(window.innerHeight, sidebarHeight)}px`);
      }
    };

    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [subMenu]);

  if (resolucion === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  const renderContent = (id) => {
    switch (id) {
      case 2:
        return (
          <table className="flex-1 m-8 table-auto text-left border border-collapse text-black dark:text-gray-200">
            <tbody>
              {Object.keys(resolucion).map(
                (key) =>
                  key != "contenido" &&
                  resolucion[key] && (
                    <tr
                      className="border-2 border-gray-200 dark:border-gray-700"
                      key={key}
                    >
                      <td
                        className="text-sm font-bold p-3 border-r-2 border-gray-200 dark:border-gray-700"
                        scope="row"
                      >
                        {titulo(key)}
                      </td>
                      <td className="col-span-2 text-sm text-justify p-3">
                        {resolucion[key]}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        );
      case 3:
        return (
          <div className="flex-1">
            {fichas.map((item, index) => (
              <div key={index}>
                {/* Título del dropdown */}
                <div
                  className="bg-red-octopus-50 rounded-lg p-4 m-4 flex flex-row justify-start gap-4 hover:cursor-pointer"
                  onClick={() => cambiarSubMenu(index)}
                >
                  <IoMdArrowDropdown className="text-2xl" />
                  <p>Ficha Jurisprudencial</p>
                  <p className="text-white flex items-center rounded-full bg-red-octopus-900 px-2">
                    {index + 1}
                  </p>
                </div>

                {subMenu === index && (
                  
                    <table className="table-auto m-4 text-left border border-collapse text-black dark:text-gray-200">
                      <tbody>
                        {Object.keys(item).map(
                          (key) =>
                            key != "contenido" &&
                            item[key] && (
                              <tr
                                className="mt-4 border-2 border-gray-200 dark:border-gray-700"
                                key={key}
                              >
                                <td
                                  className="text-sm font-bold px-6 py-3 border-r-2 border-gray-200 dark:border-gray-700"
                                  scope="row"
                                >
                                  {titulo(key)}
                                </td>
                                <td className="col-span-2 text-sm text-justify px-6 py-3">
                                  {item[key]}
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  
                )}
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div ref={docRef} className="bg-white p-4 m-5 rounded-lg">
            {resolucion.contenido.split("\r").map((line, index) =>
              line === line.toUpperCase() ? (
                <div className={`${styles.tinosBold} text-center`} key={index}>
                  {line}
                </div>
              ) : (
                <div key={index} className={styles.tinosRegular}>
                  {line}
                </div>
              )
            )}
          </div>
        );
      default:
        return "";
    }
  };
  return (
    <div className="flex flex-col h-[80vh]">
      <div className="col-auto" ref={sidebarRef}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-black dark:text-white">
          <label
            htmlFor="datosGenerales"
            className={`flex p-4 items-center hover:cursor-pointer ${
              actual === 2
                ? "bg-red-octopus-700 text-white dark:bg-blue-600"
                : ""
            }`}
          >
            <input
              id="datosGenerales"
              type="radio"
              className="appearance-none hidden"
              checked={actual === 2}
              onChange={() => setActual(2)}
            />
            <span className="titulo uppercase font-bold text-center w-full">
              Datos Generales
            </span>
          </label>
          {fichas && fichas.length > 0 && (
            <label
              htmlFor="jurisprudencia"
              className={`flex p-4 items-center hover:cursor-pointer ${
                actual === 3
                  ? "bg-red-octopus-700 text-white dark:bg-blue-600"
                  : ""
              }`}
            >
              <input
                id="jurisprudencia"
                type="radio"
                className="appearance-none hidden"
                checked={actual === 3}
                onChange={() => setActual(3)}
              />
              <span className="titulo uppercase font-bold text-center w-full">
                Fichas Jurisprudenciales
              </span>
            </label>
          )}
          <label
            htmlFor="contenido"
            className={`flex p-4 items-center hover:cursor-pointer ${
              actual === 4
                ? "bg-red-octopus-700 text-white dark:bg-blue-600"
                : ""
            }`}
          >
            <input
              id="contenido"
              type="radio"
              className="appearance-none hidden"
              checked={actual === 4}
              onChange={() => setActual(4)}
            />
            <span className="titulo uppercase font-bold text-center w-full">
              Contenido
            </span>
          </label>
        </div>
      </div>
      <div className="mb-2 flex-1 overflow-y-scroll flex justify-center">{renderContent(actual)}</div>
    </div>
  );
};

export default ResolucionTSJ;
