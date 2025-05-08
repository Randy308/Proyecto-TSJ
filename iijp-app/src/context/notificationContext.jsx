import { createContext, useState, useContext, useEffect } from "react";
import AuthUser from "../auth/AuthUser";
import UserService from "../services/UserService";

export const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
    const { getToken } = AuthUser();
    const [notifications, setNotifications] = useState([]);
    const token = getToken();

    useEffect(() => {

        if (token) {
            obtenerNotificaciones();
        }
    }, [token]);

    const obtenerNotificaciones = async () => {
        try {
            const { data } = await UserService.getUnreadNotifications(getToken());
            if (data) {
                setNotifications(data);
                console.log(data)
            } else {
                console.error("Error: Los datos obtenidos no son un array", data);
                setNotifications([]);
            }
        } catch (err) {
            console.error("Existe un error:", err);
            setNotifications([]);
        }
    };


    const valor = { notifications, setNotifications };

    return <NotificationContext.Provider value={valor}>{children}</NotificationContext.Provider>;
};

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationContext must be used within a UserProvider");
    }
    return context;
}
