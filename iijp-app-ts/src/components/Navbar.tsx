import "../styles/navbar.css";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "../styles/main.css";
import LogoUmss from "../images/Logo_umss.png";
import Settings from "./Settings";
import { IoMdArrowDropdown } from "react-icons/io";
import { navItems } from "../data/NavItems";
import { AuthUser } from "../auth";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const { getToken } = AuthUser();

  const actualizarBoton = () => {
    setMenuOpen((prevState) => !prevState);
    if (settingsOpen) {
      setSettingsOpen(null);
    }
  };

  const handleMenuClick = (id:number) => {
    if (isOpen === id) {
       setIsOpen(null);
    } else {
      setIsOpen(id);
    }
  };

  const closeMenus = () => {
    setIsOpen(null);
    setMenuOpen(null);
  };

  const navLinks = () => {
    if (getToken()) {
      return (
        <>
          <li>
            <NavLink
              to="/dashboard"
              className={`flex items-center  rounded-xl p-2 text-gray-200 hover:text-white dark:hover:text-white`}
            >
              <span>Dashboard</span>
            </NavLink>
          </li>
        </>
      );
    }

    return null;
  };

  return (
    <nav
      id="navbar-submenu"
      className="bg-white relative border-gray-200 dark:bg-gray-900"
    >
      <div className="flex justify-between items-center mx-auto max-w-screen-xl p-1">
        <div className="flex gap-2 md:w-auto justify-between items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            onClick={() => actualizarBoton()}
            className="p-2 z-50 absolute md:relative text-gray-200 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        </div>
        <a className="flex items-center justify-center m-1 bg-white rounded-lg">
          <img src={LogoUmss} alt="first-logo" className="h-16 self-center " />
        </a>
        <div
          className={`items-center md:flex-1 md:px-4 justify-center md:flex md:w-auto md:order-1 ${
            menuOpen ? " " : "hidden"
          }`}
          id="navbar-user"
        >
          <ul className="flex flex-col justify-start md:items-center z-40 left-0 top-0 w-full fixed md:relative bg-main text-black dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent md:mx-4 md:flex-row md:space-x-8 md:border-0 md:text-white h-screen md:h-auto pt-20 md:pt-0 md:space-y-0 space-y-4">
            {navItems.map((item, index) =>
              item.lista.length > 0 ? (
                <li className="relative group" key={item.id || index}>
                  <a
                    className="flex items-center justify-between  rounded-xl p-2 hover:cursor-pointer text-gray-200 hover:text-white dark:hover:text-white"
                    key={item.id || index}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    {item.title}
                    <IoMdArrowDropdown className="ms-3 h-5 w-5" />
                  </a>
                  <div
                    className={`md:absolute w-full z-50 ${
                      isOpen === item.id ? "block" : "hidden"
                    }  md:bg-white bg-transparent md:dark:bg-gray-800 md:rounded-lg md:shadow-lg  my-2 w-full md:w-48`}
                    onMouseLeave={() => closeMenus()}
                  >
                    {item.lista.map((subItem, subIndex) => (
                      <NavLink
                        key={subItem.id || subIndex}
                        to={subItem.path}
                        onClick={() => closeMenus()}
                        className={`flex items-center p-2 first:rounded-t-lg last:rounded-b-lg text-white md:text-black dark:text-white hover:bg-gray-100  hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white`}
                      >
                        <span className=" p-1">{subItem.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.id || index}>
                  <NavLink
                    to={item.path}
                    onClick={() => closeMenus()}
                    className={`flex items-center rounded-xl p-2 text-gray-200 hover:text-white dark:hover:text-white`}
                  >
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              )
            )}

            {navLinks()}
          </ul>
        </div>
        <div className="flex gap-2 md:w-auto justify-between items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="flex items-center gap-4">
            <Settings reversed={true} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
