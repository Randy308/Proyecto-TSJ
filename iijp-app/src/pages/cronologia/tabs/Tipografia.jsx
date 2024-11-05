import React, { useEffect, useState } from "react";
import EstiloTitulos from "./EstiloTitulos";
import { headingItems } from "../../../data/HeadingItems.js";
import { useLocalStorage } from "../../../components/useLocalStorage";
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
