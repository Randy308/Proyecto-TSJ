import { createContext, useState, useContext, useEffect } from "react";
import JurisprudenciaService from "../services/JurisprudenciaService";

export const NodosContext = createContext();

export const NodosContextProvider = ({ children }) => {
  const [nodos, setNodos] = useState({});
    useEffect(() => {
      obtenerData();
    }, []);

    const obtenerData = async () => {
      try {
        const { data } = await JurisprudenciaService.obtenerNodos();
        if (data) {
          setNodos(data);
        } 
      } catch (err) {
        console.error("Existe un error:", err);
        setNodos([]); // Evitar undefined en caso de error
      }
  };
  
  const valor = { nodos, setNodos };


  return (
    <NodosContext.Provider value={valor}>{children}</NodosContext.Provider>
  );
};

export function useNodosContext() {
  const context = useContext(NodosContext);
  if (!context) {
    throw new Error("useNodosContext must be used within a NodosProvider");
  }
  return context;
}
