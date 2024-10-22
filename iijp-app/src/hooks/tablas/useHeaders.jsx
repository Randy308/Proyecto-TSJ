import { useEffect, useState } from "react";

export function useHeaders() {

  const getHeaders = (item) => {
    const [cabeceras, setCabeceras] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearHeaders = async () => {
      setIsLoading(true);
      try {
        const headers = Object.keys(item.data[0]).map((header) => ({
          field: header,
          sortable: true,
          resizable: true,
        }));

        setCabeceras(headers);
      } catch (error) {
        setError("Error al realizar la solicitud:", error);
      }
      setIsLoading(false);
    };

    useEffect(() => {
      crearHeaders();
    }, []);

    return { cabeceras , isLoading, error };
  };
}
