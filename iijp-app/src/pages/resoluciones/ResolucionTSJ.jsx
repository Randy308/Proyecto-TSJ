import React, { useEffect, useState } from "react";
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

  const cambiarEstado = (id) => {
    setVisible((prev) => (prev === id ? null : id));
  };

  const lista = ["Datos Generales"];

  if (resolucion === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-[#333333]">
      {
        <div className="flex flex-row-reverse justify-between">
          <div
            className="flex items-center justify-center"
            style={{ width: "100%" }}
          >
            <div
              style={{ width: 800, height: 900 }}
              className="bg-white p-4 m-5 rounded-lg  overflow-y-scroll"
            >
              {resolucion.contenido.split("\r\n").map((line, index) =>
                line === line.toUpperCase() ? (
                  <div
                    className={`${styles.tinosBold} text-center`}
                    key={index}
                  >
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
          <div className="bg-[#F0F0F0] m-4 " style={{ width: 500 }}>
            <div className="p-4 text-center bg-[#561427] text-white ">
              <p className="flex flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => navigate("/busqueda")}
                  className="hover:text-gray-400"
                >
                  {" "}
                  <TiArrowBack className="text-3xl" />
                </button>
                Analisis Documental{" "}
              </p>
            </div>
            <div key="667">
              {/* Título del dropdown */}
              <div
                className="bg-white rounded-lg p-4 m-4 flex flex-row justify-around hover:cursor-pointer"
                onClick={() => cambiarEstado(667)}
              >
                <p>Datos generales</p>
                <IoMdArrowDropdown className="text-2xl" />
              </div>

              {visible === 667 && (
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
            {fichas.map((item, index) => (
              <div key={index}>
                {/* Título del dropdown */}
                <div
                  className="bg-white rounded-lg p-4 m-4 flex flex-row justify-around hover:cursor-pointer"
                  onClick={() => cambiarEstado(index)}
                >
                  <p>Ficha Jurisprudencial #{index + 1}</p>
                  <IoMdArrowDropdown className="text-2xl" />
                </div>

                {/* Contenido del dropdown, visible solo si está activo */}
                {visible === index && (
                  <div className="border border-gray-200 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]">
                    {item.descriptor && (
                      <p>
                        <strong>Descriptor:</strong> {item.descriptor}
                      </p>
                    )}
                    {item.restrictor && (
                      <p>
                        <strong>Restrictor:</strong> {item.restrictor}
                      </p>
                    )}
                    {item.tipo_jurisprudencia && (
                      <p>
                        <strong>Tipo Jurisprudencia:</strong>{" "}
                        {item.tipo_jurisprudencia}
                      </p>
                    )}
                    {item.ratio && (
                      <p>
                        <strong>Ratio:</strong> {item.ratio}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default ResolucionTSJ;
