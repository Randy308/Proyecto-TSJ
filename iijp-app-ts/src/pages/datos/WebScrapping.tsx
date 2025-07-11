import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton";
import { toast } from "react-toastify";
import {UserService} from "../../services";
import { useAuthContext } from "../../context";

const WebScrapping = () => {
  const { can } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScrapping, setIsLoadingScrapping] = useState(false);
  const [cantidad, setCantidad] = useState(10);

  useEffect(() => {
    if (!can("realizar_web_scrapping")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Eliminamos `can` de dependencias para evitar reejecuciones innecesarias

  const comprobarResoluciones = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { data } = await UserService.buscarNuevasResoluciones( ); // Usar el nuevo token
      console.log(data);

      const { message, cantidad } = data;

      toast.success(`${message} Resoluciones encontradas: ${cantidad}.`, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
      });

      setCantidad(cantidad);
    } catch (error) {
      console.log("Error al comprobar resoluciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const realizarWebScrapping = async () => {
    if (isLoadingScrapping) return;

    setIsLoadingScrapping(true);

    try {
      const { data } = await UserService.realizarWebScrapping(); 
      console.log(data);

      const { message } = data;

      toast.success(`${message}.`, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        draggable: true,
      });
    } catch (error) {
      console.log("Error al comprobar resoluciones:", error);
    } finally {
      setIsLoadingScrapping(false);
    }
  };

  if (loading) return null; // Evita mostrar el botón mientras carga

  return (
    <div className="p-4 m-4">
      <h2 className="text-xl font-semibold">Búsqueda de Resoluciones</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Presiona el botón para buscar nuevas resoluciones disponibles en el
        sistema.
      </p>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <AsyncButton
          name="Comprobar resoluciones"
          isLoading={isLoading}
          full={false}
          asyncFunction={comprobarResoluciones}
        />

        {cantidad > 0 && (
          <AsyncButton
            name="Realizar Web Scraping"
            isLoading={isLoadingScrapping}
            full={false}
            asyncFunction={realizarWebScrapping}
          />
        )}
      </div>
    </div>
  );
};

export default WebScrapping;
