import { useEffect, useState, useMemo } from "react";
import Loading from "../../components/Loading";
import { IoMdArrowDropdown } from "react-icons/io";
import { ResolucionesService } from "../../services";
import { titulo } from "../../utils/filterForm";
import type { Jurisprudencia, Resolucion } from "../../types";
import { useParams } from "react-router-dom";
import {
  PDFDownloadLink,
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  Font,
  Image,
} from "@react-pdf/renderer";
import { IoArrowBackSharp } from "react-icons/io5";
import { CiLink } from "react-icons/ci";
import Modal from "../../components/modal/Modal";

const Resolucion = () => {
  const { id } = useParams();
  const [resolucion, setResolucion] = useState<Resolucion>({} as Resolucion);
  const [fichas, setFichas] = useState<Jurisprudencia[]>([]);
  const [options, setOptions] = useState(false);
  const [subMenu, setSubMenu] = useState<number | null>(null);

  const [modalDatos, setModalDatos] = useState(false);
  const [modalJuris, setModalJuris] = useState(false);

  const styles = StyleSheet.create({
    body: { paddingTop: 35, paddingBottom: 65, paddingHorizontal: 35 },
    subtitle: { fontSize: 18, margin: 12, fontFamily: "Oswald" },
    text: {
      margin: 10,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
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
    image: {
      marginVertical: 15,
      width: 350,
      marginHorizontal: 100,
    },
  });

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  useEffect(() => {
    ResolucionesService.obtenerResolucion(Number(id))
      .then(({ data }) => {
        setResolucion(data.resolucion);
        setFichas(data.jurisprudencias);
      })
      .catch(console.error);
  }, [id]);

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

  // Memoizamos el documento para evitar remounts innecesarios
  const MyDocument = useMemo(
    () => (
      <Document>
        <Page size="LETTER" style={styles.body}>
          <Image style={styles.image} src="/tsj.png" />
          {resolucion.contenido?.split("\r").map((line, index) =>
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
          />
        </Page>
      </Document>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolucion]
  );

  const renderDatosGenerales = () => (
    <table className="flex-1 m-8 table-auto text-left border border-collapse text-black dark:text-gray-200">
      <tbody>
        {Object.entries(resolucion).map(
          ([key, value]) =>
            key !== "contenido" &&
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

  if (!resolucion) return <Loading />;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
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
                <PDFDownloadLink
                  document={MyDocument}
                  fileName={`resolucion_${id}.pdf`}
                >
                  {({ loading }) => (
                    <button className="p-4 flex bg-white items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 w-full">
                      {loading ? "Generando PDF..." : "PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
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
          <PDFViewer className="w-full h-screen">{MyDocument}</PDFViewer>
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
