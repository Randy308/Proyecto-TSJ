import React from "react";

import { useLocation } from "react-router-dom";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";
import DocumentoPDF from "./DocumentoPDF";

const CronologiasResultados = () => {
  //const location = useLocation();
  //const { data } = location.state || [];

  return (
    <div className="flex items-center justify-center">
      <PDFViewer
        className="pdf-container p-4 m-4"
        style={{
          height: "100vh",
          width: "100vh",
        }}
      >
        {/* <MyDocument data={data[0]}/> */}
        <DocumentoPDF />
      </PDFViewer>

      <div>
        <PDFDownloadLink
          className="p-4 m-4 bg-blue-600 rounded-lg text-white"
          style={{
            height: "100dvh",
            width: "100dvh",
          }}
          document={<DocumentoPDF />}
          fileName="somename.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Cargando el documento" : "Descargar documentos"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default CronologiasResultados;
