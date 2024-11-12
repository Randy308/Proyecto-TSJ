import EChart from "../../../pages/analisis/EChart";
import React from "react";

const Mapa = ({ contenido }) => {
  return (
    <div className=" h-[600px] border border-gray-300 p-4 m-4 rounded-xl shadow-lg bg-white dark:bg-[#100C2A]">
      <EChart contenido={contenido} />
    </div>
  );
};

export default Mapa;
