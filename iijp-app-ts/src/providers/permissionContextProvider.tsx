import { useState, useEffect } from "react";
import {RoleService} from "../services";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps, Permission } from "../types";
import { PermissionContext, type PermissionContextType } from "../context/permissionContext";
import { useAuthContext } from "../context";


export const PermissionContextProvider = ({
  children,
}: ContextProviderProps) => {
  const { hasAccess, hasAnyPermission } = useAuthContext();
  const [permisos, setPermisos] = useState<Permission[] | undefined>(undefined);

  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasAccess()) return;

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
  }, [location.pathname, hasFetched, hasAccess, hasAnyPermission]);

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

  const valor: PermissionContextType = { permisos, setPermisos };

  return (
    <PermissionContext.Provider value={valor}>
      {children}
    </PermissionContext.Provider>
  );
};
