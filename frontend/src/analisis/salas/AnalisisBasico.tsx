import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import type { Faceta, FiltroNombre, ListaData } from "../../types";
import { OptionChart } from "../components/OptionChart";
import Tab from "../../components/Tab";
import { TablaMultivariable } from "../../components/TablaMultivariable";
import MultiBtnDropdown from "../../components/MultiBtnDropdown";
import { useAnalisisContext, useVariablesContext } from "../../context";
import { MultipleSelect } from "../components";

const AnalisisBasico = () => {
  const { id } = useParams();

  const [actual, setActual] = useState<string>("tabla");
  const [visible, setVisible] = useState<string | null>(null);
  const [selectedSala, setSelectedSala] = useState<Faceta[]>([]);
  const { data: variables } = useVariablesContext();
  const [validSalas, setValidSalas] = useState<Faceta[]>([]);
  const location = useLocation();
  const [columna, setColumna] = useState<string | null>(null);
  const {
    departamentos,
    periodos,
    setDepartamentos,
    setPeriodos,
    params,
    datos,
    isLoading,
    realizarAnalisis,
    setId,
    groupByDepartamento,
    groupByPeriodo,
    setGroupByDepartamento,
    setGroupByPeriodo,
  } = useAnalisisContext();

  useEffect(() => {
    const receivedForm = location.state;
    const periodos = receivedForm?.periodo || [];
    const periodoArray = Array.isArray(periodos)
      ? periodos
      : [{ nombre: periodos, id: periodos }];
    const departamentos = receivedForm?.departamento || [];
    setDepartamentos(departamentos);
    setPeriodos(periodoArray);
    const salas = filteredSalas(periodoArray);
    setId(salas.map((sala) => sala.id));
    setColumna(salas[0]?.grupo || null);
    setValidSalas(salas);
    setSelectedSala(salas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (variables && variables.sala) {
      const salas = filteredSalas(periodos);
      setValidSalas(salas);
      setSelectedSala(salas);
      setId(salas.map((sala) => sala.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables, periodos]);
  const filteredSalas = (periodoArray?: Faceta[]) => {
    if (!Array.isArray(periodoArray)) return [];

    let salas =
      variables?.sala?.filter((sala) => sala.grupo_id === Number(id)) || [];

    if (periodoArray.length > 0) {
      salas = salas.filter(
        (sala) =>
          sala.fecha_min !== undefined &&
          sala.fecha_min <= String(periodoArray[0]?.nombre) &&
          sala.fecha_max !== undefined &&
          periodoArray[0]?.nombre !== undefined &&
          sala.fecha_max >= String(periodoArray[0].nombre)
      );
    }

    return salas;
  };

  useEffect(() => {}, [validSalas]);
  return (
    <div className="flex flex-col md:flex-row my-4 gap-2">
      <div className="p-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg">
        {columna && (
          <p className="text-black dark:text-white pb-4">
            <span className="italic font-bold capitalize"> {columna}</span>
          </p>
        )}

        <div>
          {validSalas && validSalas.length > 0 && (
            <MultipleSelect
              faceta={validSalas}
              selectedValues={selectedSala}
              setSelectedValues={setSelectedSala}
              nombre="Salas"
            />
          )}

          {variables && variables.periodo && variables.periodo.length > 0 && (
            <MultipleSelect
              faceta={variables?.periodo}
              selectedValues={periodos}
              setSelectedValues={setPeriodos}
              nombre="Periodos"
            />
          )}

          {variables &&
            variables.departamento &&
            variables.departamento.length > 0 && (
              <MultipleSelect
                faceta={variables?.departamento}
                selectedValues={departamentos}
                setSelectedValues={setDepartamentos}
                nombre="Departamentos"
              />
            )}
        </div>
        <div className="flex flex-col gap-3 my-4">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            <input
              type="checkbox"
              checked={groupByPeriodo}
              onChange={(e) => setGroupByPeriodo?.(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            Agrupar por periodos
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            <input
              type="checkbox"
              checked={groupByDepartamento}
              onChange={(e) => setGroupByDepartamento?.(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            Agrupar por departamentos
          </label>
        </div>

        <div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Variables
            </label>
            {Object.entries(params).map(([name, contenido]) => (
              <div key={name}>
                <MultiBtnDropdown
                  name={name as FiltroNombre}
                  contenido={contenido as ListaData[]}
                  setVisible={setVisible}
                  visible={visible}
                />
              </div>
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-2">
              <AsyncButton
                name={"Analizar"}
                asyncFunction={realizarAnalisis}
                isLoading={isLoading}
                full={false}
              />
            </div>
          </div>
        </div>
      </div>

      {datos && datos.length > 0 ? (
        <Tab actual={actual} setActual={setActual}>
          {actual === "tabla" ? <TablaMultivariable /> : <OptionChart />}
        </Tab>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default AnalisisBasico;
