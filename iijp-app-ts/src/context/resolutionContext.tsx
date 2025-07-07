import { createContext, useContext } from "react";

interface Resolution {
  periodo: string;
  cantidad: number;
  id: number;
  fecha_emision: string;
  nro_expediente: string;
  nro_resolucion: string;
}

export interface ValueContextType {
  resolutions: Resolution[] | undefined;
  obtenerResolutions: (page?: number) => Promise<void>;
  totalResolutions: number;
  pageCount: number;
  current: number;
}

export const ResolutionContext = createContext<ValueContextType | undefined>(
  undefined
);

export function useResolutionContext(): ValueContextType {
  const context = useContext(ResolutionContext);
  if (!context) {
    throw new Error(
      "useResolutionContext must be used within a ResolutionProvider"
    );
  }
  return context;
}
