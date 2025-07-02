import React, { useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const themeContext = React.createContext();

export function useThemeContext() {
  return useContext(themeContext);
}

export function ThemeProvider(props) {
  const [isDark, setIsDark] = useLocalStorage("theme", false);

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

  const valor = { isDark, toggleTheme };

  return (
    <themeContext.Provider value={valor}>
      {props.children}
    </themeContext.Provider>
  );
}

export default ThemeProvider;
