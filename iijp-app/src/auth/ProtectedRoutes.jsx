import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthUser from "./AuthUser";
import { RoleContextProvider } from "../context/roleContext";
import { PermissionContextProvider } from "../context/permissionContext";

const ProtectedRoutes = () => {
  const { getToken, can } = AuthUser();
  if (!getToken()) {
    return <Navigate to={"/"} />;
  }
  return (
    <RoleContextProvider>
      <PermissionContextProvider>
        <Outlet />
      </PermissionContextProvider>
    </RoleContextProvider>
  );
};

export default ProtectedRoutes;
