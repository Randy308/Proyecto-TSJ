import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FaPlay } from "react-icons/fa6";
const AsyncButton = ({ asyncFunction, isLoading, name, full = true }) => {
  return (
    <>
      <button
        type="button"
        onClick={(e) => asyncFunction(e)}
        className={`inline-flex items-center px-4 py-3 ${
          full ? "w-full " : " "
        }rounded-lg font-medium  ${
          isLoading
            ? "text-gray-900 bg-white cursor-not-allowed"
            : "text-white bg-blue-500 active dark:bg-blue-600 hover:bg-blue-800 text-xs"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <CgSpinner className="inline w-5 h-5 me-3 text-blue-500 animate-spin dark:text-gray-600" />
        ) : (
          <FaPlay className="fill-current w-4 h-4 mr-2" />
        )}
        {isLoading ? <span>Cargando...</span> : <span>{name}</span>}
      </button>
    </>
  );
};

export default AsyncButton;
