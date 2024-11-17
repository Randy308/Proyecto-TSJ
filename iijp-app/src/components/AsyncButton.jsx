import React from "react";
import { CgSpinner } from "react-icons/cg";
const AsyncButton = ({ asyncFunction,isLoading, name }) => {
  return (
    <>
      <button
        type="button"
        onClick={(e) => asyncFunction(e)}
        className={`inline-flex items-center px-4 py-3 rounded-lg font-medium w-full ${
          isLoading
            ? "text-gray-900 bg-white cursor-not-allowed"
            : "text-white bg-blue-500 active dark:bg-blue-600 hover:bg-blue-800"
        }`}
        disabled={isLoading}
      >
        {isLoading && (
          <CgSpinner className="inline w-5 h-5 me-3 text-blue-500 animate-spin dark:text-gray-600" />
        )}
        {isLoading ? "Cargando..." : name}
      </button>
    </>
  );
};

export default AsyncButton;
