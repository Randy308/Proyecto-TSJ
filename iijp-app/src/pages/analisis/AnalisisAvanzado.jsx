import React, { useEffect, useState } from "react";
import { variablesAnalisis } from "../../data/VariablesAnalisis";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SelectDropdown from "./SelectDropdown";
import AsyncButton from "../../components/AsyncButton";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import StatsService from "../../services/StatsService";

const AnalisisAvanzado = () => {
  const [activo, setActivo] = useState(null);
  const [items, setItems] = useState([]);
  const [cache, setCache] = useState({}); // Estado para almacenar los datos cacheados

  const [limite, setLimite] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [checkedX, setCheckedX] = useState(false);
  const [variableActual, setVariableActual] = useState(null);
  const [listaX, setListaX] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [termino, setTermino] = useState("");
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const showTerminos = (variable) => {
    if (activo && variable.columna === activo.columna) {
      setItems([]);
      setActivo(null);
      return;
    }
    if (cache[variable.columna]) {
      setItems(cache[variable.columna]);
      setActivo(variable);
    } else {
      StatsService.obtenerTerminos(variable)
        .then(({ data }) => {
          setItems(data);
          setCache((prevCache) => ({
            ...prevCache,
            [variable.columna]: data,
          }));
          setActivo(variable);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    }
  };

  const getDatos = () => {
    if (listaX.length === 0) {
      return;
    }
    setIsLoading(true); // Start loading

    const isMultiVariable = listaX.length > 0;

    const params = isMultiVariable
      ? {
          tablaX: listaX[0].tabla,
          columnaX: listaX[0].name,
          terminosX: listaX[0].ids,
          tablaY: listaX[1].tabla,
          columnaY: listaX[1].name,
          terminosY: listaX[1].ids,
        }
      : {
          tabla: listaX[0].tabla,
          columna: listaX[0].name,
          terminos: listaX[0].ids,
        };
    const fetchStats = isMultiVariable
      ? StatsService.getStatsXY(params)
      : StatsService.getStatsX(params);

    fetchStats
      .then(({ data }) => {
        console.log("Datos cargados desde API", data);
        if (data) {
          navigate(`/analisis/avanzado/${data.tabla}`, { state: data });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (termino && activo) {
        buscarTermino(activo);
      }
    }, 500); // 500 ms de retraso

    return () => clearTimeout(delayDebounceFn); // Limpiar el timeout si el valor cambia rápidamente
  }, [termino, activo]);

  const buscarTermino = async (variable) => {
    setIsLoadingData(true);
    StatsService.buscarTermino({
      tabla: variable.tabla,
      columna: variable.columna,
      termino: termino,
      pagina: pagina,
    })
      .then(({ data }) => {
        setBusqueda(data.data);
        setTotal(data.total);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };
  const agregarTermino = () => {
    // Verificar si el término ya existe en la lista
    if (!items.some((item) => item.termino === termino)) {
      // Agregar el término a la lista items como un objeto
      const nuevaLista = [{ termino: termino, cantidad: 1 }, ...items];
      setItems(nuevaLista);

      // Guardar la nueva lista en el cache
      setCache((prevCache) => ({
        ...prevCache,
        [activo.columna]: nuevaLista, // Guardamos los datos en cache
      }));

      // Limpiar el campo de búsqueda
      setTermino("");
      setBusqueda([]);
    } else {
      console.log("El término ya existe en la lista");
    }
  };
  const eliminarElemento = (variable) => {
    const nuevaLista = listaX.filter((item) => item.name !== variable.columna);
    setListaX(nuevaLista);
  };

  return (
    <div className="grid grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-1 custom:grid-cols-1 gap-4">
      <div className="p-4 m-4 bg-gray-100 rounded-lg dark:bg-gray-600">
        <div>
          <p className="text-black dark:text-white">Selecciona una variable</p>
        </div>
        <div className="flex flex-wrap gap-2 py-4 justify-center">
          <button
            type="button"
            onClick={() => setListaX([])}
            className="inline-flex items-center text-white bg-gradient-to-r bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-3 text-center"
          >
            <MdOutlineCleaningServices className="fill-current w-4 h-4 mr-2" />
            <span>Limpiar</span>
          </button>

          <AsyncButton
            name={"Realizar analisis"}
            asyncFunction={getDatos}
            isLoading={isLoadingData}
            full={false}
          />
        </div>

        {variablesAnalisis.map((variable, index) => (
          <div key={index}>
            <div
              className={`text-white p-4 m-2 rounded-lg flex justify-between text-sm  ${
                activo && activo.columna === variable.columna
                  ? "bg-gray-800 dark:bg-gray-800"
                  : "bg-gray-700 dark:bg-gray-700"
              } `}
            >
              <div>{variable.nombre}</div>

              <div className="flex gap-4">
                {listaX &&
                  listaX.length > 0 &&
                  listaX.some((item) => item.name === variable.columna) && (
                    <button
                      className="p-2 bg-red-500 rounded-lg hover:bg-red-600 cursor-pointer "
                      onClick={() => eliminarElemento(variable)}
                    >
                      <FaTrashAlt className="text-white w-4 h-4" />
                    </button>
                  )}

                <button
                  className="p-2 rounded-lg cursor-pointer border border-gray-400 dark:border-gray-600 "
                  onClick={() => showTerminos(variable)}
                >
                  {activo && activo.columna === variable.columna ? (
                    <IoIosArrowUp className="text-white w-4 h-4" />
                  ) : (
                    <IoIosArrowDown className="text-white w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {activo &&
              activo.columna === variable.columna &&
              items.length > 0 && (
                <div className="p-4 m-4 rounded-lg">
                  {variable.busqueda && (
                    <form className="max-w-md mx-auto pb-2 mb-2">
                      <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                      >
                        Buscar
                      </label>
                      <div className="relative">
                        <input
                          type="search"
                          onChange={(e) => setTermino(e.target.value)} // Actualiza el estado del término
                          value={termino}
                          id="default-search"
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Encontrar termino de busqueda..."
                          required
                        />
                        <button
                          type="button"
                          onClick={() => agregarTermino()}
                          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Agregar
                        </button>
                      </div>

                      {busqueda.length > 0 && (
                        <div className="p-4">
                          {busqueda.map((item) => (
                            <div
                              key={item.id}
                              className="m-2 p-2 text-sm bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
                              onClick={() => setTermino(item.nombre)}
                            >
                              {item.nombre}
                            </div>
                          ))}
                          <div>Total de resultados encontrados: {total}</div>
                        </div>
                      )}
                    </form>
                  )}
                  <SelectDropdown
                    listaX={listaX}
                    setListaX={setListaX}
                    contenido={items}
                    tabla={variable.tabla}
                    name={variable.columna}
                  />
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalisisAvanzado;
