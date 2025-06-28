import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthUser = () => {
  const navigate = useNavigate();

  const getToken = () => {
    const token = Cookies.get("login");
    return token ? JSON.parse(token) : null;
  };

  const getUser = () => {
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : null;
  };

  const getRol = () => {
    const rol = Cookies.get("rol");
    return rol ? JSON.parse(rol) : null;
  };

  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState(getUser);
  const [rol, setRol] = useState(getRol);

  const saveToken = (user, token, rol) => {
    // Guardar cookies con expiración de 1 día
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
    Cookies.set("login", JSON.stringify(token), { expires: 1 });
    Cookies.set("rol", JSON.stringify(rol), { expires: 1 });

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
      Array.isArray(currentUser.permissions) &&
      currentUser.permissions.length > 0;
    const isUserDefined = Object.keys(currentUser).length > 0;
    return hasPermissions || isUserDefined;
  };

  const can = (permission) =>
    (getUser()?.permissions || []).includes(permission);

  const hasAnyPermission = (permissions) =>
    permissions.some((permission) => can(permission));

  const getLogout = () => {
    Cookies.remove("user");
    Cookies.remove("login");
    Cookies.remove("rol");
    setUser(null);
    setToken(null);
    setRol(null);
    navigate("/");
  };

  return {
    saveToken,
    token,
    user,
    getUser,
    can,
    hasAccess,
    hasAnyPermission,
    rol,
    getToken,
    getLogout,
  };
};

export default AuthUser;
