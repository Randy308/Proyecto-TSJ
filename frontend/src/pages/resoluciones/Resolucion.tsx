import { useEffect, useState, useMemo } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { ResolucionesService } from "../../services";
import { titulo } from "../../utils/filterForm";
import type { Jurisprudencia, Resolucion } from "../../types";
import { useNavigate, useParams } from "react-router-dom";

import { IoArrowBackSharp } from "react-icons/io5";
import { CiLink } from "react-icons/ci";
import Modal from "../../components/modal/Modal";

const Resolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resolucion, setResolucion] = useState<Resolucion>({} as Resolucion);
  const [bloques, setBloques] = useState<string[]>([]);
  const [titulos, setTitulos] = useState<string[]>([]);
  const [fichas, setFichas] = useState<Jurisprudencia[]>([]);
  const [options, setOptions] = useState(false);
  const [subMenu, setSubMenu] = useState<number | null>(null);

  const [modalDatos, setModalDatos] = useState(false);
  const [modalJuris, setModalJuris] = useState(false);

  const cambiarSubMenu = (id: number) =>
    setSubMenu((prev) => (prev === id ? null : id));

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://samed-tsj.umss.edu.bo/cronojuridicas/resolucion/${id}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const downloadTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([resolucion.contenido || ""], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `resolucion_${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const normalizeText = (str: string) => {
    return (
      str
        // colapsar secuencias repetidas (\s\s\s → \s, \n\n → \n, etc.)
        .replace(/(\\[rnts])+/g, (match) => match.slice(0, 2))
        // convertir escapes en caracteres reales
        .replace(/\\r/g, "\r")
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, " ") // tab = 4 espacios
        .replace(/\\s/g, " ")
    ); // espacio simple
  };

  // Memoizamos el documento para evitar remounts innecesarios
  const MyDocument = useMemo(
    () => (
      <div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <img src="/tsj.png" className="w-auto h-24" />
          </div>
          {bloques.map((line, index) => (
            <div key={index}>
              <div className="font-bold text-xl">{titulos[index]}</div>
              {normalizeText(line)
                .split("\r")
                .map((part, idx) => (
                  <div className="text-justify p-4" key={idx}>{part.replace(/\s+/g, " ").trim()}</div>
                ))}
            </div>
          ))}
        </div>
      </div>
    ),
    [bloques, titulos]
  );

  const renderDatosGenerales = () => (
    <table className="flex-1 m-8 table-auto text-left border border-collapse text-black dark:text-gray-200">
      <tbody>
        {Object.entries(resolucion).map(
          ([key, value]) =>
            !["contenido", "id"].includes(key) &&
            value && (
              <tr
                key={key}
                className="border-2 border-gray-200 dark:border-gray-700"
              >
                <td className="text-sm font-bold p-3 border-r-2 border-gray-200 dark:border-gray-700">
                  {titulo(key)}
                </td>
                <td className="col-span-2 text-sm text-justify p-3">{value}</td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );

  const renderJurisprudencia = () =>
    fichas.map((item, index) => (
      <div key={index}>
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
              {Object.entries(item).map(
                ([key, value]) =>
                  key !== "last" &&
                  value && (
                    <tr
                      key={key}
                      className="mt-4 border-2 border-gray-200 dark:border-gray-700"
                    >
                      <td className="text-sm font-bold px-6 py-3 border-r-2 border-gray-200 dark:border-gray-700">
                        {titulo(key)}
                      </td>
                      <td className="col-span-2 text-sm text-justify px-6 py-3">
                        {value}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </div>
    ));

  useEffect(() => {
    ResolucionesService.obtenerResolucion(Number(id))
      .then(({ data }) => {
        setResolucion(data.resolucion);
        setFichas(data.jurisprudencias);
        setBloques(data.bloques);
        setTitulos(data.titulos);
      })
      .catch(() => {
        navigate("/");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 flex-wrap md:flex-nowrap md:overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full sm:w-64 flex flex-col justify-between bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <a
              href="/"
              className="p-4 flex items-center justify-center rounded-lg bg-gray-600 text-white w-full"
            >
              <IoArrowBackSharp />
              <span className="ms-2">Volver al Inicio</span>
            </a>

            <button
              onClick={() => setModalDatos(true)}
              className="p-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span className="uppercase font-bold block text-center">
                Datos Generales
              </span>
            </button>

            {fichas.length > 0 && (
              <button
                onClick={() => setModalJuris(true)}
                className="p-3 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <span className="uppercase font-bold block text-center">
                  Fichas Jurisprudenciales
                </span>
              </button>
            )}
          </div>

          {/* Descargas */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => setOptions((prev) => !prev)}
              className="p-4 flex items-center justify-between bg-white rounded-lg border-2 border-gray-200 text-gray-600 w-full"
            >
              Descargar <IoMdArrowDropdown />
            </button>
            {options && (
              <>
                <button
                  className="p-4 flex bg-white items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 w-full"
                  onClick={downloadTextFile}
                >
                  Texto
                </button>
              </>
            )}
            <button
              onClick={copyToClipboard}
              className="p-4 flex items-center justify-start bg-white rounded-lg border-2 border-gray-200 text-gray-600 w-full mt-2"
            >
              Copiar enlace <CiLink className="ps-2 h-7 w-7" />
            </button>
          </div>
        </aside>

        {/* Main Content (PDF) */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4">
          {MyDocument}
        </main>
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalDatos}
        title="Datos Generales"
        size="md"
        onClose={() => setModalDatos(false)}
      >
        {renderDatosGenerales()}
      </Modal>

      <Modal
        isOpen={modalJuris}
        title="Fichas Jurisprudenciales"
        size="xl"
        onClose={() => setModalJuris(false)}
      >
        {renderJurisprudencia()}
      </Modal>
    </div>
  );
};

export default Resolucion;
