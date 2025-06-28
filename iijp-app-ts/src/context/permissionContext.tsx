import { createContext, useState, useContext, useEffect } from "react";
import RoleService from "../services/RoleService";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps, Permission } from "../types";
import { AuthUser } from "../auth";

interface ValueContextType {
  permisos: Permission[] | undefined;
  setPermisos: React.Dispatch<React.SetStateAction<Permission[] | undefined>>;
}

export const PermissionContext = createContext<ValueContextType | undefined>(
  undefined
);

export const PermissionContextProvider = ({
  children,
}: ContextProviderProps) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const [permisos, setPermisos] = useState<Permission[] | undefined>(undefined);

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

  const valor: ValueContextType = { permisos, setPermisos };

  return (
    <PermissionContext.Provider value={valor}>
      {children}
    </PermissionContext.Provider>
  );
};

export function usePermissionContext(): ValueContextType {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider"
    );
  }
  return context;
}
