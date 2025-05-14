export const filterForm = (formData) => {
  return Object.fromEntries(
    Object.entries(formData).filter(
      ([key, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "all" &&
        value !== "Todos" &&
        value !== "Todas"
    )
  );
};

export const validateErrors = (lista) => {
  for (const item of lista) {
    if (item !== "") {
      return false;
    }
  }
  return true;
};
export const filterParams = (resultado, data) => {
  const lista = {};

  for (const [key, ids] of Object.entries(resultado)) {
    const tabla = key;
    const objeto = data[tabla];

    if (!Array.isArray(objeto)) continue;

    // Filtrar los valores que están en la lista de IDs
    const filtrado = objeto.filter((item) => ids.includes(item.id));

    lista[tabla] = filtrado;
  }
  return lista;
};

export const titulo = (nombre) => {
  const regex = /_/i;
  return (nombre.replace(regex, " de "));
};
