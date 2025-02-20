import { createContext, useState, useContext, useEffect } from "react";
import RoleService from "../services/RoleService";
import AuthUser from "../auth/AuthUser";

export const PermissionContext = createContext();

export const PermissionContextProvider = ({ children }) => {
  const { getToken, hasAnyPermission } = AuthUser();
  const [permisos, setPermisos] = useState([]);

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
      obtenerPermisos();
    }
  }, []);

  const obtenerPermisos = async () => {
    try {
      const { data } = await RoleService.getPermissions(getToken());
      if (Array.isArray(data)) {
        setPermisos(data);
        console.log(data);
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
