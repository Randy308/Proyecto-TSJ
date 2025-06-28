import React, { useMemo } from "react";
import { BsCheck2All } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { FaTrashAlt } from "react-icons/fa";
import { FaPlay, FaPause, FaStop } from "react-icons/fa6"; // Ejemplo
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineCleaningServices, MdOutlineRemoveCircle } from "react-icons/md";

// Nota: Este hook personalizado debe usarse dentro de un componente React.
export const useIcons = () => {
  const playIcon = useMemo(
    () => <FaPlay className="fill-current w-4 h-4 mr-2" />,
    []
  );
  const pauseIcon = useMemo(
    () => <FaPause className="fill-current w-4 h-4 mr-2" />,
    []
  );
  const stopIcon = useMemo(
    () => <FaStop className="fill-current w-4 h-4 mr-2" />,
    []
  );
  const spinIcon = useMemo(
    () => (
      <CgSpinner className="inline w-5 h-5 text-red-octopus-500 animate-spin dark:text-gray-200" />
    ),
    []
  );

  const arrowUpIcon = useMemo(
    () => <IoIosArrowUp className="fill-current w-4 h-4 dark:text-white" />,
    []
  );
  const arrowDownIcon = useMemo(
    () => <IoIosArrowDown className="fill-current w-4 h-4 dark:text-white" />,
    []
  );

  const cleanIcon = useMemo(
    () => <MdOutlineCleaningServices className="fill-current w-4 h-4 mr-2" />,
    []
  );

  const trashIcon = useMemo(
    () => <FaTrashAlt className="text-white fill-current w-4 h-4" />,
    []
  );


    const checkAllIcon = useMemo(
    () =>   <BsCheck2All className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />,
    []
  );
    const removeAllIcon = useMemo(
    () =>    <MdOutlineRemoveCircle className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />,
    []
  );


  return {
    playIcon,
    pauseIcon,
    stopIcon,
    spinIcon,
    cleanIcon,
    arrowUpIcon,
    arrowDownIcon,
    trashIcon,
    checkAllIcon,
    removeAllIcon
  };
};
