import { createContext, useState, useContext, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";

export const AnalisisContext = createContext();

export const AnalisisContextProvider = ({ children }) => {
  const [analisis, setAnalisis] = useState({});
  const [serie , setSerie] = useState([]);
  const [mapa, setMapa] = useState([]);
  const [multiVariable, setMultiVariable] = useState(false);
  const [total, setTotal] = useState(0);
  const [nombre, setNombre] = useState("");

  const valor = {
    analisis,
    setAnalisis,
    serie,
    setSerie,
    mapa,
    setMapa,
    multiVariable,
    setMultiVariable,
    total,
    setTotal,
    nombre,
    setNombre,
  };

  return (
    <AnalisisContext.Provider value={valor}>
      {children}
    </AnalisisContext.Provider>
  );
};

export function useAnalisisContext() {
  const context = useContext(AnalisisContext);
  if (!context) {
    throw new Error(
      "useAnalisisContext must be used within a AnalisisProvider"
    );
  }
  return context;
}
