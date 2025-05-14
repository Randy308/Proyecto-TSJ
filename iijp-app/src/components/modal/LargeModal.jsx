import React from "react";
import ReactDOM from "react-dom";
import { IoMdClose } from "react-icons/io";
import Login from "../../auth/Login";

export default function LargeModal({ onClose, title, content }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
      <div className="bg-white dark:bg-[#242E42] p-2 rounded-lg shadow-lg w-[90vw] max-h-[90vh] flex flex-col">
        <div
          className={`modal-header flex flex-row items-center ${
            title ? "justify-between" : "justify-end"
          }`}
        >
          {title && (
            <h5 className="modal-title text-black dark:text-white font-bold">
              {title}
            </h5>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-[#242E42] text-black dark:text-white rounded hover:bg-gray-200 transition duration-200"
            aria-label="Close"
          >
            <IoMdClose className="w-7 h-7" />
          </button>
        </div>

        {/* Scroll only here */}
        <div className="modal-body overflow-y-auto mt-2 pr-2" style={{ flex: 1 }}>
          {content || <Login />}
        </div>
      </div>
    </div>,
    document.body
  );
}
