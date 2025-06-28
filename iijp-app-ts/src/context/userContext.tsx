import { createContext, useState, useContext, useEffect } from "react";
import UserService from "../services/UserService";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps, User } from "../types";
import { AuthUser } from "../auth";

interface ValueContextType {
  users: User[] | undefined;
  totalUser: number;
  pageCount: number;
  current: number;
  obtenerUsers: () => Promise<void>;
}

export const UserContext = createContext<ValueContextType | undefined>(
  undefined
);

export const UserContextProvider = ({ children }: ContextProviderProps) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const token = getToken();

  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);
  //const [users, setUsers] = useSessionStorage("users", []);

  const [current, setCurrent] = useState(1);
  const [totalUser, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!token) return;

    if (
      location.pathname === "/admin/usuarios" &&
      !hasFetched &&
      hasAnyPermission([
        "ver_rol",
        "crear_roles",
        "eliminar_roles",
        "actualizar_roles",
        "ver_roles",
        "asignar_permisos",
        "quitar_permisos",
      ])
    ) {
      obtenerUsers();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched, token]);

  const obtenerUsers = async (page = 1) => {
    try {
      const { data } = await UserService.getAllUsers(page);
      if (Array.isArray(data.data)) {
        setUsers(data.data);
        setCurrent(data.current_page);

        setPageCount(data.last_page);
        setTotalUsers(data.total);
      } else {
        console.error("Error: Los datos obtenidos no son un array", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setUsers([]);
    }
  };

  const valor: ValueContextType = {
    users,
    totalUser,
    pageCount,
    current,
    obtenerUsers,
  };

  return <UserContext.Provider value={valor}>{children}</UserContext.Provider>;
};

export function useUserContext(): ValueContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
