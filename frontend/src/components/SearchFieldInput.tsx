import type { SearchField } from "../types/search";
import { Etiquetas } from "./Etiquetas";

export const SearchFieldInput = ({
  field,
  index,
  updateField,
}: {
  field: SearchField;
  index: number;
  updateField: (index: number, updated: Partial<SearchField>) => void;
}) => {
  return (
    <div className="flex flex-row pt-1 items-center gap-2">
      {index > 0 && (
        <Etiquetas
          selected={field.operator}
          onChange={(op) =>
            updateField(index, { operator: op as "AND" | "OR" | "NOT" })
          }
        />
      )}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder={`Buscar en ${field.field}`}
          value={field.value}
          onChange={(e) => updateField(index, { value: e.target.value })}
          className="bg-gray-50 outline-none  peer text-xs md:text-md mt-4 border border-gray-300 text-gray-900 rounded-lg focus:border-2 focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <span className="absolute capitalize px-2 text-gray-400  peer-focus:text-blue-500 left-4 top-2 bg-white dark:bg-[#242e42] text-xs">
          {field.field}
        </span>
      </div>
    </div>
  );
};
