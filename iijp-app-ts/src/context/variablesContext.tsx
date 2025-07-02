import { createContext, useState, useContext, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";
import type { ContextProviderProps, Variable } from "../types";

interface ValueContextType {
  data: Variable | undefined;
  setData: React.Dispatch<React.SetStateAction<Variable| undefined>>;
}

export const VariablesContext = createContext<ValueContextType | undefined>(
  undefined
);

export const VariablesContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [data, setData] = useState<Variable | undefined>({} as Variable);
  useEffect(() => {
    obtenerVariables();
  }, []);

  const obtenerVariables = async () => {
    try {
      const { data } = await ResolucionesService.obtenerVariables();
      if (data) {
        setData(data);
        console.log("Data obtenida:", typeof data);
      } else {
        setData({} as Variable);
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setData({} as Variable);
    }
  };

  const valor = { data, setData };

  return (
    <VariablesContext.Provider value={valor}>
      {children}
    </VariablesContext.Provider>
  );
};

export function useVariablesContext() {
  const context = useContext(VariablesContext);
  if (!context) {
    throw new Error(
      "useVariablesContext must be used within a VariableProvider"
    );
  }
  return context;
}
