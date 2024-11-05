import React, { useEffect, useState } from "react";
import EstiloTitulos from "./EstiloTitulos";
import { headingItems } from "../../../data/HeadingItems.js";
import { useLocalStorage } from "../../../components/useLocalStorage";
const Tipografia = () => {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <div className="previsualizacion">
        <button onClick={() => setPreview((prev) => !prev)} className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg p-2">
          {preview ? "Mostrar edicion del contenido" : "Mostrar previsualizacion"}
        </button>
      </div>
      {headingItems.map((item, index) => (
        <EstiloTitulos
          key={index}
          titulo={item.titulo}
          isPreview={preview}
          estiloDefault={item.estiloDefault}
        />
      ))}
    </div>
  );
};

export default Tipografia;
