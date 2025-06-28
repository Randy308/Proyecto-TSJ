import type { FiltroNombre } from "./data";

export interface Variable{
    nombre:FiltroNombre
    datos:ListaData[]
}

export interface ListaData{
    id:number;
    nombre:string;
}


interface MagistradoItem extends ListaData {
  fecha_min: number;
  fecha_max: number;
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
