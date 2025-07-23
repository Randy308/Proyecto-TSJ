interface SelectProps {
  selected: string;
  handleSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  multiVariable: boolean;
}
export const SelectType = ({
  selected,
  handleSelect,
  multiVariable,
}: SelectProps) => {
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
        value={selected}
        onChange={(e) => handleSelect(e)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option disabled defaultValue={""}>
          Elige un tipo de gráfico
        </option>

        {multiVariable ? (
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
    </div>
  );
};
