import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./ModalContent";

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
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white hover:cursor-pointer"
        onClick={() => showMyModal()}
      >
        {titulo}
      </a>
      {showModal &&
        createPortal(
          <ModalContent status={status} onClose={() => setShowModal(false)} />,
          document.body
        )}
    </>
  );
}
