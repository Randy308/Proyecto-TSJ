import { useEffect, useState } from "react";
import { useAuthContext, useVariablesContext } from "../../context";
import type { Faceta } from "../../types";
import Loading from "../../components/Loading";
import { AuthService, UserService } from "../../services";
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
    exportSubtemas();
  }, [can, navigate]);

  const exportSubtemas = async () => {
    const { data } = await UserService.getSubtemas();
    setSubtemas(data);
    console.log("Response subtemas:", data);
  };

  const [data, setData] = useState<Faceta[]>([]);
  const [subtemas, setSubtemas] = useState<Faceta[]>([]);
  const [materia, setMateria] = useState<Faceta | null>(null);
  const [subtema, setSubtema] = useState<Faceta | null>(null);

  const obtenerCronologia = async (id: number) => {
    try {
      const { data } = await AuthService.obtenerCronologiaMateria({
        materia: id,
        subtema: subtema ? Number(subtema.id) : undefined,
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

  const handleMateriaClick = (tema: Faceta) => {
    setMateria(tema);
    setSubtema(null); // Reset subtema when a new materia is selected
  };

  return (
    <div className="m-4 p-4">
      <span className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
        <a href="/" className="hover:underline hover:text-blue-500">
          Inicio
        </a>{" "}
        <a
          href="/admin/exportar"
          className="hover:underline hover:text-blue-500"
        >
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
          {materia.nombre === "Derecho Penal" ||
          materia.nombre === "Derecho Civil" ? (
            subtemas &&
            subtemas.length > 0 &&
            subtemas.filter((sub) => sub.descriptor_id === materia.id).length >
              0 && (
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Subtemas disponibles:
                </h3>
                <ul className="list-disc list-inside">
                  {subtemas
                    .filter((sub) => sub.descriptor_id === materia.id)
                    .map((miSubTema) => (
                      <li
                        key={miSubTema.id}
                        onClick={() => setSubtema(miSubTema)}
                        className={`text-gray-700 dark:text-gray-300 ${
                          subtema && miSubTema.id === subtema.id
                            ? "font-bold text-blue-600 dark:text-blue-400"
                            : "cursor-pointer hover:underline"
                        }`}
                      >
                        {miSubTema.nombre}
                      </li>
                    ))}
                </ul>
              </div>
            )
          ) : (
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Materia seleccionada:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {materia.nombre}
              </span>
            </h2>
          )}

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
              onClick={() => handleMateriaClick(tema)}
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
