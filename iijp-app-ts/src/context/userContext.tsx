import { createContext, useContext } from "react";
import type { User } from "../types";

export interface ValueContextType {
  users: User[] | undefined;
  totalUser: number;
  pageCount: number;
  current: number;
  obtenerUsers: (page?: number) => Promise<void>;
}

export const UserContext = createContext<ValueContextType | undefined>(
  undefined
);


export function useUserContext(): ValueContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
