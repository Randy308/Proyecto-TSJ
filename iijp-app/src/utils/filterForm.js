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
