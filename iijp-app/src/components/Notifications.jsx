import React, { useEffect, useRef, useState } from 'react'
import { useNotificationContext } from '../context/notificationContext'
import { FaBell } from 'react-icons/fa6';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import AuthUser from '../auth/AuthUser';
import UserService from '../services/UserService';

const Notifications = () => {

    const { getToken, } = AuthUser();
    if (!getToken()) {
        return null;
    }

    const { notifications, setNotifications } = useNotificationContext();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const bellRef = useRef(null);
    const notificationRef = useRef(null);

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
        if (bellRef.current && notificationRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            const listaHeight = bellRef.current.offsetHeight;
            const listaWidth = notificationRef.current.offsetWidth;
            notificationRef.current.style.top = `${rect.bottom - rect.height + listaHeight
                }px`;
            notificationRef.current.style.left = `${rect.left - listaWidth - 180}px`;
        }
    };


    const updateNotification = async (id) => {
        const notification = notifications.find((n) => n.id === id);
    
        if (!notification) {
            console.warn(`No se encontró notificación con ID ${id}`);
            return;
        }
    
        if (notification.estado !== "unread") {
            console.log(`La notificación con ID ${id} ya está leída`);
            return;
        }
    
        // Optimistic update
        setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
                n.id === id ? { ...n, estado: "read" } : n
            )
        );
    
        try {
            await UserService.markNotificationAsRead(id, getToken());
        } catch (error) {
            console.error('Error marcando notificación como leída:', error);
    
            // Revertir estado si falla la API
            setNotifications((prevNotifications) =>
                prevNotifications.map((n) =>
                    n.id === id ? { ...n, estado: "unread" } : n
                )
            );
        }
    };
    


    useEffect(() => {
        handleShowList();
    }, []);

    return (
        <>
            <button
                className="relative flex items-center text-sm dark:text-white hover:bg-gray-100 p-2 dark:hover:text-black hover:text-black rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                ref={bellRef}
                onClick={() => actualizarAjustes(true)}
                type="button"
            >
                <FaBell className="w-5 h-5" />

                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {notifications.filter(item => item.estado === "unread").length}
                    </span>
                )}
            </button>


            <div
                ref={notificationRef}
                id="user-dropdown"
                onMouseLeave={stopTimer}
                onMouseEnter={handleMouseEnter}
                className={`z-50 my-4 text-base absolute list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${settingsOpen ? " " : "hidden"
                    }`}
            >

                <ul className="py-2 max-w-[200px]" aria-labelledby="user-menu-button">
                    {notifications.length > 0 ? notifications.map((notification, index) =>  (
                        <li key={index} className={`block px-4 py-2 text-xs  ${notification.estado === 'unread'? "text-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white hover:cursor-pointer hover:bg-gray-100": "text-gray-500"}`} onClick={() => updateNotification(notification.id)}>
                            {notification.mensaje}<br />
                            <span className='text-red-octopus-900 dark:text-blue-700'>
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
                            </span>

                        </li>
                    )) : (
                        <li className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            No hay notificaciones
                        </li>
                    )}

                </ul>
            </div>
        </>
    )
}

export default Notifications