import { useState, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";
import type { ContextProviderProps, Historic } from "../types";
import { HistoricContext, type ValueContextType } from "../context/historicContext";


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
