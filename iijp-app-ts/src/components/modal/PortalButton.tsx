import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./ModalContent";
import { FaPlay } from "react-icons/fa6";
import LargeModal from "./LargeModal";

type Color = "blue" | "red" | "green" | "yellow" | "link" | "gray";
interface PortalButtonProps {
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  name: string;
  Icon?: React.ComponentType<{ className?: string }>;
  full?: boolean;
  content: (showModal: boolean, setShowModal: (val: boolean) => void) => React.ReactNode; 
  color?: Color;
  large?: boolean;
  withIcon?: boolean;
}

const PortalButton = ({
  title,
  name,
  Icon = FaPlay,
  full = true,
  content,
  color = "blue",
  large = false,
  withIcon = true,
}: PortalButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  const modalIcon = useMemo(
    () => <Icon className={`w-4 h-4 ${name ? "mr-2" : ""}`} />,
    []
  );

  const buttonColorClasses = {
    blue: "bg-blue-700 hover:bg-blue-800 active:bg-blue-600 text-white",
    red: "bg-red-700 hover:bg-red-800 active:bg-red-600 text-white",
    green: "bg-green-700 hover:bg-green-800 active:bg-green-600 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-400 text-white",
    link: "bg-transparent text-blue-700 hover:text-blue-800 active:text-blue-600",
    gray: "bg-gray-700 hover:bg-gray-800 active:bg-gray-600 text-white",
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
        className={`inline-flex items-center gap-1 px-4 py-3 ${
          full ? "w-full" : ""
        } rounded-lg font-medium  ${
          buttonColorClasses[color] || buttonColorClasses.blue
        } `}
      >
        {withIcon && modalIcon}
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
