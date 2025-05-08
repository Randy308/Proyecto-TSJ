import { createContext, useState, useContext, useEffect } from "react";
import AuthUser from "../auth/AuthUser";
import UserService from "../services/UserService";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const token = getToken();
  const [users, setUsers] = useState([]);
  const [current, setCurrent] = useState(1);
  const [totalUser, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!token) return;
    if (
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
      obtenerUsers(1);
    }
  }, [token]);

  const obtenerUsers = async (page) => {
    try {
      const { data } = await UserService.getAllUsers(getToken(), page);
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

  const valor = { users, totalUser, pageCount, current, obtenerUsers };

  return <UserContext.Provider value={valor}>{children}</UserContext.Provider>;
};

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
