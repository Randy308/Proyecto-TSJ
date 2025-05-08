import React from 'react'
import LogoUmss from "../images/Logo_umss.png";
import AuthUser from '../auth/AuthUser';
import { MdAttachEmail } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { FaBars, FaDatabase, FaUsers, FaUsersGear } from 'react-icons/fa6';
import { RiDashboard2Fill } from 'react-icons/ri';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Notifications from './Notifications';
import Settings from './Settings';
import { FaMailBulk, FaTimes } from 'react-icons/fa';
import { useNotificationContext } from '../context/notificationContext';
const Sidebar = () => {

    const [show, setShow] = React.useState(false);

    const { notifications } = useNotificationContext();
    const { getToken, getLogout, can } = AuthUser();

    const navLinks = () => {
        if (getToken()) {
            return (
                <>
                    {can("ver_usuarios") && (
                        <>
                            <li>
                                <NavLink
                                    to="/usuarios"
                                    className={({ isActive }) =>
                                        `flex items-center p-2  rounded-lg  group ${isActive ? "dark:text-white text-gray-900" : " text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`
                                    }


                                >
                                    <FaUsers className="w-5 h-5  transition duration-75 " />
                                    <span className="ms-3">Usuarios</span>
                                </NavLink>
                            </li>

                        </>
                    )}

                    {can("acceder_resoluciones") && (
                        <li>
                            <NavLink
                                to="/subir-resoluciones"
                                className={({ isActive }) =>
                                    `flex items-center p-2  rounded-lg  group ${isActive ? "dark:text-white text-gray-900" : " text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`
                                }
                            >
                                <FaDatabase className="w-5 h-5  transition duration-75 " />
                                <span className="ms-3"> Resoluciones
                                </span>
                            </NavLink>
                        </li>
                    )}

                    {can("ver_roles") && (
                        <li>
                            <NavLink
                                to="/roles"
                                className={({ isActive }) =>
                                    `flex items-center p-2  rounded-lg  group ${isActive ? "dark:text-white text-gray-900" : " text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`
                                }
                            >
                                <FaUsersGear className="w-5 h-5  transition duration-75 " />
                                <span className="ms-3">Roles</span>
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center p-2  rounded-lg  group ${isActive ? "dark:text-white text-gray-900" : " text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`
                            }
                        >
                            <RiDashboard2Fill className="w-5 h-5  transition duration-75 " />
                            <span className="ms-3">Dashboard</span>
                        </NavLink>
                    </li>
                </>
            );
        }

        return null;
    };

    return (
        <>
            <nav id="navbar-submenu" className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button onClick={() => setShow(prev => !prev)} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100  dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>


                                {!show ? (
                                    <FaBars id="bars" key="first" className="w-7 h-7"></FaBars>
                                ) : (
                                    <FaTimes id="close" key="second" className="w-7 h-7"></FaTimes>
                                )}
                            </button>
                            <a href="#" className="flex ms-2 md:me-24 bg-white rounded-lg">

                                <img
                                    src={LogoUmss}
                                    alt="first-logo"
                                    className="h-[65px] sm:h-12 me-3 self-center"
                                />


                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center gap-4 ms-3">
                                <div>  <span className="self-center hidden sm:block text-sm font-semibold  text-white whitespace-nowrap "> ESTA PÁGINA SE ENCUENTRA EN CONSTRUCCIÓN</span>

                                </div>
                                <Settings />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-32 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${!show && "-translate-x-full"}`} aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `flex items-center p-2  rounded-lg  group ${isActive ? "dark:text-white text-gray-900" : " text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`
                                }
                            >
                                <IoMdArrowRoundBack className="w-5 h-5  transition duration-75 " />
                                <span className="ms-3">Regresar</span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <FaMailBulk className="shrink-0 w-5 h-5 transition duration-75" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Notificaciones</span>
                                {notifications.length > 0 && (
                                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                        {notifications.filter(item => item.estado === "unread").length}
                                    </span>
                                )}
                            </a>


                        </li>
                        {navLinks()}

                    </ul>
                </div>
            </aside>
        </>
    );
}
export default Sidebar