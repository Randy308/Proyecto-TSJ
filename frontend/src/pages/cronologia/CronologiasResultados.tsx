import { useEffect, useState } from "react";
import { useCronologiaContext } from "../../context/cronologiaContext";
import { FaDownload } from "react-icons/fa";
import { MdOutlineZoomInMap } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CronologiasResultados = () => {
  const { pdfBlob } = useCronologiaContext();
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
    const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string; }) => {
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
      className={`flex pt-4 flex-col items-center ${
        zoom ? "absolute top-0 left-0 w-full bg-gray-800 z-50" : ""
      }`}
    >
      {pdfUrl ? (
        <div className="flex flex-col gap-1">
          {/* Toolbar */}
          <div className="py-2 ps-2 flex gap-4 items-center">
            <a
              href={pdfUrl}
              download={generateFilename()}
              title="Descargar PDF"
              className="p-4 bg-gray-600 rounded-lg text-white"
            >
              <FaDownload />
            </a>
            <button
              className="p-4 bg-gray-600 rounded-lg text-white"
              type="button"
              title="Alternar Zoom"
              onClick={() => setZoom(!zoom)}
            >
              <MdOutlineZoomInMap />
            </button>
          </div>

          {/* PDF Viewer usando iframe */}
          <iframe
            src={pdfUrl}
            className={`border-2 border-gray-300 ${
              zoom ? "w-[95dvw] h-screen" : "w-[70dvw] h-[100dvh]"
            }`}
            title="PDF Viewer"
          />
        </div>
      ) : (
        <p>Cargando PDF...</p>
      )}
    </div>
  );
};

export default CronologiasResultados;
