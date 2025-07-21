export interface ResueleveFondo{
    nombre:string;
    slug?:string;
    sala_id:number;
    tipo_decision:number
}

export interface FormaDecision{
    grupo_decision:number;
    forma_resolucion_id:number;
    resuelve_fondo_id:number;
    tipo_decision?:string;

}