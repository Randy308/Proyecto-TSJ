import type { AnalisisData } from "../types";

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


// export function transposeArray(data: AnalisisData) {
//   const transposed:object = {};
//   data.forEach((item) => {
//     Object.keys(item).forEach((key) => {
//       if (!transposed[key]) {
//         transposed[key] = [];
//       }
//       transposed[key].push(item[key]);
//     });
//   });

//   const result = Object.entries(transposed).map(([key, values]) => [
//     key,
//     ...values,
//   ]);
//   const headers = result[0];

//   const keyValueArray = result.slice(1).map((row) => {
//     return headers.reduce((obj, header, index) => {
//       obj[header] = row[index];
//       return obj;
//     }, {});
//   });
//   return keyValueArray;
// }

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

  console.log("Datos para estadísticas:", data);
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
