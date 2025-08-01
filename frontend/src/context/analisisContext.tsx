import { createContext, useContext } from "react";
import type { AnalisisContextType } from "../providers";

export const AnalisisContext = createContext<AnalisisContextType | undefined>(
  undefined
);

export function useAnalisisContext(): AnalisisContextType {
  const context = useContext(AnalisisContext);
  if (!context) {
    throw new Error(
      "useAnalisisContext must be used within a AnalisisProvider"
    );
  }
  return context;
}
