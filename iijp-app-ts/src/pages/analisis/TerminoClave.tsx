import React, { useEffect, useState } from "react";
import { useIcons } from "../../components/icons/Icons";
import StatsService from "../../services/StatsService";
import SelectDropdown from "./SelectDropdown";
import { variablesAnalisis } from "../../data/VariablesAnalisis";
const TerminoClave = ({ listaX, setListaX }) => {
  const { arrowUpIcon, arrowDownIcon, cleanIcon, trashIcon, spinIcon } =
    useIcons();

  const [activo, setActivo] = useState(null);
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(null);
  const [cache, setCache] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [links, setLinks] = useState([]);

  const agregarTermino = () => {
    // Verificar si el término ya existe en la lista
    let paginaActual = links[activo.columna] ? links[activo.columna].page : 1;
    paginaActual = paginaActual + 1;
    const paginaFinal = links[activo.columna] ? links[activo.columna].last : 1;
    if (paginaActual >= paginaFinal) {
      alert("No hay mas terminos para agregar");
      return;
    }
    StatsService.obtenerTerminos({ nombre: activo.columna, page: paginaActual })
      .then(({ data }) => {
        const nuevosItems = [...items, ...data.data];
        setItems(nuevosItems);
        setCache((prevCache) => ({
          ...prevCache,
          [activo.columna]: nuevosItems,
        }));

        setLinks((prev) => ({
          ...prev,
          [activo.columna]: { page: data.current_page, last: data.last_page },
        }));
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setIsLoadingData(false);
        setFetching(null);
      });
  };
  const eliminarElemento = (variable) => {
    console.log(listaX);
    const nuevaLista = listaX.filter((item) => item.name !== variable);
    setListaX(nuevaLista);
  };

  const showTerminos = (variable, pagina = 1) => {
    if (activo && variable.columna === activo.columna) {
      setItems([]);
      setActivo(null);
      return;
    }
    if (cache[variable.columna]) {
      setItems(cache[variable.columna]);
      setActivo(variable);
    } else {
      setIsLoadingData(true);
      setFetching(variable.columna);
      StatsService.obtenerTerminos({ nombre: variable.columna, page: pagina })
        .then(({ data }) => {
          setItems(data.data);
          setCache((prevCache) => ({
            ...prevCache,
            [variable.columna]: data.data,
          }));

          setLinks((prev) => ({
            ...prev,
            [variable.columna]: {
              page: data.current_page,
              last: data.last_page,
            },
          }));
          setActivo(variable);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        })
        .finally(() => {
          setIsLoadingData(false);
          setFetching(null);
        });
    }
  };

  return (
    <div>
      {variablesAnalisis.map((variable, index) => (
        <div key={index}>
          <div
            className={`p-2 rounded-lg border flex items-center justify-between text-sm  me-2 mb-2 `}
          >
            <div className="text-xs sm:text-sm text-black dark:text-gray-200">{variable.nombre}</div>

            <div className="flex gap-4">
              {listaX &&
                listaX.length > 0 &&
                listaX.some((item) => item.name === variable.columna) && (
                  <button
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 cursor-pointer "
                    onClick={() => eliminarElemento(variable.columna)}
                  >
                    {trashIcon}
                  </button>
                )}

              <button
                className="p-2 rounded-lg cursor-pointer border border-gray-400 dark:border-gray-600"
                onClick={() => showTerminos(variable)}
              >
                {activo && activo.columna === variable.columna
                  ? arrowUpIcon
                  : isLoadingData && fetching === variable.columna
                  ? spinIcon
                  : arrowDownIcon}
              </button>
            </div>
          </div>

          {activo &&
            activo.columna === variable.columna &&
            items.length > 0 && (
              <SelectDropdown
                listaX={listaX}
                setListaX={setListaX}
                contenido={items}
                tabla={variable.tabla}
                name={variable.columna}
                agregarTermino={agregarTermino}
              />
            )}
        </div>
      ))}
    </div>
  );
};

export default TerminoClave;
