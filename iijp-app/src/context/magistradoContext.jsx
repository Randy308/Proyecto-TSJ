import { createContext, useState, useContext } from "react";

export const MagistradoContext = createContext();

export const MagistradoContextProvider = ({ children }) => {
  const [magistrado, setMagistrado] = useState([]);
  const valor = { magistrado, setMagistrado };

  return (
    <MagistradoContext.Provider value={valor}>{children}</MagistradoContext.Provider>
  );
};

export function useMagistradoContext() {
  const context = useContext(MagistradoContext);
  if (!context) {
    throw new Error("useMagistradoContext must be used within a MagistradoProvider");
  }
  return context;
}
