import { useEffect, useMemo, useState } from "react";
import { useVariablesContext } from "../../context/variablesContext";
import { BsCheck2All } from "react-icons/bs";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { filterForm } from "../../utils/filterForm";
import { useNavigate } from "react-router-dom";
import { departamentos } from "../../data/Mapa";
import type { Variables } from "../../types";
import { toast } from "react-toastify";
import AsyncButton from "../../components/AsyncButton";

interface ListaData {
  id: number;
  nombre: string;
  grupo: string;
  grupo_id: number;
  fecha_min: string;
  fecha_max: string;
}

const EstadisticasBasicas = () => {
  const { data } = useVariablesContext();
  const variables = data as Variables;
  const [sala, setSala] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const checkIcon = useMemo(() => <BsCheck2All className="w-5 h-5" />, []);
  const removeIcon = useMemo(
    () => (
      <MdOutlineRemoveCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
    ),
    []
  );

  const [periodo, setPeriodo] = useState<string>("all");
  const [validSalas, setValidSalas] = useState<ListaData[] | undefined>([]);
  const navigate = useNavigate();

  const clearList = () => {
    togglePeriodo("all");
    setSala(null);
  };

  const [selectedDepto, setSelectedDepto] = useState<number[]>([]);

  const handleClick = (name: number) => {
    setSelectedDepto((prev) => {
      if (prev.includes(name)) {
        // Remove it
        prev = prev.filter((item) => item !== name);
        return prev;
      } else {
        // Add it
        return [...prev, name];
      }
    });
  };

  const updateSalas = (periodo: string) => {
    if (!variables || !variables.sala) {
      return;
    }
    const salas = variables?.sala as ListaData[];
    if (periodo === "all" || periodo === null || salas.length <= 0) {
      setValidSalas(groupByGrupo(salas));
    } else {
      const startDate = parseInt(periodo);
      const filteredData = salas.filter((item) => {
        const fechaMin = parseInt(item.fecha_min);
        const fechaMax = parseInt(item.fecha_max);
        return fechaMax >= startDate && fechaMin <= startDate;
      });
      setValidSalas(groupByGrupo(filteredData));
    }
  };

  const groupByGrupo = (data: ListaData[]): ListaData[] => {
    console.log("Grouping data by grupo:", data);
    const grouped = new Map<number, ListaData>();

    for (const item of data) {
      const id = item.grupo_id;
      const fechaMin = parseInt(item.fecha_min);
      const fechaMax = parseInt(item.fecha_max);

      if (!grouped.has(id)) {
        grouped.set(id, { ...item });
      } else {
        const existing = grouped.get(id)!;

        existing.fecha_min = Math.min(
          parseInt(existing.fecha_min),
          fechaMin
        ).toString();
        existing.fecha_max = Math.max(
          parseInt(existing.fecha_max),
          fechaMax
        ).toString();
      }
    }

    return Array.from(grouped.values());
  };

  const togglePeriodo = (nombre: string) => {
    const next = periodo === nombre ? "all" : nombre;
    setPeriodo(next);
    setSala(null);
    updateSalas(next);
  };

  const fetchData = async () => {
    if (!sala) {
      toast.warning("Seleccione una materia primero antes de continuar");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    const validatedData = filterForm({
      periodo: periodo,
      departamento: selectedDepto,
    });

    navigate(`/analisis/sala/${sala}`, {
      state: validatedData,
    });
  };

  useEffect(() => {
    updateSalas("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
        <div className="p-4 my-4 bg-white  dark:bg-gray-600 dark:text-white shadow-md rounded-lg">
          <div className="text-lg font-bold">Paso 1</div>
          <span>Seleccioné un gestión</span>
          <div className="py-4 my-4">
            <ul>
              <li className="px-2 flex flex-row text-sm flex-wrap gap-4 pb-4">
                <a
                  onClick={() => togglePeriodo("all")}
                  className={`flex-1 inline-flex text-center p-1 sm:p-4  border-2 border-gray-200 rounded-lg cursor-pointer  ${
                    periodo == "all"
                      ? "text-white bg-red-octopus-500"
                      : "text-gray-500 bg-white dark:hover:text-gray-300 dark:border-gray-700  hover:text-gray-600  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700"
                  }`}
                >
                  {checkIcon}
                  <span className="ms-3">Todos</span>
                </a>
                <a
                  onClick={() => clearList()}
                  className="flex-1 dark:bg-gray-800 dark:border-gray-700 flex border hover:cursor-pointer border-gray-200 items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  {removeIcon}
                  <span className="ms-3">Quitar Selección</span>
                </a>
              </li>
              <ul className="grid grid-cols-3 gap-2">
                {variables &&
                  variables.periodo &&
                  Array.isArray(variables.periodo) &&
                  variables.periodo.map((item) => (
                    <li key={item.id}>
                      <input
                        type="checkbox"
                        id={item.nombre}
                        name={item.nombre}
                        value={item.nombre}
                        className="hidden"
                        checked={periodo === item.nombre}
                        onChange={() => togglePeriodo(item.nombre)}
                      />
                      <label
                        htmlFor={item.nombre}
                        className={`inline-flex text-center p-1 sm:p-3 w-full lg:w-auto border-2 border-gray-200 rounded-lg cursor-pointer  ${
                          periodo == item.nombre
                            ? "text-white bg-red-octopus-500"
                            : "text-gray-500 bg-white dark:hover:text-gray-300 dark:border-gray-700  hover:text-gray-600  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700"
                        }`}
                      >
                        {item.nombre}
                      </label>
                    </li>
                  ))}
              </ul>
            </ul>
          </div>
        </div>

        <div className="p-2 m-2 bg-white dark:bg-gray-600 dark:text-white shadow-md rounded-lg lg:col-span-2 ">
          <div className="text-lg font-bold">Paso 2</div>
          <div className="flex flex-row flex-wrap pb-4 justify-between items-center">
            <span>Seleccioné un Materia a Analizar</span>
            <AsyncButton
              asyncFunction={fetchData}
              name="Analizar"
              isLoading={isLoading}
              full={false}
            />
          </div>

          <div className="sm:p-4 sm:m-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {validSalas &&
              Array.isArray(validSalas) &&
              validSalas.map((item) => (
                <div key={item.grupo_id}>
                  <input
                    type="checkbox"
                    id={item.nombre}
                    name={item.nombre}
                    value={item.nombre}
                    className="hidden peer"
                    checked={sala === item.grupo_id}
                    onChange={() => setSala(item.grupo_id)}
                  />
                  <label
                    htmlFor={item.nombre}
                    className={`inline-flex h-24 items-center justify-center text-center p-1 sm:p-3 w-full border-2 border-gray-200 rounded-lg cursor-pointer  ${
                      sala == item.grupo_id
                        ? "text-white bg-red-octopus-500"
                        : "text-gray-500 bg-white dark:hover:text-gray-300 dark:border-gray-700  hover:text-gray-600  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.grupo}
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div className="p-4 m-4 bg-white dark:bg-gray-600 dark:text-white shadow-md rounded-lg lg:col-span-2">
          <div className="text-lg font-bold">Paso 3 (opcional)</div>
          <div className="flex flex-row flex-wrap justify-between items-center">
            <span>Seleccionar departamentos en el mapa</span>
          </div>

          <div className="lg:col-span-2 h-[700px] bg-white pt-4 dark:bg-gray-600 dark:text-white flex items-center justify-center">
            <svg
              viewBox="0 0 1000 1000" // Ajusta según tu SVG real
              className="w-full h-full p-2"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {departamentos.map((depto) => (
                <path
                  key={depto.id}
                  d={depto.d}
                  fill={
                    selectedDepto.includes(depto.id) ? "#0ea5e9" : "#cbd5e1"
                  }
                  stroke="#1e293b"
                  strokeWidth={0.9}
                  className="cursor-pointer transition-colors duration-200 hover:fill-blue-600"
                  onClick={() => handleClick(depto.id)}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasBasicas;
