import { useState } from "react";
import type { ContextProviderProps } from "../types";
import { AnalisisContext, type AnalisisContextType } from "../context";

export const AnalisisContextProvider = ({ children }: ContextProviderProps) => {
  // const [analisis, setAnalisis] = useState({});
  // const [serie , setSerie] = useState([]);
  // const [mapa, setMapa] = useState([]);
  const [multiVariable, setMultiVariable] = useState(false);
  const [total, setTotal] = useState(0);
  const [nombre, setNombre] = useState("");

  const valor: AnalisisContextType = {
    // analisis,
    // setAnalisis,
    // serie,
    // setSerie,
    // mapa,
    // setMapa,
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

