import React, { useEffect, useState } from "react";

const Select = ({ fieldName, items, setFormData, formData }) => {
  const [selectedTipo, setSelectedTipo] = useState(formData[fieldName] || "all");

  useEffect(() => {
    const setParametros = (name, value) => {
      const updatedFormData = {
        ...formData,
        [name]: value,
      };

      setFormData(updatedFormData);
    };

    setParametros(fieldName, selectedTipo);
  }, [selectedTipo, fieldName]);

  const cambiarOpcion = (event) => {
    setSelectedTipo(event.target.value);
  };

  const convertirTitulo = (name) => {
    return String(name)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  useEffect(() => {
    if (formData[fieldName] === "all") {
      setSelectedTipo("all");
    }
  }, [formData, fieldName]);


  if (fieldName === "departamento") {
    return;
  }
  return (
    <div className="full-w">
      <label
        htmlFor={fieldName}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-start"
      >
        Filtrar por {convertirTitulo(fieldName)}:
      </label>
      <select
        id={fieldName}
        value={selectedTipo}
        onChange={cambiarOpcion}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="todas" disabled>
          Selecciona una opción
        </option>
        <option value="all">Todos</option>
        {items.map((item, index) => (
          <option
            value={item.id }
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
