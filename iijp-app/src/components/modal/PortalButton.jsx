import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./ModalContent";
import { FaPlay } from "react-icons/fa6";
import LargeModal from "./LargeModal";

const PortalButton = ({
  title,
  name,
  Icon = FaPlay,
  full = true,
  content,
  color = "blue",
  large = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const modalIcon = useMemo(
    () => <Icon className={`w-4 h-4 ${name ? "mr-2" : ""}`} />,
    []
  );

  const buttonColorClasses = {
    blue: "bg-blue-700 hover:bg-blue-800 active:bg-blue-600",
    red: "bg-red-700 hover:bg-red-800 active:bg-red-600",
    green: "bg-green-700 hover:bg-green-800 active:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-400",
  };

  const modalProps = {
    title,
    onClose: () => setShowModal(false),
    content: content(showModal, setShowModal),
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center px-4 py-3 ${
          full ? "w-full" : ""
        } rounded-lg font-medium text-white ${
          buttonColorClasses[color] || buttonColorClasses.blue
        } text-xs`}
      >
        {modalIcon}
        {name && <span>{name}</span>}
      </button>

      {showModal &&
        createPortal(
          large ? (
            <LargeModal {...modalProps} />
          ) : (
            <ModalContent {...modalProps} />
          ),
          document.body
        )}
    </>
  );
};

export default PortalButton;
