import { createContext, useContext } from "react";
import type { Notification } from "../types";

export interface NotificationContextType {
  notifications: Notification[] | undefined;
  setNotifications: React.Dispatch<
    React.SetStateAction<Notification[] | undefined>
  >;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);



export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a UserProvider"
    );
  }
  return context;
}
