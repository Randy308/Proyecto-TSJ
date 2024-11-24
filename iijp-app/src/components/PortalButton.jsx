import React, { useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./ModalContent";
import { FaPlay } from "react-icons/fa6";

const PortalButton = ({
  title,
  name,
  Icon = FaPlay,
  full = true,
  content,
  color = "blue", 
}) => {
  const showMyModal = () => {
    setShowModal(true);
  };

  const [showModal, setShowModal] = useState(false);


  const buttonColorClasses = {
    blue: "bg-blue-700 hover:bg-blue-800 active:bg-blue-600",
    red: "bg-red-700 hover:bg-red-800 active:bg-red-600",
    green: "bg-green-700 hover:bg-green-800 active:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-400",

  };

  return (
    <>
      <button
        type="button"
        onClick={() => showMyModal()}
        className={`inline-flex items-center px-4 py-3 ${
          full ? "w-full" : ""
        } rounded-lg font-medium text-white ${
          buttonColorClasses[color] || buttonColorClasses.blue
        } text-xs`}
      >
        <Icon className={`fill-current w-4 h-4 ${name && "mr-2"}`} />
        {name && <span>{name}</span>}
      </button>

      {showModal &&
        createPortal(
          <ModalContent
            title={title}
            onClose={() => setShowModal(false)}
            content={content}
          />,
          document.body
        )}
    </>
  );
};

export default PortalButton;
