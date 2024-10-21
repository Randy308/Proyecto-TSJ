import React, { useEffect, useState } from "react";
import axios from "axios";

export function useFreeApi() {
  const endpoint = process.env.REACT_APP_BACKEND;

  const obtenerResoluciones = async () => {
    const [contenido, setContenido] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${endpoint}/all-resoluciones`);
        const nombres = Object.keys(data);
        const xAxis = data.Todos.map((item) => item.year);
        const resoluciones = data.Todos.map((item) => item.cantidad);
        const jurisprudencia = data.Jurisprudencia.map((item) => item.cantidad);
        const autos = data["Auto supremos"].map((item) => item.cantidad);
        setContenido([nombres, xAxis, resoluciones, jurisprudencia, autos]);
      } catch (error) {
        setError("Error al realizar la solicitud:", error);
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchData();
    }, []);

    return { contenido, isLoading, error };
  };
}
