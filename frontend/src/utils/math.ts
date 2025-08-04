import type { AnalisisData, Registro } from "../types";

export function transposeArray(data: AnalisisData): AnalisisData {
  if (!data.length) return [];

  const rowLength = data[0].length;
  const transposed: AnalisisData = [];

  for (let i = 0; i < rowLength; i++) {
    const newRow = data.map(row => row[i]);
    transposed.push(newRow);
  }

  return transposed;
}

export function reducirArray(
  data: Registro[],
  clavesAgrupar: string[]
): AnalisisData {

  const agrupado: Record<string, Registro> = data.reduce((acc, item) => {
    const key = clavesAgrupar.map((clave) => item[clave]).join("|");

    if (!acc[key]) {
      acc[key] = {} as Registro;
      clavesAgrupar.forEach((clave) => {
        acc[key][clave] = item[clave];
      });
      acc[key].cantidad = 0;
    }

    acc[key].cantidad += item.cantidad;
    return acc;
  }, {} as Record<string, Registro>);

  const resultado = Object.values(agrupado);

  return completarArray(resultado, clavesAgrupar[0], clavesAgrupar[1]);
}

function completarArray(
  data: Registro[],
  columnaX: string,
  columnaY: string
): AnalisisData {
  const filasPorNombre: Record<string, Record<string, number>> = {};
  const datosSet = new Set<string>();

  data.forEach((element) => {
    const nombre = String(element[columnaX]);
    const dato = String(element[columnaY]);
    const cantidad = element["cantidad"];

    if (!filasPorNombre[nombre]) {
      filasPorNombre[nombre] = {};
    }
    filasPorNombre[nombre][dato] = cantidad;
    datosSet.add(dato);
  });

  const datos = Array.from(datosSet).sort();
  const resultado: AnalisisData = [];

  // Encabezado
  const header = [columnaX, ...datos];
  resultado.push(header);

  // Filas con datos o ceros
  for (const nombre in filasPorNombre) {
    const fila: (string | number)[] = [nombre];
    for (const dato of datos) {
      fila.push(filasPorNombre[nombre][dato] ?? 0);
    }
    resultado.push(fila);
  }

  return resultado;
}


export const invertirXY = (matriz: AnalisisData) => {
  
  if (!matriz || matriz.length === 0) return [];

  const filas = matriz.length;
  const columnas = matriz[0].length;

  // Transponer
  const transpuesta = Array.from({ length: columnas }, (_, col) =>
    Array.from({ length: filas }, (_, fila) => matriz[fila][col])
  );

  return transpuesta;
};

export const obtenerEstadisticas = (data: AnalisisData) => {

  if (!data || data.length === 0) return {};

  const rawValues = data[data.length - 1].slice(1, -1);
  const valores = rawValues.map(Number).filter((v) => !isNaN(v));

  if (valores.length === 0) {
    console.error("No numeric data found for statistics:", rawValues);
    return {};
  }

  const total = valores.reduce((acc, val) => acc + val, 0);
  const mean = total / valores.length;
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const variance =
    valores.reduce((acc, val) => acc + (val - mean) ** 2, 0) / valores.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: Math.round(mean * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    variance: Math.round(variance * 100) / 100,
  };
};
