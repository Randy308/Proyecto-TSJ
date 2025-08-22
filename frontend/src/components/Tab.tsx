import React from "react";
import { useAnalisisContext } from "../context";

interface TabProps {
  children?: React.ReactNode;
  actual: string;
  setActual: (value: string) => void;
}

const lista = [
  { name: "Tabla", value: "tabla" },
  { name: "Gráfico", value: "grafico" },
  { name: "Series Temporales", value: "series" },
  { name: "Mapa", value: "mapa" },
];
const Tab = ({ children, actual, setActual }: TabProps) => {
  const { groupByDepartamento, groupByPeriodo } = useAnalisisContext();

  return (
    <div className="flex-1 flex flex-col p-2">
      <div>
        <ul className="flex flex-row gap-2 justify-start items-center border-b-2 dark:border-gray-700 border-gray-300">
          {lista.map((item) => {
            if (item.value === "mapa" && !groupByDepartamento) {
              return null; // No renderiza "Mapa"
            }

            if (item.value === "series" && !groupByPeriodo) {
              return null; // No renderiza "Mapa"
            }
            return (
              <li
                key={item.value}
                onClick={() => setActual(item.value)}
                className={`p-4 hover:cursor-pointer rounded-t-md w-30 ${
                  actual === item.value
                    ? "border-x border-t border-gray-300 dark:text-gray-300 dark:border-gray-700 bg-white -mb-0.5 dark:bg-[#100C2A]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400"
                }`}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="dark:bg-[#100C2A] border border-t-0 dark:border-gray-600 dark:text-gray-300 bg-white text-black p-0 md:p-2 rounded-b-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Tab;
