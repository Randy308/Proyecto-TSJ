import {AuthUser} from "../../auth";
export const PanelUser = () => {
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
    <div>
      <h2>User Panel</h2>

      {permissions.map((permission) => (
        <div key={permission}>
          {can(permission) ? (
            <p>Tienes permiso para {permission.replace(/_/g, " ")}</p>
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
