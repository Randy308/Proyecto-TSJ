import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthUser from "./AuthUser";
import { UserContextProvider } from "../context/userContext";
import { RoleContextProvider } from "../context/roleContext";
import { PermissionContextProvider } from "../context/permissionContext";
import { NotificationContextProvider } from "../context/notificationContext";

const ProtectedRoutes = () => {
  const { getToken } = AuthUser();
  if (!getToken()) {
    return <Navigate to={"/"} />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
