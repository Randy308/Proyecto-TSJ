import { createContext, useState, useContext, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";
import type { ContextProviderProps, Historic } from "../types";

interface ValueContextType {
  historic: Historic | null;
  setHistoric: React.Dispatch<React.SetStateAction<Historic | null>>;
}

export const HistoricContext = createContext<ValueContextType | undefined>(
  undefined
);

export const HistoricContextProvider = ({ children }: ContextProviderProps) => {
  const [historic, setHistoric] = useState<Historic | null>(null);
  useEffect(() => {
    obtenerData();
  }, []);

  const obtenerData = async () => {
    try {
      const { data } = await ResolucionesService.getStats();
      if (data) {
        setHistoric(data);
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setHistoric(null); 
    }
  };

  const valor: ValueContextType = { historic, setHistoric };

  return (
    <HistoricContext.Provider value={valor}>
      {children}
    </HistoricContext.Provider>
  );
};

export function useHistoricContext(): ValueContextType {
  const context = useContext(HistoricContext);
  if (!context) {
    throw new Error(
      "useHistoricContext must be used within a HistoricProvider"
    );
  }
  return context;
}
