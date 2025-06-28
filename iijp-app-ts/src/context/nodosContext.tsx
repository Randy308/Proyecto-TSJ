import { createContext, useState, useContext, useEffect } from "react";
import JurisprudenciaService from "../services/JurisprudenciaService";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps, Nodos } from "../types";


interface NodosContextType {
  nodos: Nodos[] | undefined;
  setNodos: React.Dispatch<React.SetStateAction<Nodos[] | undefined>>;
}


export const NodosContext = createContext<NodosContextType | undefined>(undefined);


export const NodosContextProvider = ({ children }: ContextProviderProps) => {
  const [nodos, setNodos] = useState<Nodos[] | undefined>(undefined);

  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (location.pathname === "/generacion-rapida" && !hasFetched) {
      obtenerData();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched]);

  const obtenerData = async (): Promise<void> => {
    try {
      const { data } = await JurisprudenciaService.obtenerNodos();
      if (data) {
        setNodos(data);
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setNodos([]); 
    }
  };

  const valor: NodosContextType = { nodos, setNodos };

  return (
    <NodosContext.Provider value={valor}>
      {children}
    </NodosContext.Provider>
  );
};

// 4. Hook personalizado para consumir el contexto
export function useNodosContext(): NodosContextType {
  const context = useContext(NodosContext);
  if (!context) {
    throw new Error("useNodosContext must be used within a NodosContextProvider");
  }
  return context;
}
