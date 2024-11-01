import React, { useEffect, useState } from "react";
import axios from "axios";

export function useFreeApiWithParams(url , params) {
  const [contenido, setContenido] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(url, {
        params: params,
      });
      setContenido(data);
    } catch (error) {
      setError("Error al realizar la solicitud: " + error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { contenido, isLoading, error };
}
