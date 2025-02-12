import { createContext, useState, useContext, useEffect } from "react";
import MagistradoService from "../services/MagistradoService";

export const MagistradosContext = createContext();

export const MagistradosContextProvider = ({ children }) => {
  const [magistrados, setMagistrados] = useState([]);

  useEffect(() => {
    obtenerMagistrados();
  }, []);

  const obtenerMagistrados = async () => {
    try {
      const { data } = await MagistradoService.getAllMagistrados();
      if (Array.isArray(data)) {
        setMagistrados(data);
      } else {
        console.error("Error: Los datos obtenidos no son un array", data);
        setMagistrados([]); // Asegurar que el estado no sea undefined
      }
    } catch (err) {
      console.error("Existe un error:", err);
      setMagistrados([]); // Evitar undefined en caso de error
    }
  };

  const valor = { magistrados, setMagistrados };

  return (
    <MagistradosContext.Provider value={valor}>
      {children}
    </MagistradosContext.Provider>
  );
};

export function useMagistradosContext() {
  const context = useContext(MagistradosContext);
  if (!context) {
    throw new Error(
      "useMagistradosContext must be used within a MagistradosProvider"
    );
  }
  return context;
}
