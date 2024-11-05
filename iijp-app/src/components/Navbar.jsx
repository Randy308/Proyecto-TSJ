import { FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { navItems } from "../data/NavItems";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "./ThemeProvider";

import AuthUser from "../auth/AuthUser";
import axios from "axios";
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

  const logoutUser = async () => {
    await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });

    try {
      const endpoint = process.env.REACT_APP_BACKEND;
      const { data } = await axios.post(
        `${endpoint}/v1/auth/logout`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + getToken(),
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        console.log(data);
        getLogout();
      }
    } catch (error) {
      console.log("Error al realizar la solicitud: " + error.message);
    }
  };
  const renderLinks = () => {
    if (getToken()) {
      return (
        <>
          <li className="p-2 hover:cursor-pointer rounded-md hover:bg-gray-200">
            <a onClick={logoutUser}>Cerrar sesión</a>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="p-2 hover:cursor-pointer hover:bg-gray-200">
            <a href="/login">Iniciar sesión</a>
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
              className="p-2 flex flex-row justify-between gap-4 w-full hover:bg-gray-200"
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
