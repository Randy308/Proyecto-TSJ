export type FiltroNombre =
  | "tipo_resolucion"
  | "sala"
  | "magistrado"
  | "departamento"
  | "forma_resolucion"
  | "tipo_jurisprudencia"
  | "materia"
  | "periodo"
  | "proceso"
  | "demandante"
  | "demandado"
  | "maxima"
  | "sintesis"
  | "precedente"
  | "ratio"
  | "restrictor"
  | "descriptor";
  
export type FiltroBusqueda =
  | "tipo_resolucion"
  | "sala"
  | "magistrado"
  | "departamento"
  | "forma_resolucion"
  | "tipo_jurisprudencia"
  | "materia"
  | "periodo"

type AllOrNumber = number | "all";

export interface Datos {
  tipo_resolucion: AllOrNumber;
  sala: AllOrNumber;
  magistrado: AllOrNumber;
  departamento: AllOrNumber;
  forma_resolucion: AllOrNumber;
  tipo_jurisprudencia: AllOrNumber;
  materia: AllOrNumber;
  periodo?: AllOrNumber;
}

export interface DatosArray {
  tipo_resolucion?: number[];
  sala?: number[];
  magistrado?: number[];
  departamento?: number[];
  forma_resolucion?: number[];
  tipo_jurisprudencia?: number[];
  materia?: number[];
  periodo?: number[];
}

export interface ListaX {
  name: FiltroNombre;
  ids: (number|string)[];
}

export interface ListaXTerminos {
  name: FiltroNombre;
  ids: string[];
}

export interface FormListaX  {
  nombre: FiltroNombre;
  variable: number[];
  periodo: string;
  departamento: string;
}



export interface DatosArrayForm {
  tipo_resolucion?: number[];
  sala?: number[];
  magistrado?: number[];
  departamento?: number[];
  forma_resolucion?: number[];
  tipo_jurisprudencia?: number[];
  materia?: number[];
  periodo?: number[];
  page:number;
  busqueda?: string;
  descriptor?: number;
}

export type AnalisisData = (string | number)[][];


export interface ReceivedForm {
  nombre: string;
  variable: string[];
}


export type SingleChartType = "bar" | "line" | "pie" | "scatter" | "area"| "donut" | "column";
export type DualChartType = "stackedBar" | "stackedColumn" | "column" | "bar" | "multiLine" | "stackedArea" | "polar" | "radar" | "donut";
export type ChartType = SingleChartType | DualChartType;