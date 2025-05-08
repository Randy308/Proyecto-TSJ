import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { MdSettingsInputComponent } from "react-icons/md";
import { HiOutlineLogin } from "react-icons/hi";
import { FaGear } from "react-icons/fa6";
import { navItems } from "../data/NavItems";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "../context/ThemeProvider";
import AuthUser from "../auth/AuthUser";
import axios from "axios";
import LogoUmss from "../images/Logo_umss.png";
import Notifications from "./Notifications";
import { BiSolidDashboard } from "react-icons/bi";
import Settings from "./Settings";
const MyNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { getToken } = AuthUser();




  const actualizarBoton = () => {
    setMenuOpen((prevState) => !prevState);
    if (settingsOpen) {
      setSettingsOpen(false);
    }
  };

 

  const navLinks = () => {
    if (getToken()) {
      return (
        <>

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent  md:p-0 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700 ${isActive ? "dark:text-blue-600 text-main font-bold " : "text-red-octopus-600 md:hover:text-red-octopus-900 md:hover:bg-second  dark:text-white md:dark:hover:text-blue-500  dark:hover:text-white  "
                }`
              }
            >
              <BiSolidDashboard className="flex-shrink-0 w-5 h-5 transition duration-75" />
              <span className="ms-3">Dashboard</span>
            </NavLink>
          </li>
        </>
      );
    }

    return null;
  };



  return (
    <div >
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
              src={LogoUmss}
              alt="first-logo"
              className="h-12 self-center custom:hidden"
            />
          </a>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <p className="text-xs text-center  text-white dark:text-white max-w-[150px]">
              ESTA PÁGINA SE ENCUENTRA EN CONSTRUCCIÓN
            </p>
          </div>
        </div>
      </nav>

      <nav
        id="navbar-principal"
        className="bg-white border-gray-200 dark:bg-gray-900"
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex gap-2 w-full md:w-auto justify-between items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
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

            <div className="flex items-center gap-4">
              <Notifications />
              <Settings />
            </div>


          </div>

          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${menuOpen ? " " : "hidden"
              }`}
            id="navbar-user"
          >
            <ul className="text-sm md:text-xs  xl:text-sm flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {navItems.map((item, index) => {
                return (
                  <li key={item.id || index}>
                    <NavLink
                      to={item.path}



                      className={({ isActive }) =>
                        `flex items-center py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent  md:p-0 dark:hover:bg-gray-700 md:dark:hover:bg-transparent dark:border-gray-700 ${isActive ? "dark:text-blue-600 text-main font-bold p-4" : "text-red-octopus-600 md:hover:text-red-octopus-900 md:hover:bg-second  dark:text-white md:dark:hover:text-blue-500  dark:hover:text-white  "
                        }`
                      }
                    >
                      {item.icon}
                      <span className="ms-3">{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}

              {navLinks()}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MyNavbar;
