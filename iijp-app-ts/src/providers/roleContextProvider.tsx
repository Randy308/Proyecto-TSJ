import { useState, useEffect } from "react";
import {RoleService} from "../services";
import { useLocation } from "react-router-dom";
import type { ContextProviderProps } from "../types";
import { RoleContext, useAuthContext } from "../context";


interface Role {
  roleName: string;
  id: number;
}

interface ValueContextType {
  roles: Role[] | undefined;
  obtenerRoles: () => Promise<void>;
}


export const RoleContextProvider = ({ children }:ContextProviderProps) => {
  const { hasAccess, hasAnyPermission } = useAuthContext();
  const [roles, setRoles] = useState<Role[] | undefined>(undefined);

  const location = useLocation();
  const [hasFetched, setHasFetched] = useState(false);

  //const user = getUser();
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
    if (!hasAccess()) return;

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
  }, [location.pathname, hasFetched, hasAccess, hasAnyPermission]);

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

  const valor:ValueContextType = { roles, obtenerRoles };

  return <RoleContext.Provider value={valor}>{children}</RoleContext.Provider>;
};
