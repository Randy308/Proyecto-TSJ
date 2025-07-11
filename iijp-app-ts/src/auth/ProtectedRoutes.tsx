import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context";

export const ProtectedRoutes = () => {
  const { hasAccess } = useAuthContext();
  if (!hasAccess()) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};
