import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context";
import Loading from "../components/Loading";

export const ProtectedRoutes = () => {
  const { hasAccess, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }
  if (!hasAccess()) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};
