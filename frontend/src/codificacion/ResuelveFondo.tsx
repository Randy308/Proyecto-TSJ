import React, { useState } from "react";
import SelectDropdown from "../components/SelectDropdown";
import { useVariablesContext } from "../context";
import type { Faceta } from "../types";
import { AuthService } from "../services";

export const ResuelveFondo = () => {
  const lista: Faceta[] = [
    { id: 1, nombre: "Tipo 1" },
    { id: 2, nombre: "Tipo 2" },
    { id: 3, nombre: "Tipo 3" },
    { id: 4, nombre: "Tipo 4" },
    { id: 5, nombre: "Tipo 5" },
    { id: 6, nombre: "Tipo 6" },
    { id: 7, nombre: "Tipo 7" },
    { id: 8, nombre: "Tipo 8" },
    { id: 9, nombre: "Tipo 9" },
  ];

  const { data } = useVariablesContext();
  const [selected, setSelected] = useState<number | null>(null);
  const [tipo, setTipo] = useState<number | null>(null);
  const [titulo, setTitulo] = useState<string | undefined>(undefined);
  const [clave, setClave] = useState<string | undefined>(undefined);
  const handleSelectChange = (item: unknown) => {
    //updateFormData("campo", id);
    const element = item as Faceta;
    setSelected(element.id);
  };

  const handleTipo = (item: unknown) => {
    const element = item as Faceta;
    setTipo(element.id);
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (titulo  && tipo && selected) {
      const response = await AuthService.saveResuelveFondo({
        nombre: titulo,
        sala_id: selected,
        tipo_decision: tipo,
      });
    }
  };

  if (!data || !data.sala) {
    return "Loading";
  }
  return (
    <div className="flex flex-col gap-6 max-w-3xl ">
      {/* Título general */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Registro de tipo de Auto Supremo
      </h2>

      {/* Tipo de Auto Supremo */}
      <div className="flex flex-col">
        <label
          htmlFor="tipo_auto"
          className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Tipo de Auto Supremo <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="tipo_auto"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ingrese el tipo relacionado al tema a resolver"
          className="p-3 border text-xs md:text-md border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Sala y Tipo */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Sala
          </label>
          <SelectDropdown handleSelect={handleSelectChange} list={data.sala} />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tipo de Resolución
          </label>
          <SelectDropdown handleSelect={handleTipo} list={lista} />
        </div>
      </div>

      {/* Clave del Tipo */}
      <div className="flex flex-col">
        <label
          htmlFor="clave_tipo"
          className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Clave de Tipo<span className="text-gray-400"> (opcional)</span>
        </label>
        <input
          type="text"
          id="clave_tipo"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Ingrese una clave para el tipo"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <button
          onClick={handleClick}
          className="bg-red-octopus-800 hover:bg-red-700 transition-colors px-6 py-3 rounded-lg text-white font-medium"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};
