import { createContext, useContext } from "react";


export interface ValueContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ValueContextType | undefined>(
  undefined
);


export function useThemeContext(): ValueContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
