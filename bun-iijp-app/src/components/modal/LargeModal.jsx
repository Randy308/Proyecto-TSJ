import React from "react";
import ReactDOM from "react-dom";
import { IoMdClose } from "react-icons/io";
import Login from "../../auth/Login";

export default function LargeModal({ onClose, title, content }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
      <div className="bg-white dark:bg-gray-800 m-2 rounded-lg shadow-lg w-[90vw] sm:w-[70vw] h-[90vh]  flex-col">
        <div className="p-4 flex justify-between text-center rounded-t-lg bg-red-octopus-900 dark:bg-gray-700 text-white ">
          <p className="modal-title flex flex-row gap-4 justify-center items-center uppercase text-lg font-semibold">
            Análisis Documental
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-white rounded hover:text-gray-300 transition duration-200"
            aria-label="Close"
          >
            <IoMdClose className="w-7 h-7" />
          </button>
        </div>

        {/* Scroll only here */}
        <div

        >
          {content || <Login />}
        </div>
      </div>
    </div>,
    document.body
  );
}
