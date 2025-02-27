import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { IoMdArrowDropdown } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
import styles from "./ResolucionTSJ.module.css";
import ResolucionesService from "../../services/ResolucionesService";
const ResolucionTSJ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resolucion, setResolucion] = useState(null);
  const [fichas, setFichas] = useState(null);

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
  const [subMenu, setSubMenu] = useState(false);

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

  return (
    <div className="bg-[#333333]">
      <div className="grid grid-cols-3 custom:grid-cols-1">
        <div className="bg-[#F0F0F0] m-4 col-auto" ref={sidebarRef}>
          <div className="p-4 text-center bg-[#561427] text-white ">
            <p className="flex flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/busqueda")}
                className="hover:text-gray-400"
              >
                <TiArrowBack className="text-3xl" />
              </button>
              Análisis Documental
            </p>
          </div>
          <div>
            <div
              className="bg-white rounded-lg p-4 m-4 flex flex-row justify-between hover:cursor-pointer"
              onClick={() => cambiarEstado(2)}
            >
              <p className="titulo uppercase font-bold">Datos generales</p>
              <IoMdArrowDropdown className="text-2xl" />
            </div>

            {visible === 2 && (
              <div className="border border-gray-200 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]">
                {resolucion.nro_resolucion && (
                  <p>
                    <strong>Nro de Resolucion:</strong>{" "}
                    {resolucion.nro_resolucion}
                  </p>
                )}
                {resolucion.nro_expediente && (
                  <p>
                    <strong>Nro de Expediente:</strong>{" "}
                    {resolucion.nro_expediente}
                  </p>
                )}
                {resolucion.fecha_emision && (
                  <p>
                    <strong>Fecha de Emision:</strong>{" "}
                    {resolucion.fecha_emision}
                  </p>
                )}
                {resolucion.tipo_resolucion && (
                  <p>
                    <strong>Tipo de Resolucion:</strong>{" "}
                    {resolucion.tipo_resolucion}
                  </p>
                )}
                {resolucion.departamento && (
                  <p>
                    <strong>Departamento:</strong> {resolucion.departamento}
                  </p>
                )}
                {resolucion.magistrado && (
                  <p>
                    <strong>Magistrado:</strong> {resolucion.magistrado}
                  </p>
                )}
                {resolucion.forma_resolucion && (
                  <p>
                    <strong>Forma de Resolucion:</strong>{" "}
                    {resolucion.forma_resolucion}
                  </p>
                )}
                {resolucion.proceso && (
                  <p>
                    <strong>Proceso:</strong> {resolucion.proceso}
                  </p>
                )}
                {resolucion.demandante && (
                  <p>
                    <strong>Demandante:</strong> {resolucion.demandante}
                  </p>
                )}
                {resolucion.demandado && (
                  <p>
                    <strong>Demandado:</strong> {resolucion.demandado}
                  </p>
                )}
                {resolucion.sintesis && (
                  <p>
                    <strong>Síntesis:</strong> {resolucion.sintesis}
                  </p>
                )}
                {resolucion.maxima && (
                  <p>
                    <strong>Maxima:</strong> {resolucion.maxima}
                  </p>
                )}
              </div>
            )}
          </div>
          {fichas &&
            (fichas.length > 0) &&
            (
              <div>
                <div
                  className="bg-white rounded-lg p-4 m-4 flex flex-row justify-between hover:cursor-pointer"
                  onClick={() => cambiarEstado(3)}
                >
                  <p className="titulo uppercase font-bold">
                    Fichas Jurisprudenciales
                  </p>
                  <IoMdArrowDropdown className="text-2xl" />
                </div>

                {visible === 3 && (
                  <div className="m-4">
                    {fichas.map((item, index) => (
                      <div key={index}>
                        {/* Título del dropdown */}
                        <div
                          className="bg-red-octopus-50 rounded-lg p-4 m-4 flex flex-row justify-start gap-4 hover:cursor-pointer"
                          onClick={() => cambiarSubMenu(index)}
                        >
                          <IoMdArrowDropdown className="text-2xl" />
                          <p>Ficha Jurisprudencial</p>
                          <p className="text-white rounded-full bg-red-octopus-900 px-2">
                            {index + 1}
                          </p>
                        </div>

                        {subMenu === index && (
                          <div className="border border-gray-200 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]">
                            {item.descriptor && (
                              <p className="text-justify text-sm">
                                <strong>Descriptor:</strong> {item.descriptor}
                              </p>
                            )}
                            {item.restrictor && (
                              <p className="text-justify text-sm">
                                <strong>Restrictor:</strong> {item.restrictor}
                              </p>
                            )}
                            {item.tipo_jurisprudencia && (
                              <p className="text-justify text-sm">
                                <strong>Tipo Jurisprudencia:</strong>{" "}
                                {item.tipo_jurisprudencia}
                              </p>
                            )}
                            {item.ratio && (
                              <p className="text-justify text-sm">
                                <strong>Ratio:</strong> {item.ratio}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
        <div className="col-span-2 h-full">
          <div
            style={{ height: height }}
            ref={docRef}
            className="bg-white p-4 m-5 rounded-lg  overflow-y-scroll"
          >
            {resolucion.contenido.split("\r\n").map((line, index) =>
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
        </div>
      </div>
    </div>
  );
};

export default ResolucionTSJ;
