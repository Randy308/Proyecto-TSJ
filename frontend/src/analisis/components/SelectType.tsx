import { BsBarChartFill, BsFillPieChartFill } from "react-icons/bs";
import { useAnalisisContext } from "../../context";
import type { ChartType } from "../../types";
import {
  PiChartBarHorizontalFill,
  PiChartDonutFill,
  PiChartPolarThin,
} from "react-icons/pi";
import { GiRadarCrossSection } from "react-icons/gi";

export const SelectType = () => {
  const { chartType, isMultiVariable, setChartType } = useAnalisisContext();
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelection = e.target.value as ChartType;
    if (chartType != newSelection) {
      setChartType(newSelection);
    }
  };

  return (
    <div>
      <label
        htmlFor="charts"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Tipo de gráficos
      </label>
      <select
        id="charts"
        value={chartType}
        onChange={(e) => handleSelect(e)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option disabled defaultValue={""}>
          Elige un tipo de gráfico
        </option>

        {isMultiVariable ? (
          <>
            <option value="bar">Barras Agrupadas</option>
            <option value="stackedBar">Barras Apiladas</option>
            <option value="stackedColumn">Columnas Apiladas</option>
            <option value="column">Columnas Agrupadas</option>
            <option value="multiLine">Lineas Multiples</option>
            <option value="stackedArea">Área Apilada</option>
            <option value="polar">Polar</option>
            <option value="radar">Radar</option>
          </>
        ) : (
          <>
            <option value="bar">Barras</option>
            <option value="column">Columnas</option>
            {/* <option value="area">Área</option>
                  <option value="scatter">Dispersión</option>
                  <option value="line">Lineas</option> */}
            <option value="pie">Circular</option>
            <option value="donut">Dona</option>
          </>
        )}
      </select>
      {isMultiVariable ? (
        <div className="flex flex-row gap-8 flex-wrap mt-2">
          <div className="flex flex-row text-blue-500 fill-blue-500 items-center mt-2 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
            >
              <path d="M160-160v-440h160v440zm0-480v-160h160v160zm240 480v-320h160v320zm0-360v-160h160v160zm240 360v-200h160v200zm0-240v-160h160v160z" />
            </svg>
            Barras Agrupadas
          </div>

          <div className="flex flex-row text-blue-500 fill-blue-500 items-center mt-2 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
            >
              <path d="M640-160v-280h160v280zm-240 0v-640h160v640zm-240 0v-440h160v440z" />
            </svg>
            Barras Apiladas
          </div>
          <div className="flex flex-row text-blue-500 fill-blue-500 items-center mt-2 gap-2">
            <svg
              className="rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
            >
              <path d="M160-160v-440h160v440zm0-480v-160h160v160zm240 480v-320h160v320zm0-360v-160h160v160zm240 360v-200h160v200zm0-240v-160h160v160z" />
            </svg>
            Columnas Apiladas
          </div>

          <div className="flex flex-row text-blue-500 fill-blue-500 items-center mt-2 gap-2">
            <svg
              className="rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
            >
              <path d="M640-160v-280h160v280zm-240 0v-640h160v640zm-240 0v-440h160v440z" />
            </svg>
            Barras Apiladas
          </div>

          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <PiChartPolarThin className="h-5 w-5" />
            Polar
          </div>

          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <GiRadarCrossSection className="h-5 w-5" />
            Radar
          </div>
          <div className="flex flex-row text-blue-500 fill-blue-500 items-center mt-2 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
            >
              <path d="M120-160v-520l160 120 200-280 200 160h160v520zm200-120 160-220 280 218v-318H652L496-725 298-447l-98-73v144z" />
            </svg>
            Areas apiladas
          </div>
          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <PiChartDonutFill className="h-5 w-5" />
            Dona
          </div>
          <div className="flex flex-row text-blue-500 fill-blue-500 items-center mt-2 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
            >
              <path d="m140-100-60-60 300-300 160 160 284-320 56 56-340 384-160-160zm0-240-60-60 300-300 160 160 284-320 56 56-340 384-160-160z" />
            </svg>
            Lineas Multiples
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-8 flex-wrap mt-2">
          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <BsBarChartFill className="h-5 w-5" />
            Barras
          </div>

          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <PiChartBarHorizontalFill className="h-5 w-5" />
            Columnas
          </div>

          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <PiChartDonutFill className="h-5 w-5" />
            Dona
          </div>
          <div className="flex flex-row text-blue-500 items-center mt-2 gap-2">
            <BsFillPieChartFill className="h-5 w-5" />
            Pastel
          </div>
        </div>
      )}
    </div>
  );
};
