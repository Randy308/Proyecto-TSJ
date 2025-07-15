import { createContext, useContext } from "react";
import type { Historic } from "../types";

export interface HistoricContextType {
  historic: Historic | null;
  setHistoric: React.Dispatch<React.SetStateAction<Historic | null>>;
}

export const HistoricContext = createContext<HistoricContextType | undefined>(
  undefined
);


export function useHistoricContext(): HistoricContextType {
  const context = useContext(HistoricContext);
  if (!context) {
    throw new Error(
      "useHistoricContext must be used within a HistoricProvider"
    );
  }
  return context;
}
