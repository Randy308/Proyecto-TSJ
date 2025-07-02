import { useEffect, useMemo, useState } from "react";
import Loading from "../../../components/Loading";
import { TiBackspace } from "react-icons/ti";
import { useNodosContext } from "../../../context/nodosContext";
const ArbolJurisprudencial = ({ currentID, setCurrentID, arbol, setArbol }) => {
  const { nodos } = useNodosContext();

  const [data, setData] = useState(null);
  const [parentID, setParentID] = useState(null);
  const [show, setShow] = useState(false);

  const returnButton = useMemo(() => <TiBackspace className="w-5 h-5" />, []);

  const updateNode = (id) => {
    const element = nodos.filter((item) => item.id === id);
    const children = nodos.filter(
      (item) => item.descriptor_id === element[0].id
    );
    console.log(children.length);
    if (children.length <= 0 && element[0].cantidad === 0) {
      console.log("No existen resoluciones para este descriptors");
      return;
    }
    console.log(element[0].id);
    setArbol((prevArbol) => [...prevArbol, element[0]]);
    setCurrentID(element[0].id);
  };

  const backToParent = () => {
    if (parentID === null) {
      return;
    }
    const element = nodos.filter((item) => item.id === parentID);
    setArbol((prev) => prev.slice(0, -1));
    setCurrentID(element[0].descriptor_id);
  };
  useEffect(() => {
    if (nodos.length > 0) {
      const element = nodos.filter((item) => item.descriptor_id === currentID);
      setParentID(currentID);
      setData(element);
    }
  }, [nodos, currentID]);

  if (!Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="m-2 p-2 custom:p-0 custom:m-0">
      {parentID && (
        <div>
          <button
            type="button"
            onClick={() => backToParent()}
            className="p-4 m-4 rounded-md text-red-octopus-700 bg-gray-100 hover:border-red-octopus-900 hover:bg-gray-200 border border-gray-300 text-xs flex items-center justify-between gap-4"
          >
            {returnButton}
            Regresar
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:flex-wrap sm:flex sm:items-center sm:justify-center gap-4">
        {data && data.length > 0 ? (
          data.map((tema) => (
            <div
              className={`p-4 text-xs text-center titulo rounded-lg materia-div hover:cursor-pointer max-w-[300px] flex flex-col gap-4 flex-wrap ${
                tema.cantidad > 0 ||
                nodos.some((item) => item.descriptor_id === tema.id)
                  ? "bg-red-octopus-700  dark:bg-blue-500 dark:hover:bg-blue-700 hover:bg-red-octopus-900 text-white"
                  : "bg-gray-100 hidden"
              }`}
              key={tema.id}
              id={tema.id}
              onClick={() => updateNode(tema.id)}
            >
              <span className="titulo font-medium text-sm">{tema.nombre}</span>

              <span className="text-xs text-gray-300">
                Cantidad:{tema.cantidad}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-300">No existen mas nodos</div>
        )}
      </div>
    </div>
  );
};

export default ArbolJurisprudencial;
