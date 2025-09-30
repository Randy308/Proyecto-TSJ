import { useEffect, useState } from "react";
import { useAuthContext, useVariablesContext } from "../../context";
import type { Faceta } from "../../types";
import { AuthService } from "../../services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import AsyncButton from "../../components/AsyncButton";
const ExportarResoluciones = () => {
  const { data: variables } = useVariablesContext();
  const [isLoading, setIsLoading] = useState(false);

  const { can } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!can("exportar_datos")) {
      navigate("/");
    }
  }, [can, navigate]);

  const [data, setData] = useState<Faceta[]>([]);
  const [gestiones, setGestiones] = useState<Faceta[]>([]);
  const [materia, setMateria] = useState<Faceta | null>(null);
  const [gestion, setGestion] = useState<Faceta | null>(null);

  const handleSelectOptions = (tema: Faceta) => {
    setMateria(tema);
    const currentPeriodos = [];
    if (!tema.fecha_min || !tema.fecha_max) {
      toast.error("No hay gestiones disponibles para esta sala", {
        toastId: "samed",
      });
      return;
    }
    for (let i = Number(tema.fecha_min); i <= Number(tema.fecha_max); i++) {
      currentPeriodos.push({ id: i, nombre: i.toString() });
    }
    setGestion(currentPeriodos[currentPeriodos.length - 1]);
    setGestiones(currentPeriodos);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value);
    const selectedGestion = gestiones.find(
      (gestion) => gestion.id === selectedId
    );
    setGestion(selectedGestion || null);
  };
  const obtenerExcel = async () => {
    if (!materia) {
      toast.error("Seleccione una sala", { toastId: "samed" });
      return;
    }
    if (!gestion) {
      toast.error("Seleccione una gestión", { toastId: "samed" });
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    AuthService.obtenerResolucionesExcel({
      sala_id: materia.id,
      gestion: gestion?.id, // por seguridad, si es null evita error
    })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${materia.nombre}-${gestion?.nombre}.xlsx`; // archivo dinámico
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(async (error) => {
        try {
          // si la respuesta es un Blob con JSON
          const text = await error.response.data.text();
          const json = JSON.parse(text);

          if (json.mensaje) {
            toast.error(json.mensaje);
            return;
          }
        } catch (error: unknown) {
          // fallback si no es JSON
          console.error(error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (variables && variables.sala && variables.periodo) {
      setData(variables.sala || []);
      setGestiones(variables.periodo || []);
      
    }
  }, [variables]);

  if (!Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="m-4 p-4">
      <span className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
        <a href="/" className="hover:underline hover:text-blue-500">
          Inicio
        </a>
        <span>/</span>
        <a
          href="/admin/exportar"
          className="hover:underline hover:text-blue-500"
        >
          Exportar datos
        </a>{" "}
        <span>/</span>
        <span className="font-bold">Resoluciones</span>
      </span>

      <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        Exportar Resoluciones
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400 text-sm">
        Selecciona los filtro para exportar.
      </p>

      {materia && (
        <div className="mb-6 p-5 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Sala seleccionada:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {materia.nombre}
            </span>
          </h2>
          <div className="grid py-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {gestiones && gestiones.length > 0 && (
              <form>
                <label
                  htmlFor="gestiones"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Seleccione una gestión
                </label>
                <select
                  id="gestiones"
                  onChange={handleSelectChange}
                  value={gestion ? gestion.id : 0}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value={0} disabled>Seleccione una gestión</option>
                  {gestiones.map((tema) => (
                    <option key={tema.nombre} value={tema.id}>{tema.nombre}</option>
                  ))}
                </select>
              </form>
            )}
          </div>
          <AsyncButton
            isLoading={isLoading}
            full={false}
            asyncFunction={obtenerExcel}
            name="Exportar resoluciones"
          />
        </div>
      )}

      <div className="pt-4 mt-4">
        <p>Selecciona una materia</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {data && data.length > 0 ? (
            data.map((tema) => (
              <div
                key={tema.id}
                id={`tema-${tema.id}`}
                onClick={() => handleSelectOptions(tema)}
                className="p-5 flex flex-col items-center justify-center gap-3 rounded-2xl shadow-sm cursor-pointer transition-all bg-gradient-to-br bg-red-octopus-700 hover:bg-red-octopus-900 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white"
              >
                <span className="text-base font-medium text-center">
                  {tema.nombre}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 italic">
              No existen más nodos
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportarResoluciones;
