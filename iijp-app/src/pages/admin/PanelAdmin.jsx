import React from "react";
import AuthUser from "../../auth/AuthUser";

const PanelAdmin = () => {
  const { can } = AuthUser();

  const permissions = [
    "ver_todas_resoluciones",
    "ver_todas_jurisprudencia",
    "crear_usuarios",
    "eliminar_usuarios",
    "actualizar_usuarios",
    "ver_usuarios",
    "ver_usuario",
    "ver_rol",
    "crear_roles",
    "eliminar_roles",
    "actualizar_roles",
    "ver_roles",
    "asignar_permisos",
    "quitar_permisos",
    //Codificador
    "acceder_resoluciones",
    "subir_resoluciones",
    "actualizar_resoluciones",
    "eliminar_resoluciones",
    "acceder_jurisprudencia",
    "subir_jurisprudencia",
    "actualizar_jurisprudencia",
    "eliminar_jurisprudencia",
    "web_scrapping",
    "crear_publicacion",
    "eliminar_publicacion",
    "ver_publicacion",
    "actualizar_publicacion",
    // Users
    "realizar_prediccion",
    "refinar_busqueda",
    "crear_estilos",
    "eliminar_estilos",
    "ver_estilos",
    "actualizar_estilos",
    "actualizar_perfil",
    "eliminar_perfil",
    "ver_perfil",
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
