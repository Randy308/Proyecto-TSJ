import React, { useContext, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const themeContext = React.createContext();
const themeToggleContext = React.createContext();

export function useThemeContext() {
  return useContext(themeContext);
}

export function useToggleContext() {
  return useContext(themeToggleContext);
}
export function ThemeProvider(props) {
  const [isDark, setIsDark] = useLocalStorage( 'theme', false);

  const toggleTheme = () => {
    console.log(isDark)
    setIsDark(!isDark)
  }
  return (
    <themeContext.Provider value={isDark}>
      <themeToggleContext.Provider value={toggleTheme}>
       <div id="parent-container" className={isDark ? "dark-theme" : "light-theme"} >
       {props.children}
       </div>
      </themeToggleContext.Provider>
    </themeContext.Provider>
  );
}

export default ThemeProvider;
