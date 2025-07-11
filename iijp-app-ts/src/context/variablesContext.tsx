import { createContext, useContext } from "react";
import type { Variable } from "../types";

export interface VariableContextType {
  data: Variable | undefined;
  setData: React.Dispatch<React.SetStateAction<Variable| undefined>>;
}

export const VariablesContext = createContext<VariableContextType | undefined>(
  undefined
);


export function useVariablesContext() {
  const context = useContext(VariablesContext);
  if (!context) {
    throw new Error(
      "useVariablesContext must be used within a VariableProvider"
    );
  }
  return context;
}
