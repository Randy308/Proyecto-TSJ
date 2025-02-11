import React from "react";
import ReactDOM from "react-dom";
import { IoMdClose } from "react-icons/io";
import Login from "../../auth/Login"; 

export default function ModalContent({ onClose, title, content }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#242E42] p-6 rounded-lg shadow-lg w-full max-w-md">
        <div
          className={`modal-header flex flex-row items-center ${
            title ? "justify-between" : "justify-end"
          }`}
        >
          {title && (
            <h5 className="modal-title text-center text-black dark:text-white">
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
        <div className="modal-body">{content || <Login />}</div>{" "}
      </div>
    </div>,
    document.body
  );
}
