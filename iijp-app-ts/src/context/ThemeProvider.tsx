import { createContext, useContext, useEffect } from "react";
import type { ContextProviderProps } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";


interface ValueContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const themeContext = createContext<ValueContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: ContextProviderProps) {
  const [isDark, setIsDark] = useLocalStorage<boolean>("theme", false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  const valor: ValueContextType = { isDark, toggleTheme };

  return (
    <themeContext.Provider value={valor}>
      <div
        id="parent-container"
        className={isDark ? "dark-theme" : "light-theme"}
      >
        {children}
      </div>
    </themeContext.Provider>
  );
}

export function useThemeContext(): ValueContextType {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeProvider;
