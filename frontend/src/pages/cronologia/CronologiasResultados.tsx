import { useEffect, useState } from "react";
import { useCronologiaContext } from "../../context/cronologiaContext";
import { FaDownload } from "react-icons/fa";
import { MdOutlineZoomInMap } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsFillDatabaseFill } from "react-icons/bs";

const CronologiasResultados = () => {
  const { pdfBlob, descargarBaseDatos, selectedIds } = useCronologiaContext();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const navigate = useNavigate();

  const generateFilename = () => {
    const now = new Date();
    return `cronojurídica_${
      now.toISOString().replace(/T/, "_").replace(/:/g, "-").split(".")[0]
    }.pdf`;
  };

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } else {
      navigate(-1);
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfBlob]);

  useEffect(() => {
    const handleBeforeUnload = (event: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      // Customize your message or logic here
      const message =
        "Estás a punto de salir de la página. Los cambios no guardados se perderán.";
      event.preventDefault(); // Standard for browser compatibility
      event.returnValue = message; // For older browsers
      return message; // For newer browsers
    };

    // Add the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center ${
        zoom ? "absolute top-0 left-0 w-full bg-gray-800 z-50" : "pt-4"
      }`}
    >
      {pdfUrl ? (
        <div className="flex flex-col gap-1">
          {/* Toolbar */}
          <div className="py-2 ps-2 flex gap-2 items-center">
            <a
              href={pdfUrl}
              download={generateFilename()}
              title="Descargar PDF"
              className="p-2 bg-gray-600 rounded-lg text-white"
            >
              <FaDownload />
            </a>
            <button
              className="p-2 bg-gray-600 rounded-lg text-white"
              type="button"
              title="Alternar Zoom"
              onClick={() => setZoom(!zoom)}
            >
              <MdOutlineZoomInMap />
            </button>
          </div>

          {/* PDF Viewer usando iframe */}
          <div className="flex flex-row flex-wrap items-start">
            <iframe
              src={pdfUrl}
              className={`border-2 border-gray-300 ${
                zoom ? "w-[99dvw] h-screen" : "w-screen md:w-[70dvw] h-[100dvh]"
              }`}
              title="PDF Viewer"
            />
            <div
              className={` ${
                zoom ? "hidden" : "flex flex-col ms-2 gap-2 w-auto md:w-64"
              }`}
            >
              <p className="titulo text-xl">Descargas</p>
              <a
                type="button"
                href={pdfUrl}
                download={generateFilename()}
                className="p-2 flex items-center justify-center gap-4 bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 hover:dark:bg-gray-600 dark:text-gray-100 rounded-lg text-gray-700"
              >
                <FaDownload />
                <span>Cronojuridica</span>
              </a>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={descargarBaseDatos}
                  className="p-2 flex items-center justify-center gap-4 bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 hover:dark:bg-gray-600 dark:text-gray-100 rounded-lg text-gray-700"
                >
                  <BsFillDatabaseFill />
                  <span> Base de datos</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Cargando PDF...</p>
      )}
    </div>
  );
};

export default CronologiasResultados;
