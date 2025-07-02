import { createContext, useState, useContext, useEffect } from "react";
import RoleService from "../services/RoleService";
import AuthUser from "../auth/AuthUser";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { useLocation } from "react-router-dom";

export const PermissionContext = createContext();

export const PermissionContextProvider = ({ children }) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const [permisos, setPermisos] = useState([]);

  const token = getToken();

  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!token) return;

    if (
      location.pathname === "/admin/roles" &&
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
      obtenerPermisos();
      setHasFetched(true);
    }
  }, [location.pathname, hasFetched, token]);

  const obtenerPermisos = async () => {
    try {
      const { data } = await RoleService.getPermissions();
      if (Array.isArray(data)) {
        setPermisos(data);
      } else {
        console.error("Error: Los datos obtenidos no son un array", data);
        setPermisos([]); // Asegurar que el estado no sea undefined
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setPermisos([]); // Evitar undefined en caso de error
    }
  };

  const valor = { permisos, setPermisos };

  return (
    <PermissionContext.Provider value={valor}>
      {children}
    </PermissionContext.Provider>
  );
};

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider"
    );
  }
  return context;
}
