import type {
  DatosArray,
  Faceta,
  Facetas,
  ListaData,
  Variables,
} from "../types";

export const filterForm = (formData: object) => {
  return Object.fromEntries(
    Object.entries(formData).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all" &&
        value !== "Todos" &&
        value !== 0 &&
        value !== "Todas" &&
        (!(Array.isArray(value) && value.length === 0))
    )
  );
};

export const filterFormData = <T extends Record<string, unknown>>(formData: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(formData).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all" &&
        value !== "Todos" &&
        value !== 0 &&
        value !== "Todas" &&
        (!(Array.isArray(value) && value.length === 0))
    )
  ) as Partial<T>;
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
export const validateErrors = (lista: string[]) => {
  for (const item of lista) {
    if (item !== "") {
      return false;
    }
  }
  return true;
};

export const obtenerFacetas = (response: Facetas, data: Facetas): Facetas => {
  const lista = {} as Facetas;

  for (const [key, value] of Object.entries(response)) {
    // Validar que la clave existe en `data`
    if (key in data) {
      const tabla = key as keyof Facetas;
      const list1 = value as Faceta[];
      const list2 = data[tabla];

      if (!Array.isArray(list2)) continue;

      const map1 = Object.fromEntries(list1.map((item) => [item.id, item]));

      const merged = list2
        .filter((item) => map1[item.id])
        .map((item) => ({
          ...map1[item.id],
          ...item,
        }));

      lista[tabla] = merged as Faceta[];

    }
  }
  return lista;
};
export const filterParams = (
  resultado: DatosArray,
  data: Variables
): Variables => {
  const lista = {} as Variables;

  for (const [key, ids] of Object.entries(resultado)) {
    // Validar que la clave existe en `data`
    if (key in data) {
      const tabla = key as keyof Variables;
      const objeto = data[tabla];

      if (!Array.isArray(objeto)) continue;

      // Filtrar por IDs
      if(tabla === 'decision'){
        const filtrado = objeto.filter((item) => ids?.includes(item.grupo_id));
        lista[tabla] = filtrado as ListaData[];
        continue;
      }
      const filtrado = objeto.filter((item) => ids?.includes(item.id));
      
      lista[tabla] = filtrado as ListaData[]; // usamos `as any` para evitar conflicto de tipos exactos
    }
  }
  return lista;
};

export const filterAtributte = (
  atributo: string,
  tabla: keyof Facetas,
  data: Facetas
) => {
  if (
    !atributo ||
    atributo === "null" ||
    atributo === "undefined" ||
    atributo === ""
  ) {
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
  let string = nombre;
  if (nombre === "resuelve_fondo") {

    string = nombre.replace(/_/i, " ");
  } else {

    string = nombre.replace(/_/i, " de ");
  }

  // Función para poner tilde en "on" final
  const agregarTilde = (str: string) => {
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
