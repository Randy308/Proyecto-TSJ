import { useMemo, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import type { SimpleSearchFormData } from "../types/search";

interface SimpleSelectProps {
  updateFormData: (key: keyof SimpleSearchFormData, value: string) => void;
  type?: "resoluciones" | "jurisprudencia";
}

const SimpleSelect = ({
  updateFormData,
  type = "resoluciones",
}: SimpleSelectProps) => {
  const list = useMemo(() => {
    const lista = [
      { value: "ratio", label: "Ratio" },
      { value: "descriptor", label: "Descriptor" },
      { value: "restrictor", label: "Restrictor" },
      { value: "contenido", label: "Contenido" },
      { value: "proceso", label: "Proceso" },
      { value: "sintesis", label: "Síntesis" },
      { value: "maxima", label: "Máxima" },
      { value: "precedente", label: "Precedente" },
    ];

    const options = [
      { value: "contenido", label: "Contenido" },
      { value: "proceso", label: "Proceso" },
      { value: "sintesis", label: "Síntesis" },
      { value: "maxima", label: "Maxima" },
      { value: "precedente", label: "Precedente" },
      // { value: "demandado", label: "Demandado" },
      // { value: "demandante", label: "Demandante" },
    ];

    if (type === "jurisprudencia") {
      return lista;
    }
    return options;
  }, [type]);

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelectChange = (id: string) => {
    updateFormData("campo", id);
    setSelected(id);
  };

  return (
    <a className="relative group border-2 p-2 rounded-lg flex justify-center items-center">
      {selected ? (
        <span className="text-sm capitalize text-gray-700">{selected}</span>
      ) : (
        <span className="text-sm capitalize text-gray-700">Buscar en...</span>
      )}
      <IoMdArrowDropdown className="ms-3 h-5 w-5" />
      <div className="absolute top-full z-40 scale-y-0 border-2 max-w-fit m-2 p-2 group-hover:scale-y-100 origin-top duration-200 left-1/2 -translate-x-1/2 bg-white rounded-lg text-black shadow-lg">
        <div className="flex flex-col gap-2 justify-start items-start">
          {list.map((item) => (
            <span
              key={item.value}
              onClick={() => handleSelectChange(item.value)}
              className="w-full text-left p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};

export default SimpleSelect;
