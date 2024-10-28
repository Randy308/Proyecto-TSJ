import React, { useEffect, useState } from "react";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";

const Cabecera = ({ titulo, setFormData, estadoInicial }) => {
  const identificador = `cabecera-${titulo}`;
  const [activo, setActivo] = useState(estadoInicial); // Initial state

  useEffect(() => {
    console.log("Current state (activo):", activo);
  }, [activo]);
  const setParametros = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const variables = [
    { id: 1, nombre: "none", icono: <div className="w-3 h-3"></div> },
    { id: 2, nombre: "asc", icono: <FaArrowDownAZ /> },
    { id: 3, nombre: "desc", icono: <FaArrowUpAZ /> },
  ];

  const handleClick = () => {
    const nextState = activo === 3 ? 1 : activo + 1;
    setActivo(nextState);

    const variable = variables.find((item) => item.id === nextState);

    // Update parameters based on sorting state
    if (variable && variable.nombre !== "none") {
      setParametros("variable", titulo);
      setParametros("orden", variable.nombre);
    } else {
      setParametros("variable", null); // Reset sorting
      setParametros("orden", null);
    }
  };

  return (
    <th
      scope="col"
      className="px-6 py-3 hover:cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-row gap-4 items-center justify-center">
        {titulo}
        <span id={identificador}>
          {variables.find((item) => item.id === activo)?.icono}
        </span>
      </div>
    </th>
  );
};

export default Cabecera;
