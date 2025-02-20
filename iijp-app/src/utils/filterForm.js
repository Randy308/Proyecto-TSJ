
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
