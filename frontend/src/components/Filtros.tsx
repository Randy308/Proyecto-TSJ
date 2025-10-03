import React, { useEffect, useMemo, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { titulo } from "../utils/filterForm";
import type { DatosArray, Faceta, FiltroBusqueda } from "../types";

interface FiltrosProps {
  nombre: FiltroBusqueda;
  formData: DatosArray;
  data: Faceta[];
  updateSearch: () => void;
  setFormData: React.Dispatch<React.SetStateAction<DatosArray>>;
}
const Filtros = ({
  nombre,
  data,
  formData,
  setFormData,
  updateSearch,
}: FiltrosProps) => {
  const selectedIds = (formData[nombre] || []) as (string | number)[];
  const [changes, setChanges] = useState(0);

  const [lista, setLista] = useState<Faceta[]>([]);
  const checkedAll = selectedIds.length === 0;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let checkedId: string | number = Number(event.target.value);

    if (
      nombre === "proceso" ||
      nombre === "restrictor" ||
      nombre === "descriptor"
    ) {
      checkedId = event.target.value;
    }
    const isChecked = selectedIds.includes(checkedId);

    const updated = isChecked
      ? selectedIds.filter((id) => id !== checkedId)
      : [...selectedIds, checkedId];

    setFormData((prev) => ({
      ...prev,
      [nombre]: updated,
    }));
    setChanges((prev) => prev + 1);
  };

  const handleCheckboxAll = () => {
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[nombre];
      return newFormData;
    });
    setChanges((prev) => prev + 1);
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const plus = useMemo(() => <FaPlus className="text-gray-500" />, []);
  const minus = useMemo(() => <FaMinus className="text-gray-500" />, []);

  const [search, setSearch] = useState("");
  const handleMouseLeave = () => {
    if (changes > 0) {
      updateSearch();
      setChanges(0);
    }
  };

  const updateList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termino = e.target.value.toLowerCase();
    setSearch(e.target.value);
    const filtered = data.filter((item) =>
      String(item.nombre).toLowerCase().includes(termino)
    );
    setLista(filtered);
  };

  useEffect(() => {
    setLista(data);
    setSearch("");
  }, [data])
  
  return (
    <div
      onMouseLeave={handleMouseLeave}
      className="border-b border-gray-300 mb-4 dark:text-white text-black"
    >
      <button
        className="flex justify-between items-center p-2 text-left w-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={handleClick}
      >
        <span className="uppercase font-bold">{titulo(nombre)}</span>
        {show ? minus : plus}
      </button>

      <div>
        <div
          key="all"
          className={`${
            show ? "block" : "hidden"
          } pl-4 pr-2 py-1 text-gray-700 dark:text-gray-400`}
        >
          {data && data.length > 10 && (
            <div>
              <input
                type="text"
                value={search}
                onChange={updateList}
                className="border w-full p-2 my-2"
                placeholder="Buscador"
              />
            </div>
          )}

          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={checkedAll}
              onChange={handleCheckboxAll}
            />
            Todos
          </label>
        </div>

        {lista.map((item) => (
          <div
            key={item.id}
            className={`${
              show ? "flex flex-row justify-between" : "hidden"
            } pl-4 pr-2 py-1 text-gray-700 dark:text-gray-400`}
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value={item.id}
                checked={selectedIds.includes(item.id)}
                onChange={handleCheckboxChange}
              />
              <span className="text-wrap text-sm w-28 capitalize">
                {item.nombre}
              </span>
            </label>
            {item.cantidad && (
              <span className="text-gray-500 text-xs dark:text-gray-300 ms-2">
                {item.cantidad}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filtros;
