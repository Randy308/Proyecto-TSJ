import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import type { FiltroNombre, ListaData } from "../../types";
import { OptionChart } from "../components/OptionChart";
import Tab from "../../components/Tab";
import { TablaMultivariable } from "../../components/TablaMultivariable";
import MultiBtnDropdown from "../../components/MultiBtnDropdown";
import { useAnalisisContext } from "../../context";

const AnalisisBasico = () => {
  const { id } = useParams();

  const [actual, setActual] = useState<string>("tabla");
  const [visible, setVisible] = useState<string | null>(null);

  const location = useLocation();
  const {
    setDepartamentos,
    setPeriodos,
    params,
    columna,
    datos,
    isLoading,
    realizarAnalisis,
    setId,
  } = useAnalisisContext();

  useEffect(() => {
    const receivedForm = location.state;
    const periodos = receivedForm?.periodo || [];
    const periodoArray = Array.isArray(periodos) ? periodos : [periodos];
    const departamentos = receivedForm?.departamento || [];
    setDepartamentos(departamentos);
    setPeriodos(periodoArray);
    setId(Number(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <div className="flex flex-col md:flex-row flex-wrap my-4 gap-2">
      <div className="p-4 border border-gray-300 dark:border-gray-950 bg-white dark:bg-gray-600 rounded-lg">
        {columna && (
          <p className="text-black dark:text-white pb-4">
            Materia observada:
            <span className="italic font-bold capitalize"> {columna}</span>
          </p>
        )}

        <div></div>
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
