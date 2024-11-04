import React from "react";
import EstiloTitulos from "./EstiloTitulos";
import { headingItems } from "../../../data/HeadingItems.js";
const Tipografia = () => {
  
  return (
    <div>
      {headingItems.map((item, index) => (
        <EstiloTitulos
          key={index}
          titulo={item.titulo}
          estiloDefault={item.estiloDefault}
        />
      ))}
    </div>
  );
};

export default Tipografia;
