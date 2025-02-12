import { createContext, useState, useContext } from "react";

export const MagistradoContext = createContext();

export const MagistradoContextProvider = ({ children }) => {

  const magistradoObj = {
    id: 0,
    nombre: "",
    fecha_minima: "",
    fecha_maxima: "",
    formas: {},
    salas:{},
    series_temporales:{},
    departamentos:{},
    parametros:{},
    estadisticas:{},
  };

  const [magistrado, setMagistrado] = useState(magistradoObj);
  const valor = { magistrado, setMagistrado };

  return (
    <MagistradoContext.Provider value={valor}>{children}</MagistradoContext.Provider>
  );
};

export function useMagistradoContext() {
  const context = useContext(MagistradoContext);
  if (!context) {
    throw new Error("useMagistradoContext must be used within a MagistradoProvider");
  }
  return context;
}
