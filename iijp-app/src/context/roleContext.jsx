import { createContext, useState, useContext, useEffect } from "react";
import RoleService from "../services/RoleService";
import AuthUser from "../auth/AuthUser";

export const RoleContext = createContext();

export const RoleContextProvider = ({ children }) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const [roles, setRoles] = useState([]);
  const token = getToken();
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
      obtenerRoles();
    }
  }, [token]);

  const obtenerRoles = async () => {
    try {
      const { data } = await RoleService.getAllRoles(getToken());
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

  const valor = { roles, setRoles };

  return <RoleContext.Provider value={valor}>{children}</RoleContext.Provider>;
};

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
