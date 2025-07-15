import React from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

interface BtnProps{
  visible:boolean;
  titulo:string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
const BtnDropdown = ({ setVisible, visible, titulo }:BtnProps) => {
  return (
    <button
      type="button"
      onClick={() => setVisible((prev) => !prev)}
      className="w-full justify-between text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
    >
      {titulo}
      {visible ? (
        <IoIosArrowUp className="w-6 h-5 me-2 -ms-1 text-blue-700" />
      ) : (
        <IoIosArrowDown className="w-6 h-5 me-2 -ms-1" />
      )}
    </button>
  );
};

export default BtnDropdown;
