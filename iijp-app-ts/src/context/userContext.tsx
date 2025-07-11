import { createContext, useContext } from "react";
import type { User } from "../types";

export interface UserContextType {
  users: User[] | undefined;
  totalUser: number;
  pageCount: number;
  current: number;
  obtenerUsers: (page?: number) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);


export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
