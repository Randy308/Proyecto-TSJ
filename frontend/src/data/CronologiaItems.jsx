import { FaClipboardList } from "react-icons/fa";
import { FaBinoculars } from "react-icons/fa";
import { FaHeading } from "react-icons/fa";
import { LuPencilRuler } from "react-icons/lu";
export const cronologiaItems = [
  {
    id: 1,
    title: "Materias",
    icon: (className) => <FaBinoculars className={className} />,
    componente:  (props) => <LuPencilRuler {...props} />,
  },
  {
    id: 2,
    title: "Filtros",
    icon: (className) => <FaClipboardList className={className} />,
    componente:  (className, props) => <LuPencilRuler {...props} />,
  },
  {
    id: 3,
    title: "Resoluciones",
    icon: (className) => <LuPencilRuler className={className} />,
    componente:  (className, props) => <LuPencilRuler {...props} />,
  },
  {
    id: 4,
    title: "Tipografía",
    icon: (className) => <FaHeading className={className} />,
    componente:  (className, props) => <LuPencilRuler {...props} />,
  },
  // {
  //   id: 5,
  //   title: "Disabled",
  //   icon: (className) => <FaBinoculars className={className} />,
  //   componente:  (className, props) => <LuPencilRuler {...props} />,
  // },
];
//inline-flex items-center px-4 py-3 rounded-lg w-full text-gray-400 cursor-not-allowed bg-gray-50 w-full dark:bg-gray-800 dark:text-gray-500
