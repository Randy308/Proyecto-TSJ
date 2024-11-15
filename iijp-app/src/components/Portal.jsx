import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./ModalContent";
import { FaUserLock } from "react-icons/fa";
export default function Portal({
  setSettingsOpen,
  titulo = "Mostrar modal",
  status = "login",
}) {
  const showMyModal = () => {
    setShowModal(true);
    setSettingsOpen(false);
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <>

      <a
         onClick={() => showMyModal()}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group hover:cursor-pointer"
      >
        <FaUserLock className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        <span className="flex-1 ms-3 whitespace-nowrap"> {titulo}</span>
      </a>

      {showModal &&
        createPortal(
          <ModalContent status={status} onClose={() => setShowModal(false)} />,
          document.body
        )}
    </>
  );
}

