import { FaBars, FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { navItems } from "./NavItems";
import "../Styles/main.css";
import { useToggleContext, useThemeContext } from "../Components/ThemeProvider";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = useThemeContext();
  const cambiarTema = useToggleContext();
  return (
    <header>
      <nav>
        <div className="bg-white mx-4 my-1 rounded-md custom:bg-transparent custom:flex custom:p-1">
          <img
            src="https://museo.umss.edu.bo/wp-content/uploads/2021/05/cropped-cropped-Logo7.png"
            alt="logo"
            className="second-logo"
          />
          <img
            src="https://www.umss.edu.bo/wp-content/uploads/2022/08/Logo_umss.png"
            alt="firt-logo"
            className="first-logo"
          />
        </div>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars
            id="bars"
            key="first"
            className={menuOpen ? "open" : ""}
          ></FaBars>
          <FaTimes
            id="close"
            key="second"
            className={menuOpen ? "open" : ""}
          ></FaTimes>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          {navItems.map((item, index) => {
            const isFirstItem = index === 0;
            return (
              <li key={item.id || index}>
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={isFirstItem ? "flex text-center items-center" : ""}
                >
                  {isFirstItem && item.icon && <>{item.icon}&nbsp;</>}
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div
          id="settings"
          className="p-2 hover:bg-white hover:text-black rounded-lg m-2"
        >
          <button onClick={cambiarTema} className="p-2">
                       <IoSunny className={["text-lg", isDark ? "hidden" : ""].join(' ')}/>
                       <FaMoon className={["text-lg", isDark ? "" : "hidden"].join(' ')}/>
          </button>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
