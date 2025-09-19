import { createContext, useContext } from "react";
import type { CronologiaContextType } from "../providers";

export const CronologiaContext = createContext<CronologiaContextType | undefined>(
  undefined
);

export function useCronologiaContext(): CronologiaContextType {
  const context = useContext(CronologiaContext);
  if (!context) {
    throw new Error(
      "useAnalisisContext must be used within a AnalisisProvider"
    );
  }
  return context;
}
