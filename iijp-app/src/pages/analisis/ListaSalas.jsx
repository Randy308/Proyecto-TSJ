import Lista from "../../components/Lista";
import React from "react";

const ListaSalas = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  return (
    <Lista
      url={`${endpoint}/all-salas`}
      texto="salas"
      enlace="/jurisprudencia/estadistica/sala"
    ></Lista>
  );
};

export default ListaSalas;
