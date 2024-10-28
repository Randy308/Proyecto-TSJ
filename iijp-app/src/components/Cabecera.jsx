import React, { useEffect, useState } from "react";
import { FaArrowDownAZ, FaArrowUpAZ } from "react-icons/fa6";

const Cabecera = ({ titulo,valor, setFormData, id, setVisible , visible }) => {
  const identificador = `cabecera-${titulo}`;
  const [activo, setActivo] = useState(1); // Initial state

  useEffect(() => {
    if( visible != id){
      setActivo(1);
    }
  }, [visible]);
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


      if (variable && variable.nombre !== "none") {
        setParametros("variable", valor);
        setParametros("orden", variable.nombre);
        setVisible(id);
      } else {
        //setParametros("variable", null); // Reset sorting
        //setParametros("orden", null);
        setVisible(null);
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
