import { useMemo } from "react";
import type { SimpleSearchFormData } from "../types/search";
import SelectDropdown from "./SelectDropdown";

interface SimpleSelectProps {
  updateFormData: (key: keyof SimpleSearchFormData, value: string) => void;
  type?: "resoluciones" | "jurisprudencia";
}

interface Select {
  id: string;
  nombre: string;
}

const SimpleSelect = ({
  updateFormData,
  type = "resoluciones",
}: SimpleSelectProps) => {
  const list = useMemo(() => {
    const lista = [
      { id: "ratio", nombre: "Ratio" },
      { id: "descriptor", nombre: "Descriptor" },
      { id: "restrictor", nombre: "Restrictor" },
      { id: "proceso", nombre: "Proceso" },
      { id: "sintesis", nombre: "Síntesis" },
      { id: "maxima", nombre: "Máxima" },
      { id: "precedente", nombre: "Precedente" },
      { id: "nro_resolucion", nombre: "Número de Resolución" },
      { id: "nro_expediente", nombre: "Número de Expediente" },
    ];

    const options = [
      { id: "contenido", nombre: "Contenido" },
      { id: "proceso", nombre: "Proceso" },
      { id: "sintesis", nombre: "Síntesis" },
      { id: "maxima", nombre: "Maxima" },
      { id: "precedente", nombre: "Precedente" },
      { id: "nro_resolucion", nombre: "Número de Resolución" },
      { id: "nro_expediente", nombre: "Número de Expediente" },
      // { id: "demandado", nombre: "Demandado" },
      // { id: "demandante", nombre: "Demandante" },
    ];

    if (type === "jurisprudencia") {
      return lista;
    }
    return options;
  }, [type]);

  const handleSelectChange = (item: unknown) => {
    const element = item as Select;
    updateFormData("campo", element.id);
  };

  return <SelectDropdown handleSelect={handleSelectChange} list={list} />;
};

export default SimpleSelect;
