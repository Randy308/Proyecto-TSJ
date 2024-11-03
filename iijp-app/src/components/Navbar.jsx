import { FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { navItems } from "../data/NavItems";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "./ThemeProvider";
import Config from "../auth/Config";
import AuthUser from "../auth/AuthUser";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isDark = useThemeContext();
  const ajustesRef = useRef(null);
  const listaRef = useRef(null);
  const cambiarTema = useToggleContext();

  const eventoBoton = () => {
    cambiarTema();
    setSettingsOpen(false);
    if (window.innerWidth <= 720 && menuOpen) {
      setMenuOpen(false);
    }
  };
  const actualizarBoton = () => {
    setMenuOpen((prevState) => !prevState);
    if (settingsOpen) {
      setSettingsOpen(false);
    }
  };
  const actualizarAjustes = () => {
    setSettingsOpen((prevState) => !prevState);
    handleShowList();
  };

  const handleShowList = () => {
    if (ajustesRef.current && listaRef.current) {
      const rect = ajustesRef.current.getBoundingClientRect();
      const listaHeight = ajustesRef.current.offsetHeight;
      const listaWidth = listaRef.current.offsetWidth;

      if (window.innerWidth <= 720) {
        listaRef.current.style.top = `auto`;
        listaRef.current.style.left = `auto`;
      } else {
        listaRef.current.style.top = `${rect.bottom + listaHeight / 2}px`;
        listaRef.current.style.left = `${rect.left - listaWidth / 2}px`;
      }
    }
  };
  const { getToken, getLogout } = AuthUser();

  const logoutUser = () => {
    Config.getLogout("/logout")
      .then(({ data }) => {
        if (data.success) {
          console.log(data);
          getLogout();
        }
      })
      .catch(({ err }) => {
        console.log("Existe un error " + err);
      });
  };
  const renderLinks = () => {
    if (getToken()) {
      return (
        <>
          <li className="p-2">
            <a onClick={logoutUser}>Logout</a>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="p-2">
            <a href="/login">Login</a>
          </li>
        </>
      );
    }
  };

  useEffect(() => {
    handleShowList();
  }, []);

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
        <div className="menu" onClick={() => actualizarBoton()}>
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
                  onClick={() => actualizarBoton()}
                  className={isFirstItem ? "flex text-center items-center" : ""}
                >
                  {isFirstItem && item.icon && <>{item.icon}&nbsp;</>}
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div id="gear" className={`rounded-lg ${menuOpen ? "open" : ""}`}>
          <button
            id="boton-ajustes"
            ref={ajustesRef}
            className="flex items-center justify-center"
            onClick={() => actualizarAjustes(true)}
          >
            <FaGear></FaGear>
          </button>
        </div>
      </nav>
      <div
        ref={listaRef}
        id="lista-ajustes"
        className={settingsOpen ? "show" : ""}
      >
        <ul className="flex flex-col">
          <li>
            <button
              onClick={eventoBoton}
              type="button"
              className="p-2 flex flex-row justify-between gap-4 w-full"
            >
              Tema
              <IoSunny
                className={["text-lg", isDark ? "hidden" : ""].join(" ")}
              />
              <FaMoon
                className={["text-lg", isDark ? "" : "hidden"].join(" ")}
              />
            </button>
          </li>
          {renderLinks()}
          <li className="p-2">Ajustes</li>
        </ul>
      </div>
    </header>
  );
}
export default Navbar;
