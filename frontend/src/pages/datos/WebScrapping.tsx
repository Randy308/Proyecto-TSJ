import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import { toast } from "react-toastify";
import { UserService } from "../../services";
import { useAuthContext } from "../../context";

const actions = [
  {
    permission: "realizar_web_scrapping",
    name: "Realizar Web Scraping",
    title: "Obtención de Resoluciones",
    description:
      "Presiona el botón para buscar nuevas resoluciones disponibles en el sistema.",
  },
  {
    permission: "ajustar_fechas",
    name: "Ajustar Fechas",
    title: "Ajuste de Fechas",
    description: "Presiona el botón para ajustar las fechas.",
  },
  {
    permission: "ajustar_departamentos",
    name: "Ajustar Departamentos",
    title: "Ajuste de Departamentos",
    description: "Presiona el botón para ajustar los departamentos.",
  },
  {
    permission: "generar_nodos",
    name: "Generar Nodos",
    title: "Generación de Nodos",
    description: "Presiona el botón para generar nodos.",
  },
  {
    permission: "obtener_terminos_clave",
    name: "Generar Términos Clave",
    title: "Obtención de Términos Clave",
    description: "Presiona el botón para generar términos clave.",
  },
  {
    permission: "administrar_datos",
    name: "Actualizar Resoluciones",
    title: "Actualización de Resoluciones",
    description: "Presiona el botón para actualizar las resoluciones.",
  }
];

const WebScrapping = () => {
  const { hasAnyPermission, can } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingButtons, setLoadingButtons] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const requiredPermissions = actions.map((a) => a.permission);
    if (!hasAnyPermission(requiredPermissions)) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [hasAnyPermission, navigate]);

  const handleAsyncAction = (name: string) => async () => {
    const methodName = name.replace(/\s+/g, ""); // Remove spaces

    console.log("Invoking method:", methodName);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceFn = (UserService as any)[methodName];

    if (typeof serviceFn !== "function") {
      toast.error(`No se encontró la función: ${methodName}`);
      return;
    }

    if (loadingButtons[name]) return;

    setLoadingButtons((prev) => ({ ...prev, [name]: true }));
    try {
      const { data } = await serviceFn();
      toast.success(`${data?.message || "Acción completada"}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      console.error(`Error en ${name}:`, error);
      toast.error("Ocurrió un error al realizar la acción.");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [name]: false }));
    }
  };

  if (loading) return null;

  return (
    <div className="p-4 m-4">
      <h2 className="text-xl font-semibold">Herramientas</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Realiza una acción.
      </p>
      {actions
        .filter((action) => can(action.permission))
        .map((action) => (
          <div key={action.permission} className="p-4 m-4">
            <h2 className="text-xl font-semibold">{action.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {action.description}
            </p>
            <div className="flex flex-col md:flex-row flex-wrap gap-4">
              <AsyncButton
                name={action.name}
                isLoading={!!loadingButtons[action.name]}
                full={false}
                asyncFunction={handleAsyncAction(action.name)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default WebScrapping;
