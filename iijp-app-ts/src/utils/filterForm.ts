import type { DatosArray, FiltroNombre, ListaData, MagistradoItem, Variable } from "../types";

export const filterForm = (formData: object) => {
  return Object.fromEntries(
    Object.entries(formData).filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all" &&
        value !== "Todos" &&
        value !== 0 &&
        value !== "Todas"
    )
  );
};

export const filterTitle = (string: string) => {
  const splitString = string.split("/");
  const tail = splitString.slice(1);
  for (let i = 0; i < tail.length; i++) {
    try {
      tail[i] = tail[i].replace(/^0+/, "");
    } catch (error) {
      console.error("Error processing tail:", error);
    }
  }
  return tail.join("/");
};
export const validateErrors = (lista) => {
  for (const item of lista) {
    if (item !== "") {
      return false;
    }
  }
  return true;
};
export const filterParams = (
  resultado: DatosArray,
  data: Variable
): Variable => {
  const lista = {} as Variable;

  for (const [key, ids] of Object.entries(resultado)) {
    // Validar que la clave existe en `data`
    if (key in data) {
      const tabla = key as keyof Variable;
      const objeto = data[tabla];

      if (!Array.isArray(objeto)) continue;

      // Filtrar por IDs
      const filtrado = objeto.filter((item) => ids?.includes(item.id));

      lista[tabla] = filtrado as ListaData[] & MagistradoItem[]; // usamos `as any` para evitar conflicto de tipos exactos
    }
  }

  console.log("Lista filtrada:", lista);
  return lista;
};

export const filterAtributte = (atributo: string, tabla: string, data) => {
  if (!atributo || atributo === "null" || atributo === "undefined") {
    return "";
  }
  const objeto = data[tabla];

  if (!Array.isArray(objeto)) return atributo;

  // Filtrar los valores que están en la lista de IDs
  const filtrado = objeto.filter((item) => item.id === Number(atributo));
  return filtrado.length > 0 ? filtrado[0].nombre : atributo;
};

export const titulo = (nombre: string) => {
  // Reemplaza el primer guion bajo por " de "
  const string = nombre.replace(/_/i, " de ");

  // Función para poner tilde en "on" final
  const agregarTilde = (str) => {
    // Si termina en "on" y no tiene tilde ya, reemplaza por "ón"
    return str.endsWith("on") ? str.slice(0, -2) + "ón" : str;
  };

  const conTilde = agregarTilde(string);

  return conTilde.charAt(0).toUpperCase() + conTilde.slice(1);
};

export const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 25 + Math.floor(Math.random() * 50); // Saturation between 25% and 75%
  const lightness = 70 + Math.floor(Math.random() * 20); // Lightness between 70% and 90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
