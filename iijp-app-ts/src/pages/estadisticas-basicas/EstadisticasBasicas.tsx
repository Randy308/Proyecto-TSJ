import { useEffect, useMemo, useState } from "react";
import { useVariablesContext } from "../../context/variablesContext";
import MultiBtnDropdown from "../../components/MultiBtnDropdown";
import { BsCheck2All } from "react-icons/bs";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { ResolucionesService } from "../../services";
import { filterForm } from "../../utils/filterForm";
import { useNavigate } from "react-router-dom";
import { departamentos } from "../../data/Mapa";
import type { FormListaX, ListaX, MagistradoItem } from "../../types";
import { toast } from "react-toastify";
import AsyncButton from "../../components/AsyncButton";

const EstadisticasBasicas = () => {
  const { data } = useVariablesContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selector, setSelector] = useState<ListaX[]>([] as ListaX[]);
  const limite = useMemo(() => 1, []);
  const checkIcon = useMemo(() => <BsCheck2All className="w-5 h-5" />, []);
  const removeIcon = useMemo(
    () => (
      <MdOutlineRemoveCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
    ),
    []
  );

  const [periodo, setPeriodo] = useState<string>("all");
  const [visible, setVisible] = useState<string | null>(null);

  const [selectedDepto, setSelectedDepto] = useState<string[]>([]);
  const [validMagistrados, setValidMagistrados] = useState<
    MagistradoItem[] | undefined
  >([]);
  const navigate = useNavigate();

  const handleClick = (name: string) => {
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
  const clearList = () => {
    togglePeriodo("all");
  };

  const updateMagistrados = (periodo: string) => {
    if (periodo === "all" || periodo === null) {
      setValidMagistrados(data?.magistrado);
    } else {
      const startDate = parseInt(periodo);
      const filteredMagistrados = data?.magistrado.filter((item) => {
        const fechaMin = parseInt(item.fecha_min);
        const fechaMax = parseInt(item.fecha_max);
        return fechaMax >= startDate && fechaMin <= startDate;
      });
      setValidMagistrados(filteredMagistrados);
    }
  };

  const togglePeriodo = (nombre: string) => {
    const next = periodo === nombre ? "all" : nombre;
    setPeriodo(next);
    setSelector([]);
    updateMagistrados(next);
  };

  const fetchData = async () => {
    if (!selector || selector.length <= 0) {
      toast.warning("Debe de seleccionar una variable primero");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    const validatedData = filterForm({
      variable: selector[0].ids,
      nombre: selector[0].name,
      periodo: periodo,
      departamento: selectedDepto,
    });

    ResolucionesService.realizarAnalisis(validatedData as FormListaX)
      .then(({ data }) => {
        if (data) {
          navigate(`/estadisticas-basicas/${selector[0].name}`, {
            state: { data, validatedData },
          });
        }
      })
      .catch((err) => {
        console.log("Existe un error " + err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    updateMagistrados("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
                {data &&
                  data.periodo &&
                  Array.isArray(data.periodo) &&
                  data.periodo.map((item) => (
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

        <div className="sm:p-4 p-2 m-2 sm:m-4 bg-white dark:bg-gray-600 dark:text-white shadow-md rounded-lg lg:col-span-2 ">
          <div className="text-lg font-bold">Paso 2</div>
          <div className="flex flex-row flex-wrap pb-4 justify-between items-center">
            <span>Seleccioné un variable</span>
            <AsyncButton
              asyncFunction={fetchData}
              name="Analizar"
              isLoading={isLoading}
              full={false}
            />
          </div>

          <div className="sm:p-4 sm:m-4">
            {data && data.materia && Array.isArray(data.materia) && (
              <MultiBtnDropdown
                setVisible={setVisible}
                name={"materia"}
                listaX={selector}
                limite={limite}
                setListaX={setSelector}
                contenido={data.materia}
                visible={visible}
                size={6}
              />
            )}

            {validMagistrados && (
              <MultiBtnDropdown
                setVisible={setVisible}
                name={"magistrado"}
                listaX={selector}
                limite={limite}
                setListaX={setSelector}
                contenido={validMagistrados}
                visible={visible}
                size={6}
              />
            )}

            {data && data.sala && Array.isArray(data.sala) && (
              <MultiBtnDropdown
                setVisible={setVisible}
                name={"sala"}
                listaX={selector}
                limite={limite}
                setListaX={setSelector}
                contenido={data.sala}
                visible={visible}
                size={6}
              />
            )}
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
              className="w-full h-full p-8"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {departamentos.map((depto) => (
                <path
                  key={depto.id}
                  d={depto.d}
                  fill={
                    selectedDepto.includes(depto.name) ? "#0ea5e9" : "#cbd5e1"
                  }
                  stroke="#1e293b"
                  strokeWidth={0.9}
                  className="cursor-pointer transition-colors duration-200 hover:fill-blue-600"
                  onClick={() => handleClick(depto.name)}
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
