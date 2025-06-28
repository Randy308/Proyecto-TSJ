import { createContext, useState, useContext, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";

export const HistoricContext = createContext();

export const HistoricContextProvider = ({ children }) => {
  const [historic, setHistoric] = useState({});
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
        setHistoric([]); // Evitar undefined en caso de error
      }
  };
  
  const valor = { historic, setHistoric };


  return (
    <HistoricContext.Provider value={valor}>{children}</HistoricContext.Provider>
  );
};

export function useHistoricContext() {
  const context = useContext(HistoricContext);
  if (!context) {
    throw new Error("useHistoricContext must be used within a HistoricProvider");
  }
  return context;
}
