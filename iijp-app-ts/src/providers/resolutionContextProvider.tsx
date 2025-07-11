import { useState, useEffect } from "react";
import {UserService} from "../services";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps } from "../types";
import { ResolutionContext, useAuthContext } from "../context";

interface Resolution {
  periodo: string;
  cantidad: number;
  id: number;
  fecha_emision: string;
  nro_expediente: string;
  nro_resolucion: string;
}

interface ValueContextType {
  resolutions: Resolution[] | undefined;
  obtenerResolutions: (page?: number) => Promise<void>;
  totalResolutions: number;
  pageCount: number;
  current: number;
}


export const ResolutionContextProvider = ({
  children,
}: ContextProviderProps) => {
  const { hasAccess, hasAnyPermission } = useAuthContext();
  
  const [resolutions, setResolutions] = useState<Resolution[] | undefined>(
    undefined
  );
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);
  //const [users, setUsers] = useSessionStorage("users", []);

  const [current, setCurrent] = useState(1);
  const [totalResolutions, setTotalResolutions] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!hasAccess()) return;

    if (
      location.pathname === "/admin/resoluciones" &&
      !hasFetched &&
      hasAnyPermission([
        "subir_resoluciones",
        "subir_jurisprudencia",
        "realizar_web_scrapping",
      ])
    ) {
      obtenerResolutions();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched, hasAccess, hasAnyPermission]);

  const obtenerResolutions = async (page = 1) => {
    try {
      setResolutions([]);
      const { data } = await UserService.getAllResolutions(page);
      if (Array.isArray(data.data)) {
        setResolutions(data.data);
        setCurrent(data.current_page);
        setPageCount(data.last_page);
        setTotalResolutions(data.total);
      } else {
        console.error("Error: Los datos obtenidos no son un array", data);
        setResolutions([]);
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setResolutions([]);
    }
  };

  const valor: ValueContextType = {
    resolutions,
    totalResolutions,
    pageCount,
    current,
    obtenerResolutions,
  };

  return (
    <ResolutionContext.Provider value={valor}>
      {children}
    </ResolutionContext.Provider>
  );
};
