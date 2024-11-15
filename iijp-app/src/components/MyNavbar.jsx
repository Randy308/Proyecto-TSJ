import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
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
const MyNavbar = () => {
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
      console.log(`listaHeight ${listaHeight} listaWidth ${listaWidth} `)
      listaRef.current.style.top = `${
        rect.bottom - rect.height + listaHeight
      }px`;
      listaRef.current.style.left = `${
        rect.left  - listaWidth -180
      }px`;
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
    <div>
      <nav
        id="navbar-submenu"
        className="bg-white border-gray-200 dark:bg-gray-900"
      >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-1">
          <a className="flex m-2 p-2 items-center justify-center ms-2 md:me-24 bg-white rounded-lg custom:bg-transparent">
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
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <p className="text-sm  text-white dark:text-white">
              Sistemas Gestión y Analisis de Metricas de la Justicia Ordinaria
            </p>
          </div>
        </div>
      </nav>

      <nav
        id="navbar-principal"
        className="bg-white border-gray-200 dark:bg-gray-900"
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse custom:justify-between custom:w-full">
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              onClick={() => actualizarBoton()}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              {!menuOpen ? (
                <FaBars id="bars" key="first" className="w-7 h-7"></FaBars>
              ) : (
                <FaTimes id="close" key="second" className="w-7 h-7"></FaTimes>
              )}
            </button>
            <button
              type="button"
              ref={ajustesRef}
              onClick={() => actualizarAjustes(true)}
              className="flex text-sm dark:text-white hover:bg-gray-100 p-1 dark:hover:text-black  hover:text-black rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir ajustes</span>
              <FaGear className="w-5 h-5"></FaGear>
            </button>

            <div
              ref={listaRef}
              id="user-dropdown"
              onMouseLeave={stopTimer}
              onMouseEnter={handleMouseEnter}
              className={`z-50 my-4 text-base absolute list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
                settingsOpen ? " " : "hidden"
              }`}
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
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
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
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
                {renderLinks()}
              </ul>
            </div>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              menuOpen ? " " : "hidden"
            }`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {navItems.map((item, index) => {
                const isFirstItem = index === 0;
                return (
                  <li key={item.id || index}>
                    <NavLink 
                      to={item.path} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      >
                      {/* {isFirstItem && item.icon && <>{item.icon}&nbsp;</>} */}

                      {item.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MyNavbar;
