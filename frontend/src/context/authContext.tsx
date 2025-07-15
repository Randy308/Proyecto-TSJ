import { createContext, useContext } from "react";

export interface AuthUser {
  id: number;
  permissions?: string[];
  rol?: string;
  name?: string;
  email?: string;
  created_at?: string;
}

export interface AuthContextType {
  authUser: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; user?: AuthUser }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
  checkAuth: () => Promise<void>;
  can: (permission: string) => boolean;
  hasAccess: () => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AnalisisProvider");
  }
  return context;
}
