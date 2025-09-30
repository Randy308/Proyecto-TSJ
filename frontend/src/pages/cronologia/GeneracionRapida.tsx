import { useMemo } from "react";
import ArbolJurisprudencial from "./ArbolJurisprudencial";
import { FaSearch } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import AsyncButton from "../../components/AsyncButton";
import { IoMdClose } from "react-icons/io";
import { useCronologiaContext } from "../../context/cronologiaContext";

interface ArbolJurisprudencial {
  id: number;
  nombre: string;
}

const GeneracionRapida = () => {
  const {
    arbol,
    resultados,
    vaciarNodo,
    errorBusqueda,
    search,
    setResultados,
    actualizarNodos,
    obtenerCronologia,
    isLoading,
    busqueda,
    setBusqueda,
    searchNodes,
    setSearchNodes,
  } = useCronologiaContext();

  
  const searchIcon = useMemo(
    () => (
      <FaSearch className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
    ),
    []
  );

  const actualizarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.currentTarget.value;
    setBusqueda(valor);
  };

  const closeButton = useMemo(
    () => <IoMdClose className="group-hover:text-red-500" />,
    []
  );

  return (
    <div id="cronologia-container" className="p-4 m-4">
      <div className="header-container">
        <div>
          <p className="text-bold text-2xl md:text-3xl text-center my-4 titulo font-bold text-black dark:text-white">
            Generación de Cronojurídicas
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <div>
          <div>
            <div className="relative w-full mb-4">
              <form onSubmit={(e) => search(e)}>
                <input
                  type="text"
                  id="voice-search"
                  value={busqueda}
                  onChange={(e) => actualizarInput(e)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar en el árbol jurisprudencial...."
                  required
                />
                <button
                  type="button"
                  onClick={(e) => search(e)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3"
                >
                  {searchIcon}{" "}
                </button>
              </form>
            </div>

            {errorBusqueda.length > 0 && (
              <div
                id="alert-2"
                className="flex items-center p-4 mb-4 text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <FaInfo className="shrink-0 w-4 h-4" />
                <div className="ms-3 text-sm font-medium">{errorBusqueda}</div>
              </div>
            )}
            {arbol && arbol.length > 0 && (
              <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-sm flex flex-row items-center flex-wrap gap-2">
                    <span className="text-black dark:text-white">
                      Filtrado por:
                    </span>
                    <div
                      onClick={vaciarNodo}
                      className="bg-white dark:text-white group flex gap-4 items-center justify-between hover:cursor-pointer rounded-lg p-2 font-bold m-4 border hover:border-red-500 text-xs dark:bg-gray-500"
                    >
                      <span>
                        {arbol.map(({ nombre }) => nombre).join(" / ")}
                      </span>
                      {closeButton}
                    </div>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="nodesCheckbox"
                      value={searchNodes ? 1 : 0}
                      onChange={() => setSearchNodes(prev => !prev)}
                      className="mr-2"
                    />
                    <label htmlFor="nodesCheckbox"  className="text-sm text-black dark:text-white">
                      Buscar dentro del descriptor seleccionado
                    </label>
                  </div>
                </div>
                <AsyncButton
                  asyncFunction={obtenerCronologia}
                  name={"Obtener Resoluciones"}
                  isLoading={isLoading}
                  full={false}
                />
              </div>
            )}

            <div className="p-4">
              {resultados && resultados.length > 0 ? (
                <>
                  <div className="flex dark:text-white justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-md p-3 my-2">
                    <span>
                      La búsqueda genero:{" "}
                      {resultados.length > 1
                        ? resultados.length + " resultados"
                        : "un resultado"}
                    </span>
                    <span
                      onClick={() => setResultados([])}
                      className="cursor-pointer underline"
                    >
                      Limpiar Resultados
                    </span>
                  </div>
                  {resultados.map((item, index) => (
                    <div
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 hover:dark:bg-gray-700 hover:bg-gray-200 rounded-md p-3 my-2 cursor-pointer transition-all ease-in-out duration-200"
                      key={index}
                      onClick={() => actualizarNodos(item.descriptor)}
                    >
                      <span className="text-black font-semibold dark:text-white ">
                        {item.descriptor}
                      </span>
                      <span className="text-gray-600 text-sm dark:text-gray-400">
                        {item.cantidad}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <ArbolJurisprudencial />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneracionRapida;
