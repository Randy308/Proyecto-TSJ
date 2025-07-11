import { createContext, useContext } from "react";


interface Role {
  roleName: string;
  id: number;
}

export interface RoleContextType {
  roles: Role[] | undefined;
  obtenerRoles: () => Promise<void>;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);

export function useRoleContext():RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
