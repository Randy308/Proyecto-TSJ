import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthUser = () => {
  const navigate = useNavigate();

  const getToken = () => {
    const tokenString = sessionStorage.getItem("token");
    return tokenString ? JSON.parse(tokenString) : null;
  };

  const getUser = () => {
    const userString = sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const getRol = () => {
    const rolString = sessionStorage.getItem("rol");
    return rolString ? JSON.parse(rolString) : null;
  };

  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState(getUser);
  const [rol, setRol] = useState(getRol);

  const saveToken = (user, token, rol) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("rol", JSON.stringify(rol));
    setUser(user);
    setToken(token);
    setRol(rol);

    if (hasAccess(user)) {
        navigate("/dashboard");
      } else {
        navigate("/inicio");
      }
  };

  const hasAccess = (user) => {
    
    const currentUser = user || {};
    const hasPermissions =
      Array.isArray(currentUser.permissions) && currentUser.permissions.length > 0;
    const isUserDefined = Object.keys(currentUser).length > 0;
    return hasPermissions || isUserDefined;
  };

  const can = (permission) => (user?.permissions || []).includes(permission);

  const hasAnyPermission = (permissions) =>
    permissions.some((permission) => can(permission));

  const getLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
    setRol(null);
    navigate("/");
  };

  return {
    saveToken,
    token,
    user,
    can,
    hasAccess,
    hasAnyPermission,
    rol,
    getToken,
    getLogout,
  };
};

export default AuthUser;
