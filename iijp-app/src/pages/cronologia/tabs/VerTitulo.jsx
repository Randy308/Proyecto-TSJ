import { useLocalStorage } from "../../../hooks/useLocalStorage";
import React, { useEffect } from "react";

const VerTitulo = ({ titulo, estiloDefault, contenido, setTituloActual }) => {
  const [estilo, setEstilo] = useLocalStorage(titulo, estiloDefault);

  return (
    <div
      style={estilo}
      className="border border-b-gray-500 border-dashed cursor-pointer"
      onClick={() => setTituloActual(titulo)}
    >
      {contenido}
    </div>
  );
};

export default VerTitulo;
