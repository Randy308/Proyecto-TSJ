import React from "react";

interface TabProps {
  children?: React.ReactNode;
  actual: boolean;
  setActual: (value: boolean) => void;
}
const Tab = ({ children, actual, setActual }: TabProps) => {
  return (
    <div className="lg:col-span-4 md:col-span-3 flex flex-col p-2">
      <div>
        <ul className="flex flex-row  gap-2 justify-start items-center border-b-2 dark:border-gray-700 border-gray-300">
          <li
            className={`p-4 hover:cursor-pointer rounded-t-md w-30 ${
              actual
                ? "border-x border-t border-gray-300 dark:text-gray-300 dark:border-gray-700 bg-white -mb-0.5 dark:bg-gray-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400"
            }`}
          >
            <a className="w-full h-full" onClick={() => setActual(true)}>
              Gráfico
            </a>
          </li>
          <li
            className={`p-4 hover:cursor-pointer px-6 rounded-t-md ${
              !actual
                ? "border-x border-t border-gray-300 dark:text-gray-300 dark:border-gray-700 bg-white -mb-0.5 dark:bg-gray-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400"
            }`}
          >
            <a className="w-full h-full" onClick={() => setActual(false)}>
              Tabla
            </a>
          </li>
        </ul>
      </div>
      <div className="dark:bg-gray-600 border border-t-0 dark:text-gray-300 bg-white text-black p-0 md:p-2 rounded-b-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Tab;
