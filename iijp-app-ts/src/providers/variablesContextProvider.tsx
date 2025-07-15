import { useState, useEffect } from "react";
import {ResolucionesService} from "../services";
import type { ContextProviderProps, Facetas } from "../types";
import { VariablesContext } from "../context";

interface ValueContextType {
  data: Facetas | undefined;
  setData: React.Dispatch<React.SetStateAction<Facetas| undefined>>;
}


export const VariablesContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [data, setData] = useState<Facetas | undefined>({} as Facetas);
  useEffect(() => {
    obtenerVariables();
  }, []);

  const obtenerVariables = async () => {
    try {
      const { data } = await ResolucionesService.obtenerVariables();
      if (data) {
        setData(data);
      } else {
        setData({} as Facetas);
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setData({} as Facetas);
    }
  };

  const valor: ValueContextType = { data, setData };

  return (
    <VariablesContext.Provider value={valor}>
      {children}
    </VariablesContext.Provider>
  );
};

