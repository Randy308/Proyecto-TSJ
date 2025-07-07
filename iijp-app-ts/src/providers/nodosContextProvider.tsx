import { useState, useEffect } from "react";
import JurisprudenciaService from "../services/JurisprudenciaService";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps, Nodos } from "../types";
import { NodosContext, type NodosContextType } from "../context";

export const NodosContextProvider = ({ children }: ContextProviderProps) => {
  const [nodos, setNodos] = useState<Nodos[] | undefined>(undefined);
  const [hasFetched, setHasFetched] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/generacion-rapida" && !hasFetched) {
      obtenerData();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched]);

  const obtenerData = async (): Promise<void> => {
    try {
      const { data } = await JurisprudenciaService.obtenerNodos();
      if (data) setNodos(data);
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
