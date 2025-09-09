import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ModalContent from "./ModalContent";
import { FaPlay } from "react-icons/fa6";
import LargeModal from "./LargeModal";

type Color = "blue" | "red" | "green" | "yellow" | "link" | "gray";
interface PortalButtonProps {
  setSettingsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  name?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  full?: boolean;
  content: (
    showModal: boolean,
    setShowModal: (val: boolean) => void
  ) => React.ReactNode;
  color?: Color;
  large?: boolean;
  withIcon?: boolean;
}

const PortalAnchor = ({
  title,
  name,
  color,
  Icon = FaPlay,
  content,
  large = false,
  withIcon = true,
}: PortalButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  const modalIcon = useMemo(
    () => (
      <Icon
        className={`group-hover:text-gray-900 dark:group-hover:text-white ${
          name
            ? "mr-2 w-5 h-5 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400"
            : "w-7 h-7 text-white "
        }`}
      />
    ),
    [Icon, name]
  );

  const modalProps = {
    title,
    onClose: () => setShowModal(false),
    content: content(showModal, setShowModal),
  };

  return (
    <>
      <a
        href="#"
        onClick={() => setShowModal(true)}
        className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
      >
        {withIcon && modalIcon}
        {name && <span className={`ms-3 ${color === 'link' ? "text-blue-400" : "text-gray-900"}`}>{name}</span>}
      </a>
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

export default PortalAnchor;
