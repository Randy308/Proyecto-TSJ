import { createContext, useContext } from "react";

export interface ValueContextType {
  multiVariable: boolean;
  setMultiVariable: React.Dispatch<React.SetStateAction<boolean>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  nombre: string;
  setNombre: React.Dispatch<React.SetStateAction<string>>;
}



export const AnalisisContext = createContext<ValueContextType | undefined>(
  undefined
);


export function useAnalisisContext(): ValueContextType {
  const context = useContext(AnalisisContext);
  if (!context) {
    throw new Error(
      "useAnalisisContext must be used within a AnalisisProvider"
    );
  }
  return context;
}
