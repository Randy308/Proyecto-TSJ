import { useLocalStorage } from "../../../components/useLocalStorage";
import React, { useEffect, useState } from "react";

import TimesNewRomanRegular from "../../../fonts/times new roman.ttf";
import TimesNewRomanBold from "../../../fonts/times new roman bold.ttf";
import TimesNewRomanItalic from "../../../fonts/times new roman italic.ttf";

import TrebuchetMSRegular from "../../../fonts/trebuc.ttf";
import TrebuchetMSBold from "../../../fonts/trebucbd.ttf";
import TrebuchetMSItalic from "../../../fonts/trebucit.ttf";

import CambriaRegular from "../../../fonts/Cambriax.ttf";
import CambriaBold from "../../../fonts/Cambria Bold.ttf";
import CambriaItalic from "../../../fonts/Cambria Italic.ttf";

const EstiloTitulos = ({ titulo, estiloDefault }) => {
  const [estilo, setEstilo] = useLocalStorage(titulo, estiloDefault);

  const [tempEstilo, setTempEstilo] = useState(estilo);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const parsedValue = [
      "fontSize",
      "marginLeft",
      "paddingBottom",
      "marginTop",
    ].includes(name)
      ? parseInt(value, 10)
      : value;

    setTempEstilo((prevEstilo) => ({
      ...prevEstilo,
      [name]: parsedValue,
    }));
  };

  const handleFont = (event) => {
    const { name, value } = event.target;

    const parsedValue =
      name === "fontSize" ? `${parseInt(value, 10)}pt` : value;

    setTempEstilo((prevEstilo) => ({
      ...prevEstilo,
      [name]: parsedValue,
    }));
  };

  const guardarEnStorage = () => {
    setEstilo(tempEstilo);
  };

  useEffect(() => {
    setTempEstilo(estilo);
  }, [estilo]);

  return (
    <div>
      {" "}
      <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Fuente:
          <select
            name="fontFamily"
            value={tempEstilo.fontFamily}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
          >
            <option value="Cambria">Cambria</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Alineación:
          <select
            name="textAlign"
            value={tempEstilo.textAlign}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
            <option value="justify">Justificado</option>
          </select>
        </label>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Peso:
          <select
            name="fontWeight"
            value={tempEstilo.fontWeight}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
          </select>
        </label>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tamaño:
          <input
            name="fontSize"
            type="number"
            min={10}
            max={60}
            step={1}
            value={parseInt(tempEstilo.fontSize) || 10}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleFont}
          ></input>
        </label>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Margen Derecho:
          <input
            name="marginLeft"
            type="number"
            min={0}
            max={80}
            step={5}
            value={tempEstilo.marginLeft}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
          ></input>
        </label>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Margen Top:
          <input
            name="marginTop"
            type="number"
            min={0}
            max={80}
            step={5}
            value={tempEstilo.marginTop}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
          ></input>
        </label>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Padding Bottom:
          <input
            name="paddingBottom"
            type="number"
            min={0}
            max={80}
            step={5}
            value={tempEstilo.paddingBottom}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
          ></input>
        </label>
        {/* Botón de guardar (opcional) */}
        <button
          type="button"
          className="bg-blue-600 text-white rounded-md p-2"
          onClick={() => guardarEnStorage()}
        >
          Guardar Estilo
        </button>
      </div>
      {/* Título que muestra el estilo seleccionado */}
      <h1 style={tempEstilo}>Este es el título con estilo personalizado</h1>
    </div>
  );
};

export default EstiloTitulos;
