import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
     
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error al obtener desde localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error al guardar en localStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
