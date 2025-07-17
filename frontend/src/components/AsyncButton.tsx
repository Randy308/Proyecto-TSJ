import React, { useMemo } from "react";
import { FaPlay } from "react-icons/fa6";
import { useIcons } from "./icons/Icons";


interface AsyncProps {
  asyncFunction: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isLoading: boolean;
  name: string;
  full?: boolean;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}


const AsyncButton = ({
  asyncFunction,
  isLoading,
  name,
  full = true,
  Icon = FaPlay,
}: AsyncProps) => {

  const playIcon = useMemo(() => {
    return <Icon className="fill-current w-4 h-4 mr-2" />;
  }, [Icon]);

  const { spinIcon } = useIcons();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading) return;
    await asyncFunction(e);
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center h-12 px-4 py-3 ${
        full ? "w-full " : ""
      }rounded-lg font-medium ${
        isLoading
          ? "text-gray-900 bg-white cursor-not-allowed border shadow-lg border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
          : "text-white active bg-red-octopus-700 hover:bg-red-octopus-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-xs"
      }`}
      disabled={isLoading}
    >
      {isLoading ? spinIcon : playIcon}
      <span className="ms-3">
        {isLoading ? "Cargando..." : name}
      </span>
    </button>
  );
};

export default AsyncButton;
