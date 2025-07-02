import { createContext, useState, useContext, useEffect } from "react";
import JurisprudenciaService from "../services/JurisprudenciaService";
import { useLocation } from "react-router-dom";

export const NodosContext = createContext();

export const NodosContextProvider = ({ children }) => {
  const [nodos, setNodos] = useState({});

  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (location.pathname === "/generacion-rapida" && !hasFetched) {
      obtenerData();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched]);

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
