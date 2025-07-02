import { createContext, useState, useContext, useEffect } from "react";
import RoleService from "../services/RoleService";
import AuthUser from "../auth/AuthUser";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { useLocation } from "react-router-dom";

export const RoleContext = createContext();

export const RoleContextProvider = ({ children }) => {
  const { getToken, hasAnyPermission, getUser } = AuthUser();
  const [roles, setRoles] = useState([]);

  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  const token = getToken();
  const user = getUser();
  useEffect(() => {
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
      console.log("User has permissions to view roles");
    }
    if (!token) return;

    if (
      (location.pathname === "/admin/usuarios" ||
        location.pathname === "/admin/roles") &&
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
      obtenerRoles();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched, token]);

  const obtenerRoles = async () => {
    try {
      const { data } = await RoleService.getAllRoles();
      if (Array.isArray(data)) {
        setRoles(data);
      } else {
        console.error("Error: Los datos obtenidos no son un array", data);
        setRoles([]); // Asegurar que el estado no sea undefined
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setRoles([]); // Evitar undefined en caso de error
    }
  };

  const valor = { roles, obtenerRoles };

  return <RoleContext.Provider value={valor}>{children}</RoleContext.Provider>;
};

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
