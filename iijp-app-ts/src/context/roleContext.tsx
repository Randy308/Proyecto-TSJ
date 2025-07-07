import { createContext, useContext } from "react";


interface Role {
  roleName: string;
  id: number;
}

export interface ValueContextType {
  roles: Role[] | undefined;
  obtenerRoles: () => Promise<void>;
}

export const RoleContext = createContext<ValueContextType | undefined>(
  undefined
);

export function useRoleContext():ValueContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
