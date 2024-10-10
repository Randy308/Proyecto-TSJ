import { FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { navItems } from "../data/NavItems";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "./ThemeProvider";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isDark = useThemeContext();
  const ajustesRef = useRef(null);
  const listaRef = useRef(null);
  const cambiarTema = useToggleContext();

  const actualizarAjustes = () => {
    setSettingsOpen((prevState) => !prevState);
    handleShowList();
  };

  const handleShowList = () => {
    if (ajustesRef.current && listaRef.current) {
      const rect = ajustesRef.current.getBoundingClientRect();
      const listaHeight = ajustesRef.current.offsetHeight;
      const listaWidth = listaRef.current.offsetWidth;
      listaRef.current.style.top = `${rect.bottom + listaHeight + 10}px`;
      listaRef.current.style.left = `${rect.left - listaWidth -10 }px`;
    }
  };

    useEffect(() => {
      handleShowList();
    }, [])
    
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
            alt="first-logo"
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
            <IoSunny
              className={["text-lg", isDark ? "hidden" : ""].join(" ")}
            />
            <FaMoon className={["text-lg", isDark ? "" : "hidden"].join(" ")} />
          </button>
        </div>
        <div className="p-2 m-2 hover:bg-white hover:text-black rounded-lg">
          <a ref={ajustesRef} onClick={() => actualizarAjustes(true)}>
            <FaGear></FaGear>
          </a>
          <div
            ref={listaRef}
            id="lista-ajustes"
            className={settingsOpen ? "show" : ""}
          >
            <ul className="flex flex-col">
              <li>Hola mundo</li>
              <li>Hola mundo</li>
              <li>Hola mundo</li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
