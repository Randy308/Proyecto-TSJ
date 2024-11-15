import React from "react";
import AuthUser from "../../auth/AuthUser";
import Sidebar from "../../components/Sidebar";

const PanelAdmin = () => {
  const { can } = AuthUser();

  const permissions = [
    "access posts",
    "create posts",
    "update posts",
    "delete posts",
    "create users",
    "update users",
    "delete users",
    "create user",
    "update user",
    "delete user",
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-4 m-4 p-4">
      {permissions.map((permission) => (
        <div
          className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800"
          key={permission}
        >
          {can(permission) ? (
            <p className="text-lg text-black dark:text-white">
              Tienes permiso para {permission.replace(/_/g, " ")}
            </p>
          ) : (
            <p>
              No tienes los siguientes permisos {permission.replace(/_/g, " ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PanelAdmin;
