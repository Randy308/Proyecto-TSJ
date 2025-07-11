import { useState, useEffect } from "react";
import {UserService} from "../services";
import type { ContextProviderProps, Notification } from "../types";
import { NotificationContext, type NotificationContextType } from "../context/notificationContext";
import { useAuthContext } from "../context";


export const NotificationContextProvider = ({
  children,
}: ContextProviderProps) => {
  const { hasAccess, logout } = useAuthContext();
  const [notifications, setNotifications] = useState<
    Notification[] | undefined
  >(undefined);

  useEffect(() => {
    if (hasAccess()) {
      obtenerNotificaciones();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obtenerNotificaciones = async () => {
    try {
      const { data } = await UserService.getUnreadNotifications();
      if (data) {
        setNotifications(data);
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
          logout();
        }
      }
    }
  };

  const valor: NotificationContextType = { notifications, setNotifications };

  return (
    <NotificationContext.Provider value={valor}>
      {children}
    </NotificationContext.Provider>
  );
};

