import { createContext, useContext } from "react";
import type { Notification } from "../types";

export interface ValueContextType {
  notifications: Notification[] | undefined;
  setNotifications: React.Dispatch<
    React.SetStateAction<Notification[] | undefined>
  >;
}

export const NotificationContext = createContext<ValueContextType | undefined>(
  undefined
);



export function useNotificationContext(): ValueContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a UserProvider"
    );
  }
  return context;
}
