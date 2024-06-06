import React from "react";

import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

const JurisprudenciaCronologia = () => {
  return (
    <div className="flex items-center justify-center">
      <PDFViewer
        className="pdf-container p-4 m-4"
        style={{
          height: "100vh",
          width: "100vh",
        }}
      >
        <MyDocument />
      </PDFViewer>
    </div>
  );
};
export default JurisprudenciaCronologia;
