import { createContext, useContext } from "react";
import type { Permission } from "../types";

export interface PermissionContextType {
  permisos: Permission[] | undefined;
  setPermisos: React.Dispatch<React.SetStateAction<Permission[] | undefined>>;
}

export const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export function usePermissionContext(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider"
    );
  }
  return context;
}
