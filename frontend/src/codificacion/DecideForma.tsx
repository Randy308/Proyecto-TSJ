import React, { useState } from "react";
import SelectDropdown from "../components/SelectDropdown";
import { useVariablesContext } from "../context";
import type { Faceta } from "../types";
import { AuthService } from "../services";

export const DecidoForma = () => {
  const lista: Faceta[] = [
    { id: 1, nombre: "Grupo 1" },
    { id: 2, nombre: "Grupo 2" },
    { id: 3, nombre: "Grupo 3" },
    { id: 4, nombre: "Grupo 4" },
    { id: 5, nombre: "Grupo 5" },
    { id: 6, nombre: "Grupo 6" },
    { id: 7, nombre: "Grupo 7" },
    { id: 8, nombre: "Grupo 8" },
    { id: 9, nombre: "Grupo 9" },
    { id: 10, nombre: "Grupo 10" },
    { id: 999, nombre: "Grupo 999" },
  ];

  const { data } = useVariablesContext();
  const [formaResolucion, setFormaResolucion] = useState<number | null>(null);
  const [resuelveFondo, setResuelveFondo] = useState<number | null>(null);
  const [grupo, setGrupo] = useState<number | null>(null);
  const handleFormaResolucion = (item: unknown) => {
    //updateFormData("campo", id);
    const element = item as Faceta;
    setFormaResolucion(element.id);
  };

  const handleResuelveFondo = (item: unknown) => {
    const element = item as Faceta;
    setResuelveFondo(element.id);
  };

  const handleGrupo = (item: unknown) => {
    const element = item as Faceta;
    setGrupo(element.id);
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (grupo && resuelveFondo && formaResolucion) {
      const response = await AuthService.saveDecideForma({
        forma_resolucion_id: formaResolucion,
        grupo_decision: grupo,
        resuelve_fondo_id: resuelveFondo,
      });
    }
  };
  if (!data || !data.forma_resolucion || !data.resuelve_fondo) {
    return "Loading";
  }
  return (
    <div className="flex flex-col space-y-6 max-w-3xl">
      {/* Título general */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Registro de Decisión
      </h2>

      {/* Sala y Tipo */}
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-6">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Forma de Resolución
          </label>
          <SelectDropdown
            handleSelect={handleFormaResolucion}
            list={data.forma_resolucion}
            className="w-full"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Tipo de Auto Supremo
          </label>
          <SelectDropdown
            handleSelect={handleResuelveFondo}
            list={data.resuelve_fondo}
            className="w-full"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            Grupo de Decisión
          </label>
          <SelectDropdown
            handleSelect={handleGrupo}
            list={lista}
            className="w-full"
          />
        </div>
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
