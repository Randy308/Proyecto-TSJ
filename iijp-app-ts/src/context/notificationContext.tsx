import { createContext, useState, useContext, useEffect } from "react";
import UserService from "../services/UserService";
import type { ContextProviderProps, Notification } from "../types";
import { AuthUser } from "../auth";

interface ValueContextType {
  notifications: Notification[] | undefined;
  setNotifications: React.Dispatch<
    React.SetStateAction<Notification[] | undefined>
  >;
}

export const NotificationContext = createContext<ValueContextType | undefined>(
  undefined
);

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
        typeof (err as any).response?.status === "number"
      ) {
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

export function useNotificationContext(): ValueContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a UserProvider"
    );
  }
  return context;
}
