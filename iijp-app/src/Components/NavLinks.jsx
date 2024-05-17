import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useState } from "react";
const NavLinks = () => {

  const [dropdown, setDropdown] = useState(false);
  return (
    <div className="fa">
      <div id="test-prueba" className="text-center flex items-center rounded-lg p-3 hover:bg-white hover:text-black cursor-pointer" onClick={() => setDropdown(!dropdown)}>
        Observatorio&nbsp;
        <IoMdArrowDropdown />
      </div>
      <div className="bg-white"><ul id="observatorio-menu" className={"flex flex-col text-black bg-white rounded-lg border-solid border-2 border-black" + (dropdown ? " open" : "")}
>
        <li className="submenu p-1">
          <NavLink to="./Cronologias" onClick={() => setDropdown(!dropdown)}>Cronologias</NavLink>
        </li>
       
        <li className="submenu p-1">
          <NavLink to="./Dinamicas" onClick={() => setDropdown(!dropdown)}>Dinamicas</NavLink>
        </li>
      </ul></div>
    </div>
  );
};

export default NavLinks;
