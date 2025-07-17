export interface SimpleSearchFormData {
  campo: string;
  busqueda: string;
}
export interface AdvancedSearchFormData {
  search: SearchFormData;
  filtros: {
    categorias: string[];
    fuentes: string[];
    etiquetas: string[];
    rangoFechas: { desde: Date | null; hasta: Date | null };
  };
}

export interface SearchFormData {
  field: string[];
  value: { [key: string]: string };
  operator: { [key: string]: string };
}


export type SearchField = {
  field: string;       // El nombre del campo (de selectedOptions)
  value: string;       // El valor escrito en el input
  operator: "AND" | "OR" | "NOT"; // El operador entre esta y la anterior
};
