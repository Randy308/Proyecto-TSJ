import { useLocalStorage } from "../../../components/useLocalStorage";
import React, { useEffect, useState } from "react";

import "../../../fonts/trebuc.ttf";
import "../../../fonts/trebucbd.ttf";
import "../../../fonts/trebucit.ttf";
import { toast } from "react-toastify";

import { IoMdArrowDropdown } from "react-icons/io";

const EstiloTitulos = ({
  titulo,
  estiloDefault,
  isPreview = false,
  id,
  setVisible,
  visible,
}) => {
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
  const handleMarginLeft = (event) => {
    const { name, value } = event.target;

    const parsedValue =
      name === "marginLeft" ? `${parseInt(value, 0)}%` : value;

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
    toast.success("Estilo actualizado ");
  };

  const [activo, setActivo] = useState(false);

  const setTabActivo = () => {
    setVisible((prev) => (prev === id ? false : id));
  };

  const transformTitle = (title) => {
    // Verifica si el título sigue el formato "descriptor-<número>"
    if (/^descriptor(-?\d+)$/.test(title)) {
      // Si es "descriptor-<número>", formatea como "Descriptor-<número>"
      return title.replace(/^descriptor(-?\d+)$/, (match, number) => {
        return `Descriptor-${number}`;
      });
    } else {
      // Si no es "descriptor", solo pone el primer carácter en mayúsculas
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
  };

  useEffect(() => {
    if (visible != id) {
      setActivo(true);
    }
  }, [visible]);

  useEffect(() => {
    setTempEstilo(estilo);
  }, [estilo]);

  return (
    <div>
      {isPreview ? (
        // Renderiza solo el título en modo previsualización
        <div>
          <div style={tempEstilo}>{transformTitle(titulo)}</div>
        </div>
      ) : (
        // En el modo normal, renderiza el título con controles para personalizar el estilo
        <div>
          <div
            className="bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-900 m-2 p-4 hover:cursor-pointer flex flex-row justify-between rounded-md"
            onClick={() => setTabActivo()}
          >
            <div>{transformTitle(titulo)}</div>

            <div>
              <IoMdArrowDropdown />
            </div>
          </div>
          <div
            className={`bg-gray-100 dark:bg-gray-500 border border-gray-300 m-2 p-4 hover:cursor-pointer flex flex-col justify-between ${
              visible === id ? "" : "hidden"
            }`}
          >
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
                  <option value="cambria">Cambria</option>
                  <option value="Arial">Arial</option>
                  <option value="trebuchet_ms">Trebuchet Ms</option>
                  <option value="times_new_roman">Times New Roman</option>
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
                </select>
              </label>

              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Estilo de fuente:
                <select
                  name="fontStyle"
                  value={tempEstilo.fontStyle}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleChange}
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="oblique">Oblique</option>
                </select>
              </label>

              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Decoración de texto:
                <select
                  name="textDecoration"
                  value={tempEstilo.textDecoration}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="line-through">Line-through</option>
                  <option value="overline">Overline</option>
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
              <label
                htmlFor="hs-color-input"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Color del texto:
                <input
                  type="color"
                  name="color"
                  onChange={handleChange}
                  className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg 
        disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                  id="hs-color-input"
                  value={tempEstilo.color}
                  title="Choose your color"
                />
              </label>

              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Margen Derecho:
                <input
                  name="marginLeft"
                  type="number"
                  min={0}
                  max={90}
                  step={1}
                  value={parseInt(tempEstilo.marginLeft) || 0}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleMarginLeft}
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
            <div className="bg-white">
              <h1 style={tempEstilo}>
                Este es el título con estilo personalizado
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstiloTitulos;
