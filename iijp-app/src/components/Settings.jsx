import "../styles/navbar.css";
import React, { useEffect, useRef, useState } from "react";
import { MdSettingsInputComponent } from "react-icons/md";
import { HiOutlineLogin } from "react-icons/hi";
import { FaGear } from "react-icons/fa6";
import "../styles/main.css";
import { useToggleContext, useThemeContext } from "../context/ThemeProvider";
import AuthUser from "../auth/AuthUser";
import axios from "axios";

const Settings = () => {

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
            listaRef.current.style.top = `${rect.bottom - rect.height + listaHeight
                }px`;
            listaRef.current.style.left = `${rect.left - listaWidth - 180}px`;
        }
    };

    useEffect(() => {
        handleShowList();
    }, []);

    const logoutUser = async () => {
        await axios.get(`${process.env.REACT_APP_TOKEN}/sanctum/csrf-cookie`, {
            withCredentials: true,
        });

        try {
            const endpoint = process.env.REACT_APP_BACKEND;
            const { data } = await axios.post(
                `${endpoint}/auth/logout`,
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
        }
    };


    return (
        <>  <button
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
                className={`z-50 my-4 text-base absolute list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${settingsOpen ? " " : "hidden"
                    }`}
            >

                <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                            <label className="inline-flex items-center me-5 gap-2 cursor-pointer">
                                <span className="ms-3 text-xs font-medium text-gray-900 dark:text-gray-300">
                                    {isDark ? "Tema Oscuro" : "Tema Claro"}
                                </span>

                                <input
                                    type="checkbox"
                                    value=""
                                    className="sr-only peer"
                                    checked={isDark}
                                    onChange={eventoBoton}
                                />
                                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </a>
                    </li>
                    {renderLinks()}
                </ul>
            </div>
        </ >
    )
}

export default Settings