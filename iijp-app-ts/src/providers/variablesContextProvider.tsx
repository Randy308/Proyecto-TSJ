import { useState, useEffect } from "react";
import ResolucionesService from "../services/ResolucionesService";
import type { ContextProviderProps, Variable } from "../types";
import { VariablesContext } from "../context";

interface ValueContextType {
  data: Variable | undefined;
  setData: React.Dispatch<React.SetStateAction<Variable| undefined>>;
}


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

  const valor: ValueContextType = { data, setData };

  return (
    <VariablesContext.Provider value={valor}>
      {children}
    </VariablesContext.Provider>
  );
};

