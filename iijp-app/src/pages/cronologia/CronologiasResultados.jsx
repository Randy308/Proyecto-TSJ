import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CronologiasResultados = () => {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState(null);

  const generateFilename = () => {
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    return `cronología_jurídica_${formattedDate}.pdf`;
  };

  useEffect(() => {
    if (location.state?.pdfUrl) {
      setPdfUrl(location.state.pdfUrl);
    }

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [location.state, pdfUrl]);

  return (
    <div className="flex items-center justify-center">
      {pdfUrl ? (
        <div className="flex flex-row p-4 m-4">
          <iframe
            src={pdfUrl}
            title="PDF Document"
            style={{ width: "70dvw", height: "90dvh" }}
            frameBorder="0"
          />
          <div>
            <a
              href={pdfUrl}
              download={generateFilename()}
              className="p-4 m-4 bg-blue-600 rounded-lg text-white"
            >
              Descargar PDF
            </a>
          </div>
        </div>
      ) : (
        <p>Cargando PDF...</p>
      )}
    </div>
  );
};

export default CronologiasResultados;
