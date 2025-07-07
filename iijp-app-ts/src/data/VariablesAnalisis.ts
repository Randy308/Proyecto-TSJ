export interface Variable {
  tabla: string;
  columna: string;
  nombre: string;
  busqueda: boolean;
}
export const variablesAnalisis: Variable[] = [
  {
    tabla: "resolutions",
    columna: "precedente",
    nombre: "Precedente",
    busqueda: true,
  },
  {
    tabla: "resolutions",
    columna: "proceso",
    nombre: "Proceso",
    busqueda: true,
  },
  // { tabla: "resolutions", columna: "demandante", nombre: "Demandante", busqueda: true },
  // { tabla: "resolutions", columna: "demandado", nombre: "Demandado", busqueda: true },
  { tabla: "resolutions", columna: "maxima", nombre: "Maxima", busqueda: true },
  {
    tabla: "resolutions",
    columna: "sintesis",
    nombre: "Síntesis",
    busqueda: true,
  },
  {
    tabla: "jurisprudencias",
    columna: "restrictor",
    nombre: "Restrictor",
    busqueda: true,
  },
  {
    tabla: "jurisprudencias",
    columna: "ratio",
    nombre: "Ratio",
    busqueda: true,
  },
];
