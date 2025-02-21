import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthUser from "./AuthUser";
import { RoleContextProvider } from "../context/roleContext";
import { PermissionContextProvider } from "../context/permissionContext";
import { UserContextProvider } from "../context/userContext";

const ProtectedRoutes = () => {
  const { getToken, can } = AuthUser();
  if (!getToken()) {
    return <Navigate to={"/"} />;
  }
  return (
    <UserContextProvider>
      <RoleContextProvider>
        <PermissionContextProvider>
          <Outlet />
        </PermissionContextProvider>
      </RoleContextProvider>
    </UserContextProvider>
  );
};

export default ProtectedRoutes;
