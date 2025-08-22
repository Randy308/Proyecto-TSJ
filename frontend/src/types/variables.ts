import type { FiltroNombre } from "./data";

export interface VariableOld {
  nombre: FiltroNombre;
  datos: ListaData[];
}

export interface ListaData {
  id: number;
  nombre: string;
  grupo_id?: number;
  // fecha_min?: string;
  // fecha_max?: string;
}

export interface Faceta {
  id: number;
  nombre?: string;
  grupo?: string;
  grupo_id?: number;
  cantidad?: number;
  fecha_min?: string;
  fecha_max?: string;
}

export interface Facetas {
  departamento: Faceta[];
  sala: Faceta[];
  tipo_jurisprudencia: Faceta[];
  tipo_resolucion: Faceta[];
  forma_resolucion: Faceta[];
  magistrado: Faceta[];
  materia: Faceta[];
  periodo?: Faceta[];
  categoria?: Faceta[];
  resuelve_fondo?: Faceta[];
  decision?: Faceta[];
}
export interface Variables {
  departamento: ListaData[];
  sala: ListaData[];
  tipo_jurisprudencia: ListaData[];
  tipo_resolucion: ListaData[];
  forma_resolucion: ListaData[];
  magistrado: ListaData[];
  materia: ListaData[];
  periodo?: ListaData[];
  resuelve_fondo?: Faceta[];
  decision?: Faceta[];
}

export interface Resolucion {
  nro_resolucion?: string;
  nro_expediente?: string;
  fecha_emision?: string;
  tipo_resolucion?: string;
  departamento?: string;
  sala?: string;
  magistrado?: string;
  forma_resolucion?: string;
  proceso?: string;
  demandante?: string;
  demandado?: string;
  maxima?: string;
  sintesis?: string;
  contenido?: string;
  id?: number;
}
export interface Jurisprudencia {
  ratio?: string;
  descriptor?: string;
  restrictor?: string;
  tipo_jurisprudencia?: string;
}
