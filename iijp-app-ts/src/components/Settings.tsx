import "../styles/navbar.css";
import React, { useEffect, useRef, useState } from "react";
import { MdSettingsInputComponent } from "react-icons/md";
import { HiMoon, HiOutlineLogin, HiSun } from "react-icons/hi";
import { FaGear, FaMoon, FaSun } from "react-icons/fa6";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "../context/ThemeProvider";
import AuthUser from "../auth/AuthUser";
import axios from "axios";
import Config from "../auth/Config";
import { is } from "date-fns/locale";

const Settings = ({ reversed = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isDark = useThemeContext();
  const ajustesRef = useRef(null);
  const listaRef = useRef(null);
  const toggleContext = useToggleContext();
  const { getToken, getLogout, can } = AuthUser();

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
      //console.log(`listaHeight ${listaHeight} listaWidth ${listaWidth} `);
      listaRef.current.style.top = `${
        rect.bottom - rect.height + listaHeight
      }px`;
      listaRef.current.style.left = `${rect.left - listaWidth - 180}px`;
    }
  };

  //   useEffect(() => {
  //     handleShowList();
  //   }, []);

  const logoutUser = async () => {
    try {
      const { data } = await Config.getLogout();
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
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
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
    }
  };

  return (
    <div>
      <div className="hidden sm:flex items-center justify-center gap-4">
        <button
          onClick={eventoBoton}
          className={`dark:text-gray-400 dark:hover:text-white ${
            reversed
              ? "text-gray-300 hover:text-gray-600"
              : "text-gray-800 hover:text-gray-400"
          } `}
        >
          {isDark ? (
            <HiSun className="w-7 h-7" />
          ) : (
            <HiMoon className="w-7 h-7" />
          )}
        </button>
        {getToken() && (
          <button
            onClick={logoutUser}
            className={`dark:text-gray-400 dark:hover:text-white ${
              reversed
                ? "text-gray-300 hover:text-gray-600"
                : "text-gray-800 hover:text-gray-400"
            } `}
          >
            <HiOutlineLogin className="flex-shrink-0 w-7 h-7 transition duration-75 " />
          </button>
        )}
      </div>
      <div className="relative sm:hidden">
        {" "}
        <button
          type="button"
          ref={ajustesRef}
          onClick={() => actualizarAjustes(true)}
          className={`flex text-sm  p-1  rounded-full md:me-0 focus:ring-4 dark:text-gray-400 dark:hover:text-white ${
            reversed
              ? "text-gray-300 hover:opacity-80"
              : "text-gray-800 hover:text-gray-400"
          } `}
          id="user-menu-button"
          aria-expanded="false"
        >
          <span className="sr-only">Abrir ajustes</span>
          <FaGear className="w-7 h-7 transition duration-75"></FaGear>
        </button>
        <div
          id="user-dropdown"
          onMouseLeave={stopTimer}
          onMouseEnter={handleMouseEnter}
          className={`z-50 top-5 w-44 right-0 absolute my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
            settingsOpen ? " " : "hidden"
          }`}
        >
          <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
              <a
                href="#"
                onClick={eventoBoton}
                className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
              >
                {isDark ? (
                  <HiSun className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                ) : (
                  <HiMoon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                )}
             
                <span className="ms-3">Cambiar tema</span>
              </a>
            </li>

            {renderLinks()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
