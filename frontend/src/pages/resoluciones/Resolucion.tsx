import { useEffect, useRef, useState } from "react";
import Loading from "../../components/Loading";
import { IoMdArrowDropdown } from "react-icons/io";
import { ResolucionesService } from "../../services";
import { titulo } from "../../utils/filterForm";
import type { Jurisprudencia, Resolucion } from "../../types";
import { useParams } from "react-router-dom";
import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const Resolucion = () => {
  const { id } = useParams();
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      width: "100%",
      height: "100%",
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: "Oswald",
    },
    text: {
      margin: 10,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "grey",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

  const [resolucion, setResolucion] = useState<Resolucion>({} as Resolucion);
  const [fichas, setFichas] = useState<Jurisprudencia[]>([]);
  const [actual, setActual] = useState(2);
  const docRef = useRef(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getResolution = async () => {
      ResolucionesService.obtenerResolucion(Number(id))
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

  const [subMenu, setSubMenu] = useState<number | null>(0);

  const cambiarSubMenu = (id: number) => {
    setSubMenu((prev) => (prev === id ? null : id));
  };

  if (resolucion === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  const renderContent = (id: number) => {
    switch (id) {
      case 2:
        return (
          <table className="flex-1 m-8 table-auto text-left border border-collapse text-black dark:text-gray-200">
            <tbody>
              {(Object.keys(resolucion) as (keyof Resolucion)[]).map(
                (key) =>
                  key !== "contenido" &&
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
            {fichas &&
              fichas.map((item, index) => (
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
                        {(Object.keys(item) as (keyof Jurisprudencia)[]).map(
                          (key) =>
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
        Font.register({
          family: "Oswald",
          src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
        });

        return (
          <div
            ref={docRef} style={{  height: "100dvh" }}
            className="bg-white p-4 m-5 rounded-lg"
          >
            <PDFViewer className="w-full h-full">
              <Document>
                <Page size="LETTER" style={styles.body}>
                  {resolucion.contenido &&
                    resolucion.contenido.split("\r").map((line, index) =>
                      line === line.toUpperCase() ? (
                        <View key={index} style={styles.subtitle}>
                          <Text>{line}</Text>
                        </View>
                      ) : (
                        <View key={index} style={styles.text}>
                          <Text>{line}</Text>
                        </View>
                      )
                    )}
                  <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) =>
                      `${pageNumber} / ${totalPages}`
                    }
                    fixed
                  />{" "}
                </Page>
              </Document>
            </PDFViewer>
          </div>
        );
      // <div ref={docRef} className="bg-white p-4 m-5 rounded-lg">

      // </div>

      default:
        return "";
    }
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Título y Descripción global */}
      <header className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Resolución del Tribunal Supremo de Justicia
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Explora los datos generales, las fichas jurisprudenciales relacionadas
          y el contenido completo de la resolución seleccionada.
        </p>
      </header>

      {/* Contenedor principal con Sidebar + Contenido */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className="w-full sm:w-64 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto"
        >
          <div className="flex flex-col gap-2 text-black dark:text-white">
            <label
              htmlFor="datosGenerales"
              className={`p-3 rounded-md cursor-pointer ${
                actual === 2
                  ? "bg-red-octopus-700 text-white dark:bg-blue-600"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <input
                id="datosGenerales"
                type="radio"
                className="appearance-none hidden"
                checked={actual === 2}
                onChange={() => setActual(2)}
              />
              <span className="uppercase font-bold block text-center">
                Datos Generales
              </span>
            </label>

            {fichas && fichas.length > 0 && (
              <label
                htmlFor="jurisprudencia"
                className={`p-3 rounded-md cursor-pointer ${
                  actual === 3
                    ? "bg-red-octopus-700 text-white dark:bg-blue-600"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <input
                  id="jurisprudencia"
                  type="radio"
                  className="appearance-none hidden"
                  checked={actual === 3}
                  onChange={() => setActual(3)}
                />
                <span className="uppercase font-bold block text-center">
                  Fichas Jurisprudenciales
                </span>
              </label>
            )}

            <label
              htmlFor="contenido"
              className={`p-3 rounded-md cursor-pointer ${
                actual === 4
                  ? "bg-red-octopus-700 text-white dark:bg-blue-600"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <input
                id="contenido"
                type="radio"
                className="appearance-none hidden"
                checked={actual === 4}
                onChange={() => setActual(4)}
              />
              <span className="uppercase font-bold block text-center">
                Contenido
              </span>
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          {renderContent(actual)}
        </main>
      </div>
    </div>
  );
};

export default Resolucion;
