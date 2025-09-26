import { useEffect, useState } from "react";
import { useAuthContext, useVariablesContext } from "../../context";
import type { Faceta } from "../../types";
import Loading from "../../components/Loading";
import { AuthService } from "../../services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ExportarMaterias = () => {
  const { data: variables } = useVariablesContext();

  const { can } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!can("exportar_materias")) {
      navigate("/");
    }
  }, [can, navigate]);

  const [data, setData] = useState<Faceta[]>([]);
  const [materia, setMateria] = useState<Faceta | null>(null);

  const obtenerCronologia = async (id: number) => {
    try {
      const { data } = await AuthService.obtenerCronologiaMateria({
        materia: id,
      });

      if (data && data.message) {
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    if (variables && variables.materia && variables.materia.length > 0) {
      setData(variables.materia);
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
        </a>{" "}
        <a href="/admin/exportar" className="hover:underline hover:text-blue-500">
          / Exportar datos
        </a>{" "}
        <span className="font-bold">/ Materias</span>
      </span>

      <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
        Exportar materias
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400 text-sm">
        Selecciona una materia para exportar su cronología en formato PDF.
      </p>

      {materia && (
        <div className="mb-6 p-5 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Materia seleccionada:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {materia.nombre}
            </span>
          </h2>
          <button
            onClick={() => obtenerCronologia(Number(materia.id))}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            Exportar cronología
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {data && data.length > 0 ? (
          data.map((tema) => (
            <div
              key={tema.id}
              id={`tema-${tema.id}`}
              onClick={() => setMateria(tema)}
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
  );
};

export default ExportarMaterias;
