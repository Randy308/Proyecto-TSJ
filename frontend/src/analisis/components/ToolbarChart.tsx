import { useAnalisisContext } from "../../context";
import { titulo } from "../../utils/filterForm";
import { SelectType } from "./SelectType";

export const ToolbarChart = () => {
  const { names, pares, handlePair, invertirGrafico, isMultiVariable } =
    useAnalisisContext();

  return (
    <div className="flex flex-wrap flex-col items-start justify-start gap-4 p-4">
      <div>
        <SelectType />
      </div>
      {names && names.length > 2 && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
            Selecciona dos variables a graficar:
          </p>
          <div className="flex flex-wrap gap-2">
            {names.map((name: string) => (
              <button
                key={name}
                type="button"
                onClick={() => handlePair(name,"normal")}
                className={`px-3 py-1.5 rounded-lg text-white transition ${
                  pares.includes(name)
                    ? "bg-blue-600"
                    : "bg-blue-400 hover:bg-blue-500"
                }`}
              >
                {titulo(name)}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMultiVariable && (
        <button
          type="button"
          onClick={invertirGrafico}
          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition"
        >
          Invertir gráfico
        </button>
      )}
    </div>
  );
};
