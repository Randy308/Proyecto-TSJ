import { createContext, useState, useContext, useEffect } from "react";
import type { ContextProviderProps } from "../types";

interface ValueContextType {
  multiVariable: boolean;
  setMultiVariable: React.Dispatch<React.SetStateAction<boolean>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  nombre: string;
  setNombre: React.Dispatch<React.SetStateAction<string>>;
}

export const AnalisisContext = createContext<ValueContextType | undefined>(
  undefined
);

export const AnalisisContextProvider = ({ children }: ContextProviderProps) => {
  // const [analisis, setAnalisis] = useState({});
  // const [serie , setSerie] = useState([]);
  // const [mapa, setMapa] = useState([]);
  const [multiVariable, setMultiVariable] = useState(false);
  const [total, setTotal] = useState(0);
  const [nombre, setNombre] = useState("");

  const valor: ValueContextType = {
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

export function useAnalisisContext(): ValueContextType {
  const context = useContext(AnalisisContext);
  if (!context) {
    throw new Error(
      "useAnalisisContext must be used within a AnalisisProvider"
    );
  }
  return context;
}
