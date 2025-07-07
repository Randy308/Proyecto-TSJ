import { createContext, useContext } from "react";
import type { Permission } from "../types";

export interface ValueContextType {
  permisos: Permission[] | undefined;
  setPermisos: React.Dispatch<React.SetStateAction<Permission[] | undefined>>;
}

export const PermissionContext = createContext<ValueContextType | undefined>(
  undefined
);

export function usePermissionContext(): ValueContextType {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider"
    );
  }
  return context;
}
