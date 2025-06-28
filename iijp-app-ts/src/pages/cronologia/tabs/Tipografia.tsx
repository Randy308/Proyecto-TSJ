import React, { useEffect, useState } from "react";
import { headingItems } from "../../../data/HeadingItems.js";
import EstiloTitulos from "./EstiloTitulos.js";

const Tipografia = () => {
  const [tituloActual, setTituloActual] = useState("");
  const [estiloDefault, setEstiloDefault] = useState(null);

  const [preview, setPreview] = useState(true);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const item = headingItems.find((item) => item.titulo === tituloActual);
    if (item) {
      setEstiloDefault(item);
    }
  }, [tituloActual]);

  return (
    <div>
      <div className="previsualizacion">
        <button
          onClick={() => setPreview((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg p-2"
        >
          {preview
            ? "Mostrar edición del contenido"
            : "Mostrar previsualización"}
        </button>
      </div>

      <div
        className={` ${
          preview
            ? "bg-white flex p-8 m-4 flex-col justify-center w-[612px] h-[792px] box-border shadow-md mx-auto"
            : " "
        }  `}
      >
        <div>
          {headingItems.map((item, index) => (
            <EstiloTitulos
              key={index}
              id={index}
              setVisible={setVisible}
              visible={visible}
              titulo={item.titulo}
              contenido={item.contenido}
              isPreview={preview}
              estiloDefault={item.estiloDefault}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tipografia;
