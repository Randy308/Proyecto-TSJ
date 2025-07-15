import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error("Error al obtener desde localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error al guardar en sessionStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
