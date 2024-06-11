import React from "react";

import { useLocation } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

const CronologiasResultados = () => {
  const location = useLocation();
  const { data } = location.state || [];
  return (
    <div className="flex items-center justify-center">
      <PDFViewer
        className="pdf-container p-4 m-4"
        style={{
          height: "100vh",
          width: "100vh",
        }}
      >
        <MyDocument data={data}/>
      </PDFViewer>
    </div>);
};

export default CronologiasResultados;
