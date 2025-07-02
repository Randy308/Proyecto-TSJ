import { createContext, useState, useContext, useEffect } from "react";
import AuthUser from "../auth/AuthUser";
import UserService from "../services/UserService";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { useLocation } from "react-router-dom";

export const ResolutionContext = createContext();

export const ResolutionContextProvider = ({ children }) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const token = getToken();

  const [resolutions, setResolutions] = useState([]);
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);
  //const [users, setUsers] = useSessionStorage("users", []);

  const [current, setCurrent] = useState(1);
  const [totalResolutions, setTotalResolutions] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!token) return;

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
  }, [location.pathname, hasFetched, token]);

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

  const valor = {
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

export function useResolutionContext() {
  const context = useContext(ResolutionContext);
  if (!context) {
    throw new Error(
      "useResolutionContext must be used within a ResolutionProvider"
    );
  }
  return context;
}
