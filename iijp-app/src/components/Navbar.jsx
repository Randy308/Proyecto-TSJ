import { FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaCloudMoon, FaDatabase } from "react-icons/fa6";
import { FaSun } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSettingsInputComponent } from "react-icons/md";
import { HiOutlineLogin } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { RiDashboard2Fill } from "react-icons/ri";
import { MdLiveHelp } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { navItems } from "../data/NavItems";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "./ThemeProvider";

import AuthUser from "../auth/AuthUser";
import axios from "axios";
import Portal from "./Portal";
function Navbar() {
  //localStorage.clear();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isDark = useThemeContext();
  const ajustesRef = useRef(null);
  const listaRef = useRef(null);
  const toggleContext = useToggleContext();

  const [timer, setTimer] = useState(null);

  const restartTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      setSettingsOpen(false);
    }, 2000);
    setTimer(newTimer);
  };

  const handleMouseEnter = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  const stopTimer = () => {
    if (timer) {
      clearTimeout(timer);
      setSettingsOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const eventoBoton = () => {
    toggleContext();
    setTimeout(() => {
      setSettingsOpen(false);
      if (window.innerWidth <= 720 && menuOpen) {
        setMenuOpen(false);
      }
    }, 700);
  };
  const actualizarBoton = () => {
    setMenuOpen((prevState) => !prevState);
    if (settingsOpen) {
      setSettingsOpen(false);
    }
  };
  const actualizarAjustes = () => {
    const nextState = !settingsOpen;

    if (nextState) {
      restartTimer();
      setSettingsOpen(nextState);
      handleShowList();
    } else {
      stopTimer();
    }
  };

  const handleShowList = () => {
    if (ajustesRef.current && listaRef.current) {
      const rect = ajustesRef.current.getBoundingClientRect();
      const listaHeight = ajustesRef.current.offsetHeight;
      const listaWidth = listaRef.current.offsetWidth;
      if (window.innerWidth <= 720) {
        listaRef.current.style.top = "auto";
        listaRef.current.style.left = "auto";
      } else {
        listaRef.current.style.top = `${
          rect.bottom - rect.height + listaHeight
        }px`;
        listaRef.current.style.left = `${rect.left + rect.width - 180}px`;
      }
    }
  };

  useEffect(() => {
    handleShowList();
  }, []);
  const { getToken, getLogout, rol } = AuthUser();

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
          {rol === "admin" && (
            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
              <li>
                <NavLink
                  to="/admin"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <RiDashboard2Fill className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Dashboard</span>
                </NavLink>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FaUsers className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Usuarios
                  </span>
                </a>
              </li>
              <li>
                <NavLink
                  to="/admin/subir"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FaDatabase className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Resoluciones
                  </span>
                </NavLink>
              </li>
            </ul>
          )}

          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
              >
                <MdSettingsInputComponent className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Configuración</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={logoutUser}
                className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
              >
                <HiOutlineLogin className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Portal
              setSettingsOpen={setSettingsOpen}
              titulo={"Iniciar sesión"}
              status={"login"}
            />
          </li>
        </>
      );
    }
  };

  return (
    <header className="overflow-x-hidden">
      <nav>
        <a className="flex m-2 items-center justify-center ms-2 md:me-24 bg-white rounded-lg custom:bg-transparent">
          <img
            src="https://museo.umss.edu.bo/wp-content/uploads/2021/05/cropped-cropped-Logo7.png"
            alt="logo"
            className="hidden h-12 custom:block"
          />
          <img
            src="https://www.umss.edu.bo/wp-content/uploads/2022/08/Logo_umss.png"
            alt="first-logo"
            className="h-12 self-center custom:hidden"
          />
        </a>
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
        <div id="gear" className={` ${menuOpen ? "open" : ""}`}>
          <a
            id="boton-ajustes"
            ref={ajustesRef}
            className="bg-transparent me-3 hover:bg-gray-100 hover:text-black text-white font-semibold
           rounded-xl p-3 flex items-center justify-center"
            onClick={() => actualizarAjustes(true)}
          >
            <FaGear className="w-5 h-5"></FaGear>
          </a>
        </div>
      </nav>

      <div
        ref={listaRef}
        id="dropdown"
        onMouseLeave={stopTimer}
        onMouseEnter={handleMouseEnter}
        className={`z-10 absolute  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${
          settingsOpen ? " " : "hidden"
        }`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <MdLiveHelp className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="ms-3">Ayuda</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <label className="inline-flex items-center me-5 cursor-pointer">
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {isDark ? "Tema Oscuro" : "Tema Claro"}
                </span>

                <input
                  type="checkbox"
                  checked={!isDark}
                  onChange={eventoBoton}
                  className="sr-only peer"
                />

                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
              </label>
            </a>
          </li>
        </ul>
        {renderLinks()}
      </div>
    </header>
  );
}
export default Navbar;
