import type { FiltroNombre } from "./data";

export interface VariableOld{
    nombre:FiltroNombre
    datos:ListaData[]
}




export interface MagistradoItem extends ListaData {
  fecha_min: string;
  fecha_max: string;
}

export interface ListaData{
    id:number;
    nombre:string;
}

export interface Variable {
  departamento: ListaData[];
  sala: ListaData[];
  tipo_jurisprudencia: ListaData[];
  tipo_resolucion: ListaData[];
  forma_resolucion: ListaData[];
  magistrado: MagistradoItem[];
  materia: ListaData[];
  periodo?: ListaData[]; 
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
  
}
export interface Jurisprudencia {
  ratio?: string;
  descriptor?: string;
  restrictor?: string;
  tipo_jurisprudencia?: string;
}
