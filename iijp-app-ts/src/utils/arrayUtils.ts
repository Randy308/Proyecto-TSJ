import type { AnalisisData } from "../types";

// export const sumArray = (arrays, nombre = "Otros") => {
//   if (arrays.length === 0) return [];

//   const result = arrays[0].map((_, i) =>
//     arrays.reduce((sum, arr) => sum + arr[i], 0)
//   );
//   result.unshift(nombre);
//   return result;
// };

export const agregarTotalLista = (data: AnalisisData) => {
  if (!data || data.length === 0) {
    return [];
  }

  const encabezado = data[0].length > 2 ? [...data[0], "Total"] : data[0];
  console.log(encabezado);
  const datos = data.slice(1);

  const datosConTotales = datos.map((fila) => {
    const valores = fila.slice(1); // ignorar primera columna (nombre)
    console.log(valores.length);
    const suma = valores.reduce((acc, val) => Number(acc) + Number(val), 0);
    return valores.length > 1 ? [...fila, suma] : fila;
  });

  const columnasNumericas = datosConTotales[0].length - 1;
  const totalPorColumna = new Array(columnasNumericas).fill(0);

  datosConTotales.forEach((fila) => {
    for (let i = 1; i < fila.length; i++) {
      totalPorColumna[i - 1] += fila[i];
    }
  });

  const filaTotal = ["Total", ...totalPorColumna];

  return [encabezado, ...datosConTotales, filaTotal];
};

export const filtrarLista = (
  data: AnalisisData,
  total: number,
  limite: number
): AnalisisData => {
  if (!data || data.length === 0) return [];

  const encabezado = data[0];
  const datos = data.slice(1);
  const menores: (string | number)[][] = [];

  const filtrados = datos.filter((item) => {
    const lista = item.slice(1).map(Number); // Aseguramos números
    const sum = lista.reduce((partialSum, a) => partialSum + a, 0);
    if (sum / total < limite) {
      menores.push(item);
      return false;
    }
    return true;
  });

  if (menores.length > 0) {
    const otros = sumarFilas(menores);
    filtrados.push(["Otros", ...otros]);
  }

  return [encabezado, ...filtrados];
};

// Suma los valores numéricos de varias filas (excluyendo la primera columna)
function sumarFilas(filas: (string | number)[][]): number[] {
  if (filas.length === 0) return [];

  const numCols = filas[0].length - 1;
  const suma = new Array(numCols).fill(0);

  filas.forEach((fila) => {
    fila.slice(1).forEach((val, i) => {
      suma[i] += Number(val);
    });
  });

  return suma.map((v) => Math.round(v * 100) / 100);
}

// export const agregarSuma = (multiVariable:boolean, datos, nombre:string) => {
//   if (!datos || datos.length === 0) {
//     return [];
//   }

//   const totalCounts = { [nombre]: "Total" };

//   const processedData = multiVariable
//     ? datos.map((item) => {
//         const total = Object.entries(item).reduce(
//           (sum, [key, value]) => (key !== nombre ? sum + value : sum),
//           0
//         );
//         return { ...item, Total: total };
//       })
//     : datos;

//   processedData.forEach((entry) => {
//     Object.keys(entry).forEach((key) => {
//       if (key !== nombre) {
//         totalCounts[key] = (totalCounts[key] || 0) + entry[key];
//       }
//     });
//   });

//   const nuevaLista = [...processedData, totalCounts];
//   const headers = Object.keys(datos[0]).map(
//     (item) => item.charAt(0).toUpperCase() + item.slice(1)
//   );
//   const values = processedData.map((item) => Object.values(item));

//   return { nuevaLista, headers, values };
// };
