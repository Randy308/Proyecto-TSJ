import { useState, useEffect } from "react";
import UserService from "../services/UserService";
import type { ContextProviderProps, Notification } from "../types";
import { AuthUser } from "../auth";
import { NotificationContext, type ValueContextType } from "../context/notificationContext";


export const NotificationContextProvider = ({
  children,
}: ContextProviderProps) => {
  const { getToken, getLogout } = AuthUser();
  const [notifications, setNotifications] = useState<
    Notification[] | undefined
  >(undefined);
  const token = getToken();

  useEffect(() => {
    if (token) {
      obtenerNotificaciones();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const obtenerNotificaciones = async () => {
    try {
      const { data } = await UserService.getUnreadNotifications();
      if (data) {
        setNotifications(data);
        console.log(data);
      } else {
        console.error("Error: Los datos obtenidos no son un array", data);
        setNotifications([]);
      }
    } catch (err: unknown) {
      console.error("Existe un error:", err);
      setNotifications([]);

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (err as any).response?.status === "number"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (err as any).response.status;
        if (status === 401) {
          getLogout();
        }
      }
    }
  };

  const valor: ValueContextType = { notifications, setNotifications };

  return (
    <NotificationContext.Provider value={valor}>
      {children}
    </NotificationContext.Provider>
  );
};

