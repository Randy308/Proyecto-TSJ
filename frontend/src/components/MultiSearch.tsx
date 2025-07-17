import React from "react";
import MultiSelect from "./MultiSelect";
import { type SearchField } from "../types/search";
import { SearchFieldInput } from "./SearchFieldInput";
interface MultiSearchProps {
  children?: React.ReactNode;
  searchFields: SearchField[];
  setSearchFields: React.Dispatch<React.SetStateAction<SearchField[]>>;
}
const MultiSearch = ({
  searchFields,
  setSearchFields,
  children,
}: MultiSearchProps) => {
  const [selectedOptions, setSelectedOptions] = React.useState<{ value: string; id: string }[]>([]);

  React.useEffect(() => {
    setSearchFields((prevFields) =>
      selectedOptions.map((option) => ({
        id: option.id,
        field: option.value,
        value: prevFields.find((f) => f.field === option.value)?.value || "",
        operator: prevFields.find((f) => f.field === option.value)?.operator || "AND",
      }))
    );
  }, [selectedOptions, setSearchFields]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 p-2 m-2">
        <MultiSelect
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
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
      <div className="flex justify-end p-2 m-2">
        {searchFields.length > 0 && children}
      </div>
    </div>
  );
};

export default MultiSearch;
