import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { titulo } from "../utils/filterForm";

const Filtros = ({ nombre, data, formData, setFormData }) => {
  const selectedIds = formData[nombre] || [];

  const checkedAll = selectedIds.length === 0;

  const handleCheckboxChange = (event) => {
    const checkedId = Number(event.target.value);
    const isChecked = selectedIds.includes(checkedId);

    let updated;

    if (nombre === "periodo") {
      // Solo un valor permitido
      updated = isChecked ? [] : [checkedId];
    } else {
      // Comportamiento múltiple
      updated = isChecked
        ? selectedIds.filter((id) => id !== checkedId)
        : [...selectedIds, checkedId];
    }

    setFormData((prev) => ({
      ...prev,
      [nombre]: updated,
    }));
  };

  const handleCheckboxAll = () => {
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[nombre];
      return newFormData;
    });
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <div className="border-b border-gray-300 mb-4 dark:text-white text-black">
      <button
        className="flex justify-between items-center p-2 text-left w-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={handleClick}
      >
        <span className="uppercase font-bold">{titulo(nombre)}</span>
        {show ? (
          <FaMinus className="text-gray-500" />
        ) : (
          <FaPlus className="text-gray-500" />
        )}
      </button>

      <div>
        <div
          key="all"
          className={`${
            show ? "block" : "hidden"
          } pl-4 pr-2 py-1 text-gray-700 dark:text-gray-400`}
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={checkedAll}
              onChange={handleCheckboxAll}
            />
            Todos
          </label>
        </div>

        {data.map((item) => (
          <div
            key={item.id}
            className={`${
              show ? "block" : "hidden"
            } pl-4 pr-2 py-1 text-gray-700 dark:text-gray-400`}
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value={item.id}
                checked={selectedIds.includes(item.id)}
                onChange={handleCheckboxChange}
              />
              {item.nombre}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filtros;
