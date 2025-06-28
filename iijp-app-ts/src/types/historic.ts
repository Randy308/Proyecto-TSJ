interface Serie {
    periodo: string;
    cantidad: number;
}

export interface Historic {

    resoluciones:Serie[]
    jurisprudencia:Serie[]
    max_res:number;
    max_juris:number
}