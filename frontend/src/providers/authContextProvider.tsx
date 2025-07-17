import { useEffect, useState } from "react";
import type { ContextProviderProps } from "../types";
import { AuthContext, type AuthUser, type AuthContextType } from "../context";
import { AuthService } from "../services";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { toast } from "react-toastify";

export const AuthContextProvider = ({ children }: ContextProviderProps) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    "isAuthenticated",
    false
  );
  const [loading, setLoading] = useState(true);
   // Assuming you want to use the current location for navigation
  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setAuthUser(null);
      return;
    }
    try {
      const response = await AuthService.getAuthUser();
      if (!response.data.success) {
        setAuthUser(null);
        return;
      }
      setAuthUser(response.data.user);
    } catch (error: unknown) {
      setAuthUser(null);
      console.error("Error checking authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.getLogin({ email, password });
      setAuthUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true, user: response.data.user };
    } catch (error: unknown) {
      console.error("Login error:", error);
      const message = "Error al iniciar sesión";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await AuthService.getLogout();
      toast.success("Sesión cerrada correctamente");
      setAuthUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error: unknown) {
      // Even if logout fails, clear user state
      setAuthUser(null);
      setIsAuthenticated(false);
      console.error("Logout error:", error);
      return { success: false, message: "Error al cerrar sesión" };
    }
  };

  const hasAccess = () => {
    const currentUser = authUser || ({} as AuthUser);
    const hasPermissions =
      Array.isArray(currentUser.permissions) &&
      currentUser.permissions.length > 0;
    const isUserDefined = Object.keys(currentUser).length > 0;
    return hasPermissions || isUserDefined;
  };

  const can = (permission: string) =>
    (authUser?.permissions || []).includes(permission);

  const hasAnyPermission = (permissions: string[]) =>
    permissions.some((permission) => can(permission));

  const value: AuthContextType = {
    authUser,
    setAuthUser,
    loading,
    login,
    logout,
    checkAuth,
    can,
    hasAccess,
    hasAnyPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
