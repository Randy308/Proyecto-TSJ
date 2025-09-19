import React, { useEffect, useMemo } from "react";
import MultiSelect from "./MultiSelect";
import { type SearchField } from "../types/search";
import { SearchFieldInput } from "./SearchFieldInput";
import { IoMdSearch } from "react-icons/io";

interface MultiSearchProps {
  advancedSearch: (page: number) => Promise<void>;
  searchFields: SearchField[];
  type?: string;
  setSearchFields: React.Dispatch<React.SetStateAction<SearchField[]>>;
}
const MultiSearch = ({
  searchFields,
  setSearchFields,
  advancedSearch,
  type = "resoluciones",
}: MultiSearchProps) => {
  const [options, setOptions] = React.useState<SearchField[]>([]);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    advancedSearch(1);
  };

  const searchIcon = useMemo(() => <IoMdSearch className="w-4 h-4" />, []);
  useEffect(() => {
    setSearchFields((prevFields) =>
      options.map((option) => ({
        id: option.id,
        field: option.field,
        value: prevFields.find((f) => f.id === option.id)?.value || "",
        operator: prevFields.find((f) => f.id === option.id)?.operator || "AND",
      }))
    );
  }, [options, setSearchFields]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-col sm:flex-col flex-wrap gap-4 p-0 m-0 md:p-2 md:m-2">
        <MultiSelect
          type={type}
          selectedOptions={options}
          setSelectedOptions={setOptions}
        />

        {searchFields.length > 0 && (
          <div className="flex-1 grid grid-cols-1 gap-2">
            {searchFields.map((field, index) => (
              <SearchFieldInput
                key={`${field.field}-${index}`}
                field={field}
                index={index}
                updateField={(i, updated) =>
                  setSearchFields((prev) =>
                    prev.map((f, idx) => (idx === i ? { ...f, ...updated } : f))
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end p-0 m-0 md:p-2 md:m-2">
        {searchFields.length > 0 && (
          <button
            type="submit"
            className="p-2.5 ms-2 mt-4 flex gap-2 items-center text-sm font-medium text-white bg-red-octopus-700 rounded-lg border  hover:bg-red-octopus-800 focus:ring-4 focus:outline-none focus:ring-red-octopus-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {searchIcon}
            <span className="">Buscar</span>
          </button>
        )}
      </div>
    </form>
  );
};

export default MultiSearch;
