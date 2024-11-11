import Login from "../auth/Login";
import Register from "../auth/Register";
import React from "react";
import ReactDOM from "react-dom";
import { IoMdClose } from "react-icons/io";

export default function ModalContent({ onClose, status }) {
  const renderContent = () => {
    switch (status) {
      case "registrar":
        return <Register />;

      case "login":
        return <Login />;

      default:
        return (
          <div>
            <h1>Error occurred</h1>
            <p>Intente de nuevo.</p>
          </div>
        );
    }
  };

  // Dynamic title based on the status
  const modalTitle =
    status === "registrar"
      ? "Register"
      : status === "login"
      ? "Iniciar sesión"
      : "Error";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#242E42] p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="modal-header flex flex-row items-center justify-between">
          <h5 className="modal-title text-center text-black dark:text-white">
            {modalTitle} {/* Dynamic title */}
          </h5>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-[#242E42] text-black dark:text-white rounded hover:bg-gray-200 transition duration-200"
            aria-label="Close"
          >
            <IoMdClose className="w-7 h-7" />
          </button>
        </div>
        <div className="modal-body">{renderContent()}</div>{" "}
        {/* Call the function */}
      </div>
    </div>,
    document.body
  );
}
