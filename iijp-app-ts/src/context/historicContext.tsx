import { createContext, useContext } from "react";
import type { Historic } from "../types";

export interface ValueContextType {
  historic: Historic | null;
  setHistoric: React.Dispatch<React.SetStateAction<Historic | null>>;
}

export const HistoricContext = createContext<ValueContextType | undefined>(
  undefined
);


export function useHistoricContext(): ValueContextType {
  const context = useContext(HistoricContext);
  if (!context) {
    throw new Error(
      "useHistoricContext must be used within a HistoricProvider"
    );
  }
  return context;
}
