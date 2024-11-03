
import React from "react";
import Lista from "../../components/Lista";

const ListaMagistrados = () => {
  const endpoint = process.env.REACT_APP_BACKEND;

  return (
    <Lista
      url={`${endpoint}/magistrados`}
      texto="magistrados"
      enlace="/jurisprudencia/magistrado"
    ></Lista>
  );
};

export default ListaMagistrados;
