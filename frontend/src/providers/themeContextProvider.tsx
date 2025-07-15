import { useEffect } from "react";
import type { ContextProviderProps } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ThemeContext } from "../context";


interface ValueContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

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
    <ThemeContext.Provider value={valor}>
      <div
        id="parent-container"
        className={isDark ? "dark-theme" : "light-theme"}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

