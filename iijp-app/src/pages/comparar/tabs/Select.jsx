import React, { useEffect, useState } from "react";

const Select = ({ fieldName, items, setFormData, formData }) => {
  const [selectedTipo, setSelectedTipo] = useState("all");

  useEffect(() => {
    // Update form data whenever selectedTipo changes
    const setParametros = (name, value) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    setParametros(fieldName, selectedTipo);
  }, [selectedTipo, setFormData, fieldName]);

  const cambiarOpcion = (event) => {
    setSelectedTipo(event.target.value);
  };

  const convertirTitulo = (name) => {
    return String(name)
      .replace(/_/g, " ") // Reemplaza los guiones bajos por espacios
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Convierte la primera letra de cada palabra a mayúscula
  };
  useEffect(() => {
    if (formData[fieldName] === "all") {
      setSelectedTipo("all");
    }
  }, [formData, fieldName]);
  return (
    <div className="max-w-sm">
      <label
        htmlFor={fieldName}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Filtrar por {convertirTitulo(fieldName)}:
      </label>
      <select
        id={fieldName}
        value={selectedTipo}
        onChange={cambiarOpcion}
        className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="todas" disabled>
          Selecciona una opción
        </option>
        <option value="all">Todos</option>
        {items.map((item, index) => (
          <option
            value={
              fieldName === "materia" || fieldName === "tipo_jurisprudencia"
                ? item.nombre
                : item.id
            }
            key={index}
          >
            {item.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
