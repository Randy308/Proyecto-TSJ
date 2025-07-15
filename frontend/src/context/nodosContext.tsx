import { createContext, useContext } from "react";
import type { Nodos } from "../types";

export interface NodosContextType {
  nodos: Nodos[] | undefined;
  setNodos: React.Dispatch<React.SetStateAction<Nodos[] | undefined>>;
}

export const NodosContext = createContext<NodosContextType | undefined>(undefined);

// Hook personalizado
export function useNodosContext(): NodosContextType {
  const context = useContext(NodosContext);
  if (!context) {
    throw new Error("useNodosContext must be used within a NodosContextProvider");
  }
  return context;
}
