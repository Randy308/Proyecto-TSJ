export function transposeArray(data) {
  const transposed = {};
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!transposed[key]) {
        transposed[key] = [];
      }
      transposed[key].push(item[key]);
    });
  });

  const result = Object.entries(transposed).map(([key, values]) => [
    key,
    ...values,
  ]);
  const headers = result[0];

  const keyValueArray = result.slice(1).map((row) => {
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {});
  });
  return keyValueArray;
}

export const invertirXY = (matriz:any[][]) => {
  if (!matriz || matriz.length === 0) return [];

  const filas = matriz.length;
  const columnas = matriz[0].length;

  // Transponer
  const transpuesta = Array.from({ length: columnas }, (_, col) =>
    Array.from({ length: filas }, (_, fila) => matriz[fila][col])
  );

  return transpuesta;
};

export const obtenerEstadisticas = (data) => {
  if (!data || data.length === 0) return {};

  const valores = data[data.length - 1].slice(1, -1);
  if (!Array.isArray(valores) || valores.length === 0) return {};
  if (valores.some((val) => isNaN(val))) {
    console.error("Invalid data for statistics:", valores);
    return {};
  }
  const total =
    Math.round(valores.reduce((acc, val) => acc + Number(val), 0) * 100) / 100;
  const mean = Math.round((total / valores.length) * 100) / 100;
  const min = Math.round(Math.min(...valores) * 100) / 100;
  const max = Math.round(Math.max(...valores) * 100) / 100;
  const variance =
    Math.round(
      (valores.reduce((a, b) => a + (b - mean) ** 2, 0) / valores.length) * 100
    ) / 100;
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;
  console.log("Data received for statistics:", valores);
  return {
    mean,
    min,
    max,
    stdDev,
    variance,
  };
};
